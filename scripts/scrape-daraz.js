import dotenv from 'dotenv';
import pg from 'pg';
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import PQueue from 'p-queue';

dotenv.config();

// stealth plugin to avoid detection
puppeteer.use(StealthPlugin());

const { Pool } = pg;
const pool = new Pool({
	connectionString: process.env.DATABASE_URL,
	ssl: { rejectUnauthorized: false },
});

//  Helper: Extract wattage from text
function extractWattage(text) {
	if (!text) return null;
	const patterns = [
		/(\d+(?:\.\d+)?)\s*[Ww](?:atts?)?\b/i,
		/(\d+(?:\.\d+)?)\s*-?\s*[Ww]/i,
		/power:\s*(\d+)\s*W/i,
		/rated power:\s*(\d+)\s*W/i,
		/consumption:\s*(\d+)\s*W/i,
	];
	for (let pattern of patterns) {
		const match = text.match(pattern);
		if (match) return Math.round(parseFloat(match[1]));
	}
	return null;
}

//  Helper: Generate slug
function generateSlug(name, brand, watts) {
	let base = `${brand || ''} ${name}`.toLowerCase();
	base = base.replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
	if (watts) base += `-${watts}w`;
	return base;
}

//  Helper: Get or create brand
async function getBrandId(brandName) {
	if (!brandName) return null;
	const res = await pool.query(
		`INSERT INTO brands (name, slug, origin_country)
     VALUES ($1, $2, 'Pakistan')
     ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name
     RETURNING id`,
		[brandName, brandName.toLowerCase().replace(/[^a-z0-9]+/g, '-')],
	);
	return res.rows[0].id;
}

//  Helper: Get category id by keyword mapping
// You can expand this mapping based on your categories.slug
const categoryKeywords = {
	'ceiling-fans': ['ceiling fan', 'ceiling fans'],
	'pedestal-fans': ['pedestal fan', 'stand fan'],
	'table-fans': ['table fan', 'desk fan'],
	'exhaust-fans': ['exhaust fan', 'ventilation fan'],
	'air-conditioners': ['air conditioner', 'ac', 'inverter ac'],
	refrigerators: ['refrigerator', 'fridge'],
	'washing-machines': ['washing machine', 'washer'],
	'microwave-ovens': ['microwave oven', 'microwave'],
	'electric-kettles': ['electric kettle', 'kettle'],
	// add more as needed
};

async function getCategoryId(productName) {
	const lowerName = productName.toLowerCase();
	for (const [slug, keywords] of Object.entries(categoryKeywords)) {
		if (keywords.some((kw) => lowerName.includes(kw))) {
			const res = await pool.query(
				'SELECT id FROM categories WHERE slug = $1',
				[slug],
			);
			if (res.rows.length) return res.rows[0].id;
		}
	}
	return null; // uncategorized – will be skipped or you can assign a default
}

//  Scrape a single Daraz product page
async function scrapeDarazProduct(pageUrl) {
	const browser = await puppeteer.launch({ headless: true });
	const page = await browser.newPage();
	await page.setUserAgent(
		'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
	);

	try {
		await page.goto(pageUrl, { waitUntil: 'networkidle2', timeout: 30000 });

		// Product name
		const name = await page
			.$eval('[data-qa="product-title"]', (el) => el.innerText.trim())
			.catch(() => null);
		if (!name) return null;

		// Price (PKR) – remove non-digits
		const priceText = await page
			.$eval('[data-qa="product-price"]', (el) =>
				el.innerText.replace(/[^0-9]/g, ''),
			)
			.catch(() => '0');
		const price = parseInt(priceText, 10) || 0;

		// Brand (often in breadcrumb or meta)
		let brand = null;
		const brandElem = await page.$('.pdp-product-brand .brand-name');
		if (brandElem)
			brand = await brandElem.evaluate((el) => el.innerText.trim());
		if (!brand) {
			// try meta
			const metaBrand = await page
				.$eval('meta[property="product:brand"]', (el) => el.content)
				.catch(() => null);
			if (metaBrand) brand = metaBrand;
		}

		// Model (often from SKU or model field)
		let model = null;
		const modelElem = await page.$('.pdp-product-details .detail-list-item');
		if (modelElem) {
			const modelText = await modelElem.evaluate((el) => el.innerText);
			const match = modelText.match(/model:?\s*([^\n]+)/i);
			if (match) model = match[1].trim();
		}

		// Wattage – first from title, then from technical details
		let wattage = extractWattage(name);
		if (!wattage) {
			const techRows = await page.$$('.pdp-product-details .detail-list-item');
			for (let row of techRows) {
				const label = await row
					.$eval('.detail-list-item-label', (el) => el.innerText.trim())
					.catch(() => '');
				if (
					label.toLowerCase().includes('power') ||
					label.toLowerCase().includes('wattage')
				) {
					const value = await row.$eval(
						'.detail-list-item-value',
						(el) => el.innerText,
					);
					wattage = extractWattage(value);
					if (wattage) break;
				}
			}
		}

		await browser.close();
		return { name, price, brand, model, wattage, url: pageUrl };
	} catch (err) {
		console.error(`Error scraping ${pageUrl}:`, err.message);
		await browser.close();
		return null;
	}
}

//  Scrape a category search result page
async function scrapeCategory(searchKeyword, maxProducts = 100) {
	const browser = await puppeteer.launch({ headless: true });
	const page = await browser.newPage();
	const searchUrl = `https://www.daraz.pk/catalog/?q=${encodeURIComponent(searchKeyword)}`;
	await page.goto(searchUrl, { waitUntil: 'networkidle2' });

	// Get product links from search results
	const productLinks = await page.$$eval('a[data-qa="product-name"]', (links) =>
		links.map((a) => a.href).slice(0, maxProducts),
	);
	await browser.close();

	// Process products with concurrency limit (3 at a time)
	const queue = new PQueue({ concurrency: 3 });
	const results = [];

	for (const link of productLinks) {
		queue.add(async () => {
			const product = await scrapeDarazProduct(link);
			if (product && product.wattage) {
				results.push(product);
			}
			// Small delay to be polite
			await new Promise((resolve) => setTimeout(resolve, 1000));
		});
	}

	await queue.onIdle();
	return results;
}

//  Save scraped products to database
async function saveProducts(products) {
	let inserted = 0,
		skipped = 0;
	for (const prod of products) {
		const brandId = await getBrandId(prod.brand);
		if (!brandId) {
			console.log(`Skipping ${prod.name}: no brand`);
			skipped++;
			continue;
		}
		const categoryId = await getCategoryId(prod.name);
		if (!categoryId) {
			console.log(`Skipping ${prod.name}: cannot determine category`);
			skipped++;
			continue;
		}

		const slug = generateSlug(prod.name, prod.brand, prod.wattage);
		const result = await pool.query(
			`INSERT INTO appliances
        (name, slug, brand_id, category_id, model, watts, price_pkr, voltage, frequency_hz, source_url, last_scraped)
       VALUES ($1, $2, $3, $4, $5, $6, $7, 220, 50, $8, NOW())
       ON CONFLICT (slug) DO NOTHING
       RETURNING id`,
			[
				prod.name,
				slug,
				brandId,
				categoryId,
				prod.model,
				prod.wattage,
				prod.price,
				prod.url,
			],
		);
		if (result.rowCount > 0) inserted++;
		else skipped++;
	}
	console.log(
		`Saved: ${inserted} new, skipped (duplicate or missing): ${skipped}`,
	);
}

//  Main
async function main() {
	// Define the search terms for each category you want to scrape
	const searches = [
		{ keyword: 'ceiling fan', categorySlug: 'ceiling-fans' },
		{ keyword: 'pedestal fan', categorySlug: 'pedestal-fans' },
		{ keyword: 'table fan', categorySlug: 'table-fans' },
		{ keyword: 'air conditioner', categorySlug: 'air-conditioners' },
		{ keyword: 'refrigerator', categorySlug: 'refrigerators' },
		{ keyword: 'washing machine', categorySlug: 'washing-machines' },
		{ keyword: 'microwave oven', categorySlug: 'microwave-ovens' },
		{ keyword: 'electric kettle', categorySlug: 'electric-kettles' },
	];

	for (const search of searches) {
		console.log(`\n🔍 Scraping: ${search.keyword}`);
		const products = await scrapeCategory(search.keyword, 30); // max 30 per category
		console.log(`Found ${products.length} products with wattage`);
		await saveProducts(products);
	}

	console.log('\n✅ Scraping completed.');
	await pool.end();
}

main().catch((err) => {
	console.error('Fatal error:', err);
	process.exit(1);
});
