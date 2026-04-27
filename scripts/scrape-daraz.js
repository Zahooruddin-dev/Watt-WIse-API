import dotenv from 'dotenv';
import pg from 'pg';
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import PQueue from 'p-queue';
import fs from 'fs';
import path from 'path';

dotenv.config();
puppeteer.use(StealthPlugin());

const { Pool } = pg;
const pool = new Pool({
	connectionString: process.env.DATABASE_URL,
	ssl: { rejectUnauthorized: false },
});

// ─── Debug helpers ────────────────────────────────────────────────────────────

const DEBUG_DIR = './debug-screenshots';
if (!fs.existsSync(DEBUG_DIR)) fs.mkdirSync(DEBUG_DIR);

async function debugSnapshot(page, label) {
	const safe = label.replace(/[^a-z0-9]/gi, '_');
	const file = path.join(DEBUG_DIR, `${safe}_${Date.now()}.png`);
	await page.screenshot({ path: file, fullPage: false });
	console.log(`  📸 Screenshot saved: ${file}`);
}

// ─── Wattage extraction ───────────────────────────────────────────────────────

function extractWattage(text) {
	if (!text) return null;
	const patterns = [
		/(\d+(?:\.\d+)?)\s*[Ww](?:att?s?)?\b/,
		/(\d+(?:\.\d+)?)\s*-?\s*W\b/,
		/power[:\s]+(\d+)\s*W/i,
		/rated[:\s]+(\d+)\s*W/i,
		/consumption[:\s]+(\d+)\s*W/i,
	];
	for (const re of patterns) {
		const m = text.match(re);
		if (m) {
			const w = Math.round(parseFloat(m[1]));
			if (w >= 1 && w <= 20000) return w; // sanity range
		}
	}
	return null;
}

// ─── DB helpers ───────────────────────────────────────────────────────────────

function generateSlug(name, brand, watts) {
	let base = `${brand || ''} ${name}`.toLowerCase();
	base = base.replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
	if (watts) base += `-${watts}w`;
	return base.slice(0, 200);
}

async function getBrandId(brandName) {
	if (!brandName) return null;
	const slug = brandName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
	const res = await pool.query(
		`INSERT INTO brands (name, slug, origin_country)
     VALUES ($1, $2, 'Pakistan')
     ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name
     RETURNING id`,
		[brandName, slug],
	);
	return res.rows[0].id;
}

const categoryKeywords = {
	'ceiling-fans':     ['ceiling fan'],
	'pedestal-fans':    ['pedestal fan', 'stand fan'],
	'table-fans':       ['table fan', 'desk fan'],
	'exhaust-fans':     ['exhaust fan', 'ventilation fan'],
	'wall-fans':        ['wall fan', 'bracket fan'],
	'air-conditioners': ['air conditioner', 'inverter ac', ' ac '],
	'air-coolers':      ['air cooler', 'room cooler'],
	refrigerators:      ['refrigerator', 'fridge'],
	'washing-machines': ['washing machine', 'washer'],
	'microwave-ovens':  ['microwave'],
	'electric-kettles': ['kettle'],
	'electric-irons':   ['steam iron', 'dry iron', 'electric iron'],
	'water-pumps':      ['water pump', 'motor pump'],
	'water-heaters':    ['geyser', 'water heater'],
	'led-tvs':          ['smart tv', 'led tv', 'qled'],
};

async function getCategoryId(productName) {
	const lower = ` ${productName.toLowerCase()} `;
	for (const [slug, kws] of Object.entries(categoryKeywords)) {
		if (kws.some((kw) => lower.includes(kw))) {
			const res = await pool.query('SELECT id FROM categories WHERE slug = $1', [slug]);
			if (res.rows.length) return res.rows[0].id;
		}
	}
	return null;
}

// ─── Browser factory (shared per category) ───────────────────────────────────

async function makeBrowser() {
	return puppeteer.launch({
		headless: true,
		args: [
			'--no-sandbox',
			'--disable-setuid-sandbox',
			'--disable-dev-shm-usage',
			'--disable-blink-features=AutomationControlled',
		],
	});
}

async function makePage(browser) {
	const page = await browser.newPage();
	await page.setViewport({ width: 1280, height: 800 });
	await page.setUserAgent(
		'Mozilla/5.0 (Windows NT 10.0; Win64; x64) ' +
			'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
	);
	// Block images/fonts to speed things up
	await page.setRequestInterception(true);
	page.on('request', (req) => {
		if (['image', 'font', 'media'].includes(req.resourceType())) req.abort();
		else req.continue();
	});
	return page;
}

// ─── Scroll to load lazy content ─────────────────────────────────────────────

async function autoScroll(page) {
	await page.evaluate(async () => {
		await new Promise((resolve) => {
			let total = 0;
			const dist = 300;
			const timer = setInterval(() => {
				window.scrollBy(0, dist);
				total += dist;
				if (total >= document.body.scrollHeight) {
					clearInterval(timer);
					resolve();
				}
			}, 150);
		});
	});
	await new Promise((r) => setTimeout(r, 1500));
}

// ─── Collect product links from a search page ────────────────────────────────
//
// Daraz uses obfuscated class names that change frequently.
// We target stable structural patterns instead.

const LINK_SELECTORS = [
	'a[data-qa="product-name"]',          // official QA attr (sometimes present)
	'.c2prKC a',                           // grid card link (common pattern)
	'[class*="card"] a[href*="/products/"]',
	'a[href*="daraz.pk/products/"]',
	'a[href*=".html"]',                    // broad fallback – filtered below
];

async function collectLinks(page, maxProducts) {
	await autoScroll(page);

	for (const sel of LINK_SELECTORS) {
		const links = await page.$$eval(sel, (els, max) => {
			const seen = new Set();
			const out = [];
			for (const a of els) {
				const href = a.href || '';
				if (
					href.includes('daraz.pk') &&
					(href.includes('/products/') || href.endsWith('.html')) &&
					!href.includes('/catalog/') &&
					!seen.has(href)
				) {
					seen.add(href);
					out.push(href);
					if (out.length >= max) break;
				}
			}
			return out;
		}, maxProducts);

		if (links.length > 0) {
			console.log(`  ✅ Selector "${sel}" → ${links.length} links`);
			return links;
		}
	}

	// Last-resort: dump all hrefs for debugging
	const all = await page.$$eval('a', (els) => els.map((a) => a.href).filter(Boolean));
	console.log(`  ⚠️  No product links found. Sample hrefs on page:`);
	all.slice(0, 10).forEach((h) => console.log(`     ${h}`));
	return [];
}

// ─── Scrape a single product detail page ─────────────────────────────────────

async function scrapeProductPage(browser, url) {
	const page = await makePage(browser);
	try {
		await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });

		// Wait for title
		await page
			.waitForSelector('[data-qa="product-title"], .pdp-product-title, h1', {
				timeout: 8000,
			})
			.catch(() => {});

		// Name
		const name = await page
			.$$eval(
				'[data-qa="product-title"], .pdp-product-title, h1',
				(els) => els[0]?.innerText?.trim() || null,
			)
			.catch(() => null);
		if (!name) return null;

		// Price
		const priceText = await page
			.$$eval(
				'[data-qa="product-price"], .pdp-price, .prd-price',
				(els) => els[0]?.innerText?.replace(/[^0-9]/g, '') || '0',
			)
			.catch(() => '0');
		const price = parseInt(priceText, 10) || 0;

		// Brand
		const brand = await page
			.$$eval(
				'[data-qa="pdp-brand-name"], .pdp-product-brand a, meta[property="product:brand"]',
				(els) => {
					for (const el of els) {
						const v = el.content || el.innerText?.trim();
						if (v) return v;
					}
					return null;
				},
			)
			.catch(() => null);

		// Wattage — try title first, then all visible text in specs section
		let wattage = extractWattage(name);

		if (!wattage) {
			const specText = await page
				.$$eval(
					'.specification-keys li, .pdp-product-details li, [class*="spec"] td, [class*="detail"] tr',
					(els) => els.map((e) => e.innerText).join('\n'),
				)
				.catch(() => '');
			wattage = extractWattage(specText);
		}

		if (!wattage) {
			// broad sweep of the whole page text
			const bodyText = await page
				.$eval('body', (el) => el.innerText)
				.catch(() => '');
			wattage = extractWattage(bodyText);
		}

		return { name, price, brand, wattage, url };
	} catch (err) {
		console.log(`  ⚠️  Failed ${url.slice(0, 60)}: ${err.message}`);
		return null;
	} finally {
		await page.close();
	}
}

// ─── Scrape category ─────────────────────────────────────────────────────────

async function scrapeCategory(keyword, maxProducts = 30) {
	const browser = await makeBrowser();
	const searchPage = await makePage(browser);

	const searchUrl = `https://www.daraz.pk/catalog/?q=${encodeURIComponent(keyword)}`;
	console.log(`  🌐 ${searchUrl}`);

	try {
		const resp = await searchPage.goto(searchUrl, {
			waitUntil: 'networkidle2',
			timeout: 40000,
		});
		console.log(`  📄 HTTP ${resp.status()}`);
	} catch (err) {
		console.log(`  ❌ Navigation failed: ${err.message}`);
		await debugSnapshot(searchPage, `FAIL_${keyword}`);
		await browser.close();
		return [];
	}

	const pageTitle = await searchPage.title();
	console.log(`  📝 Page title: "${pageTitle}"`);

	const links = await collectLinks(searchPage, maxProducts);
	await searchPage.close();

	if (links.length === 0) {
		await browser.close();
		return [];
	}

	// Scrape product pages with concurrency 3
	const queue = new PQueue({ concurrency: 3 });
	const results = [];

	for (const link of links) {
		queue.add(async () => {
			const product = await scrapeProductPage(browser, link);
			if (product) {
				results.push(product);
				const wLabel = product.wattage ? `${product.wattage}W` : 'no wattage';
				console.log(`  ✔ ${product.name.slice(0, 60)} [${wLabel}]`);
			}
			await new Promise((r) => setTimeout(r, 800 + Math.random() * 400));
		});
	}

	await queue.onIdle();
	await browser.close();
	return results;
}

// ─── Save to DB ───────────────────────────────────────────────────────────────

async function saveProducts(products) {
	let inserted = 0,
		skipped = 0;

	for (const prod of products) {
		const categoryId = await getCategoryId(prod.name);
		if (!categoryId) {
			console.log(`  ⏭  Skip (no category): ${prod.name.slice(0, 50)}`);
			skipped++;
			continue;
		}

		// Brand is optional — fall back to Generic
		const brandId = await getBrandId(prod.brand || 'Generic').catch(() => null);

		const slug = generateSlug(prod.name, prod.brand, prod.wattage);

		const res = await pool
			.query(
				`INSERT INTO appliances
          (name, slug, brand_id, category_id, watts, price_pkr,
           voltage, frequency_hz, is_inverter, description)
         VALUES ($1, $2, $3, $4, $5, $6, 220, 50, false, $7)
         ON CONFLICT (slug) DO UPDATE
           SET price_pkr = EXCLUDED.price_pkr,
               watts     = COALESCE(EXCLUDED.watts, appliances.watts)
         RETURNING id`,
				[
					prod.name,
					slug,
					brandId,
					categoryId,
					prod.wattage,   // nullable — schema allows it
					prod.price,
					prod.url        // stored in description since source_url doesn't exist
						? `Scraped from: ${prod.url}`
						: null,
				],
			)
			.catch((err) => {
				console.log(`  ❌ DB error for "${prod.name.slice(0, 40)}": ${err.message}`);
				return { rowCount: 0 };
			});

		if (res.rowCount > 0) inserted++;
		else skipped++;
	}

	console.log(`  💾 Saved: ${inserted} new/updated | Skipped: ${skipped}`);
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
	const searches = [
		{ keyword: 'ceiling fan' },
		{ keyword: 'pedestal fan' },
		{ keyword: 'table fan' },
		{ keyword: 'air conditioner' },
		{ keyword: 'refrigerator' },
		{ keyword: 'washing machine' },
		{ keyword: 'microwave oven' },
		{ keyword: 'electric kettle' },
	];

	for (const { keyword } of searches) {
		console.log(`\n🔍 Scraping: "${keyword}"`);
		const products = await scrapeCategory(keyword, 30);
		console.log(
			`  Found ${products.length} products (${products.filter((p) => p.wattage).length} with wattage)`,
		);
		if (products.length > 0) await saveProducts(products);
	}

	console.log('\n✅ Scraping completed.');
	await pool.end();
}

main().catch((err) => {
	console.error('Fatal error:', err);
	process.exit(1);
});