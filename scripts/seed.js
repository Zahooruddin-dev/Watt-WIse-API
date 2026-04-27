import dotenv from 'dotenv';
import pg from 'pg';

dotenv.config();

const { Pool } = pg;
const pool = new Pool({
	connectionString: process.env.DATABASE_URL,
	ssl: { rejectUnauthorized: false },
});

const categories = [
	{
		name: 'Ceiling Fans',
		slug: 'ceiling-fans',
		description: 'Standard and energy-saver ceiling fans',
	},
	{
		name: 'Pedestal Fans',
		slug: 'pedestal-fans',
		description: 'Floor-standing oscillating fans',
	},
	{
		name: 'Table Fans',
		slug: 'table-fans',
		description: 'Compact desktop fans',
	},
	{
		name: 'Exhaust Fans',
		slug: 'exhaust-fans',
		description: 'Kitchen and bathroom ventilation fans',
	},
	{
		name: 'Wall Fans',
		slug: 'wall-fans',
		description: 'Wall-mounted bracket fans',
	},
	{
		name: 'Air Conditioners',
		slug: 'air-conditioners',
		description: 'Split and window air conditioning units',
	},
	{
		name: 'Refrigerators',
		slug: 'refrigerators',
		description: 'Single and double door refrigerators',
	},
	{
		name: 'Deep Freezers',
		slug: 'deep-freezers',
		description: 'Horizontal and vertical deep freezers',
	},
	{
		name: 'Washing Machines',
		slug: 'washing-machines',
		description: 'Semi-automatic and fully automatic washers',
	},
	{
		name: 'Microwave Ovens',
		slug: 'microwave-ovens',
		description: 'Solo and grill microwave ovens',
	},
	{
		name: 'Water Pumps',
		slug: 'water-pumps',
		description: 'Motor pumps for domestic water supply',
	},
	{
		name: 'Water Heaters',
		slug: 'water-heaters',
		description: 'Electric geysers and instant water heaters',
	},
	{
		name: 'Electric Irons',
		slug: 'electric-irons',
		description: 'Dry and steam irons',
	},
	{
		name: 'LED TVs',
		slug: 'led-tvs',
		description: 'LED and smart televisions',
	},
	{
		name: 'Air Coolers',
		slug: 'air-coolers',
		description: 'Evaporative air coolers',
	},
	{
		name: 'Electric Ovens',
		slug: 'electric-ovens',
		description: 'Baking and cooking ovens',
	},
	{
		name: 'Induction Cookers',
		slug: 'induction-cookers',
		description: 'Induction and infrared cooktops',
	},
	{
		name: 'Vacuum Cleaners',
		slug: 'vacuum-cleaners',
		description: 'Dry and wet vacuum cleaners',
	},
	{
		name: 'Water Dispensers',
		slug: 'water-dispensers',
		description: 'Hot and cold water dispensers',
	},
	{
		name: 'UPS & Inverters',
		slug: 'ups-inverters',
		description: 'Uninterruptible power supply and home inverters',
	},
];

const brands = [
	{
		name: 'GFC',
		slug: 'gfc',
		origin_country: 'Pakistan',
		website: 'https://www.gfc.com.pk',
	},
	{
		name: 'Royal Fan',
		slug: 'royal-fan',
		origin_country: 'Pakistan',
		website: 'https://www.royalfans.com.pk',
	},
	{ name: 'Khurshid Fan', slug: 'khurshid-fan', origin_country: 'Pakistan' },
	{ name: 'Tamoor Fan', slug: 'tamoor-fan', origin_country: 'Pakistan' },
	{
		name: 'Pak Fan',
		slug: 'pak-fan',
		origin_country: 'Pakistan',
		website: 'https://www.pakfan.com.pk',
	},
	{ name: 'Millat Fan', slug: 'millat-fan', origin_country: 'Pakistan' },
	{ name: 'Starco Fan', slug: 'starco-fan', origin_country: 'Pakistan' },
	{ name: 'SK Fan', slug: 'sk-fan', origin_country: 'Pakistan' },
	{
		name: 'Dawlance',
		slug: 'dawlance',
		origin_country: 'Pakistan',
		website: 'https://www.dawlance.com.pk',
	},
	{
		name: 'Haier',
		slug: 'haier',
		origin_country: 'China',
		website: 'https://www.haier.com/pk',
	},
	{
		name: 'PEL',
		slug: 'pel',
		origin_country: 'Pakistan',
		website: 'https://www.pel.com.pk',
	},
	{
		name: 'Orient',
		slug: 'orient',
		origin_country: 'Pakistan',
		website: 'https://www.orientelectronics.com',
	},
	{
		name: 'Kenwood',
		slug: 'kenwood',
		origin_country: 'United Kingdom',
		website: 'https://www.kenwoodpk.com',
	},
	{
		name: 'Gree',
		slug: 'gree',
		origin_country: 'China',
		website: 'https://www.gree.com.pk',
	},
	{
		name: 'TCL',
		slug: 'tcl',
		origin_country: 'China',
		website: 'https://www.tcl.com/pk',
	},
	{
		name: 'Samsung',
		slug: 'samsung',
		origin_country: 'South Korea',
		website: 'https://www.samsung.com/pk',
	},
	{
		name: 'LG',
		slug: 'lg',
		origin_country: 'South Korea',
		website: 'https://www.lg.com/pk',
	},
	{
		name: 'Waves',
		slug: 'waves',
		origin_country: 'Pakistan',
		website: 'https://www.waves.com.pk',
	},
	{
		name: 'Super Asia',
		slug: 'super-asia',
		origin_country: 'Pakistan',
		website: 'https://www.superasia.pk',
	},
	{
		name: 'Changhong Ruba',
		slug: 'changhong-ruba',
		origin_country: 'China',
		website: 'https://www.changhongruba.com',
	},
	{
		name: 'EcoStar',
		slug: 'ecostar',
		origin_country: 'Pakistan',
		website: 'https://www.ecostar.com.pk',
	},
	{ name: 'Westpoint', slug: 'westpoint', origin_country: 'Pakistan' },
	{ name: 'Anex', slug: 'anex', origin_country: 'Pakistan' },
	{
		name: 'Homage',
		slug: 'homage',
		origin_country: 'Pakistan',
		website: 'https://www.homage.com.pk',
	},
	{ name: 'Nasgas', slug: 'nasgas', origin_country: 'Pakistan' },
];

const getAppliances = (categoryMap, brandMap) => [
	{
		name: 'GFC Ceiling Fan Standard',
		slug: 'gfc-ceiling-fan-standard',
		brand_id: brandMap['GFC'],
		category_id: categoryMap['Ceiling Fans'],
		model: 'Crown 56"',
		watts: 75,
		price_pkr: 5200,
		is_inverter: false,
	},
	{
		name: 'GFC Ceiling Fan Energy Saver',
		slug: 'gfc-ceiling-fan-energy-saver',
		brand_id: brandMap['GFC'],
		category_id: categoryMap['Ceiling Fans'],
		model: 'Crown Plus 56"',
		watts: 50,
		price_pkr: 7499,
		is_inverter: false,
	},
	{
		name: 'GFC AC/DC Inverter Ceiling Fan',
		slug: 'gfc-acdc-inverter-ceiling-fan',
		brand_id: brandMap['GFC'],
		category_id: categoryMap['Ceiling Fans'],
		model: 'Crown Plus AC/DC',
		watts: 28,
		price_pkr: 8200,
		is_inverter: true,
	},
	{
		name: 'Royal Fan Ceiling Fan Standard',
		slug: 'royal-ceiling-fan-standard',
		brand_id: brandMap['Royal Fan'],
		category_id: categoryMap['Ceiling Fans'],
		model: 'Classic 56"',
		watts: 75,
		price_pkr: 5500,
		is_inverter: false,
	},
	{
		name: 'Royal Fan Energy Saver',
		slug: 'royal-ceiling-fan-energy-saver',
		brand_id: brandMap['Royal Fan'],
		category_id: categoryMap['Ceiling Fans'],
		model: 'Energy Saver Series',
		watts: 50,
		price_pkr: 7450,
		is_inverter: false,
	},
	{
		name: 'Royal Smart Inverter Fan',
		slug: 'royal-smart-inverter-fan',
		brand_id: brandMap['Royal Fan'],
		category_id: categoryMap['Ceiling Fans'],
		model: 'Smart Series Inverter',
		watts: 22,
		price_pkr: 9500,
		is_inverter: true,
	},
	{
		name: 'Khurshid Fan Ceiling Standard',
		slug: 'khurshid-ceiling-fan-standard',
		brand_id: brandMap['Khurshid Fan'],
		category_id: categoryMap['Ceiling Fans'],
		model: 'Classic 56"',
		watts: 80,
		price_pkr: 5000,
		is_inverter: false,
	},
	{
		name: 'Khurshid Inverter Hybrid Fan',
		slug: 'khurshid-inverter-hybrid-fan',
		brand_id: brandMap['Khurshid Fan'],
		category_id: categoryMap['Ceiling Fans'],
		model: 'Inverter Hybrid',
		watts: 30,
		price_pkr: 9250,
		is_inverter: true,
	},
	{
		name: 'Tamoor Ceiling Fan Standard',
		slug: 'tamoor-ceiling-fan-standard',
		brand_id: brandMap['Tamoor Fan'],
		category_id: categoryMap['Ceiling Fans'],
		model: 'Standard 56"',
		watts: 75,
		price_pkr: 5100,
		is_inverter: false,
	},
	{
		name: 'Tamoor AC/DC Ceiling Fan',
		slug: 'tamoor-acdc-ceiling-fan',
		brand_id: brandMap['Tamoor Fan'],
		category_id: categoryMap['Ceiling Fans'],
		model: 'AC/DC Series',
		watts: 30,
		price_pkr: 7295,
		is_inverter: true,
	},
	{
		name: 'Pak Fan Ceiling Fan',
		slug: 'pak-fan-ceiling-standard',
		brand_id: brandMap['Pak Fan'],
		category_id: categoryMap['Ceiling Fans'],
		model: 'Classic 56"',
		watts: 75,
		price_pkr: 5300,
		is_inverter: false,
	},
	{
		name: 'GFC Pedestal Fan',
		slug: 'gfc-pedestal-fan',
		brand_id: brandMap['GFC'],
		category_id: categoryMap['Pedestal Fans'],
		model: 'Power Series 18"',
		watts: 90,
		price_pkr: 6500,
	},
	{
		name: 'Royal Pedestal Fan',
		slug: 'royal-pedestal-fan',
		brand_id: brandMap['Royal Fan'],
		category_id: categoryMap['Pedestal Fans'],
		model: 'Deluxe 18"',
		watts: 85,
		price_pkr: 6800,
	},
	{
		name: 'Anex Table Fan',
		slug: 'anex-table-fan',
		brand_id: brandMap['Anex'],
		category_id: categoryMap['Table Fans'],
		model: 'AG-3011',
		watts: 55,
		price_pkr: 2800,
	},
	{
		name: 'GFC Exhaust Fan',
		slug: 'gfc-exhaust-fan',
		brand_id: brandMap['GFC'],
		category_id: categoryMap['Exhaust Fans'],
		model: '9" Standard',
		watts: 30,
		price_pkr: 1800,
	},
	{
		name: 'Pak Fan Exhaust Fan',
		slug: 'pak-fan-exhaust-fan',
		brand_id: brandMap['Pak Fan'],
		category_id: categoryMap['Exhaust Fans'],
		model: '12" Heavy Duty',
		watts: 40,
		price_pkr: 2200,
	},
	{
		name: 'Haier 1 Ton Split AC',
		slug: 'haier-1ton-split-ac',
		brand_id: brandMap['Haier'],
		category_id: categoryMap['Air Conditioners'],
		model: 'HSU-12LTC',
		watts: 1100,
		price_pkr: 98000,
		is_inverter: false,
	},
	{
		name: 'Haier 1 Ton DC Inverter AC',
		slug: 'haier-1ton-dc-inverter-ac',
		brand_id: brandMap['Haier'],
		category_id: categoryMap['Air Conditioners'],
		model: 'HSU-12HFPAAB',
		watts: 810,
		price_pkr: 128000,
		is_inverter: true,
	},
	{
		name: 'Haier 1.5 Ton Split AC',
		slug: 'haier-15ton-split-ac',
		brand_id: brandMap['Haier'],
		category_id: categoryMap['Air Conditioners'],
		model: 'HSU-18LTC',
		watts: 1600,
		price_pkr: 115000,
		is_inverter: false,
	},
	{
		name: 'Haier 1.5 Ton DC Inverter AC',
		slug: 'haier-15ton-dc-inverter-ac',
		brand_id: brandMap['Haier'],
		category_id: categoryMap['Air Conditioners'],
		model: 'HSU-18HFPAAB',
		watts: 1200,
		price_pkr: 148000,
		is_inverter: true,
	},
	{
		name: 'Dawlance 1 Ton Inverter AC',
		slug: 'dawlance-1ton-inverter-ac',
		brand_id: brandMap['Dawlance'],
		category_id: categoryMap['Air Conditioners'],
		model: 'ENERCON-12',
		watts: 820,
		price_pkr: 125000,
		is_inverter: true,
	},
	{
		name: 'Dawlance 1.5 Ton Inverter AC',
		slug: 'dawlance-15ton-inverter-ac',
		brand_id: brandMap['Dawlance'],
		category_id: categoryMap['Air Conditioners'],
		model: 'ENERCON-18',
		watts: 1250,
		price_pkr: 144900,
		is_inverter: true,
	},
	{
		name: 'PEL 1.5 Ton Inverter AC',
		slug: 'pel-15ton-inverter-ac',
		brand_id: brandMap['PEL'],
		category_id: categoryMap['Air Conditioners'],
		model: 'PINVO-18K',
		watts: 1280,
		price_pkr: 139000,
		is_inverter: true,
	},
	{
		name: 'Orient 1.5 Ton Inverter AC',
		slug: 'orient-15ton-inverter-ac',
		brand_id: brandMap['Orient'],
		category_id: categoryMap['Air Conditioners'],
		model: 'ULTRON-18G',
		watts: 1250,
		price_pkr: 142000,
		is_inverter: true,
	},
	{
		name: 'Gree 1.5 Ton Inverter AC',
		slug: 'gree-15ton-inverter-ac',
		brand_id: brandMap['Gree'],
		category_id: categoryMap['Air Conditioners'],
		model: 'GS-18CITH11G',
		watts: 1240,
		price_pkr: 158000,
		is_inverter: true,
	},
	{
		name: 'Dawlance Refrigerator 9 Cu Ft',
		slug: 'dawlance-fridge-9cuft',
		brand_id: brandMap['Dawlance'],
		category_id: categoryMap['Refrigerators'],
		model: '9155WB',
		watts: 120,
		price_pkr: 62000,
		is_inverter: false,
	},
	{
		name: 'Dawlance Inverter Refrigerator 12 Cu Ft',
		slug: 'dawlance-inverter-fridge-12cuft',
		brand_id: brandMap['Dawlance'],
		category_id: categoryMap['Refrigerators'],
		model: '9191WB INV',
		watts: 80,
		price_pkr: 88000,
		is_inverter: true,
	},
	{
		name: 'Haier Refrigerator 14 Cu Ft',
		slug: 'haier-fridge-14cuft',
		brand_id: brandMap['Haier'],
		category_id: categoryMap['Refrigerators'],
		model: 'HRF-336',
		watts: 150,
		price_pkr: 85000,
		is_inverter: false,
	},
	{
		name: 'PEL Refrigerator 14 Cu Ft',
		slug: 'pel-fridge-14cuft',
		brand_id: brandMap['PEL'],
		category_id: categoryMap['Refrigerators'],
		model: 'PRLP-22350',
		watts: 145,
		price_pkr: 79000,
		is_inverter: false,
	},
	{
		name: 'Waves Deep Freezer 8 Cu Ft',
		slug: 'waves-deep-freezer-8cuft',
		brand_id: brandMap['Waves'],
		category_id: categoryMap['Deep Freezers'],
		model: 'WDF-208',
		watts: 130,
		price_pkr: 55000,
	},
	{
		name: 'Dawlance Deep Freezer 12 Cu Ft',
		slug: 'dawlance-deep-freezer-12cuft',
		brand_id: brandMap['Dawlance'],
		category_id: categoryMap['Deep Freezers'],
		model: 'DF-300C',
		watts: 160,
		price_pkr: 72000,
	},
	{
		name: 'Super Asia Washing Machine Semi-Auto',
		slug: 'super-asia-washing-machine-semiauto',
		brand_id: brandMap['Super Asia'],
		category_id: categoryMap['Washing Machines'],
		model: 'SA-240',
		watts: 360,
		price_pkr: 32000,
	},
	{
		name: 'Haier Fully Auto Washing Machine 8kg',
		slug: 'haier-fully-auto-washer-8kg',
		brand_id: brandMap['Haier'],
		category_id: categoryMap['Washing Machines'],
		model: 'HWM80-B714S',
		watts: 550,
		price_pkr: 95000,
	},
	{
		name: 'Dawlance Microwave Oven 25L',
		slug: 'dawlance-microwave-25l',
		brand_id: brandMap['Dawlance'],
		category_id: categoryMap['Microwave Ovens'],
		model: 'MD-7',
		watts: 900,
		price_pkr: 22000,
	},
	{
		name: 'Haier Microwave Oven 20L',
		slug: 'haier-microwave-20l',
		brand_id: brandMap['Haier'],
		category_id: categoryMap['Microwave Ovens'],
		model: 'HMN-20MXP5',
		watts: 700,
		price_pkr: 19500,
	},
	{
		name: 'Nasgas Water Pump 0.5 HP',
		slug: 'nasgas-water-pump-05hp',
		brand_id: brandMap['Nasgas'],
		category_id: categoryMap['Water Pumps'],
		model: 'NWP-05',
		watts: 370,
		price_pkr: 14000,
	},
	{
		name: 'Nasgas Water Pump 1 HP',
		slug: 'nasgas-water-pump-1hp',
		brand_id: brandMap['Nasgas'],
		category_id: categoryMap['Water Pumps'],
		model: 'NWP-10',
		watts: 750,
		price_pkr: 22000,
	},
	{
		name: 'Westpoint Electric Geyser 35L',
		slug: 'westpoint-geyser-35l',
		brand_id: brandMap['Westpoint'],
		category_id: categoryMap['Water Heaters'],
		model: 'WF-1310',
		watts: 2000,
		price_pkr: 12000,
	},
	{
		name: 'Anex Electric Iron Steam',
		slug: 'anex-electric-iron-steam',
		brand_id: brandMap['Anex'],
		category_id: categoryMap['Electric Irons'],
		model: 'AG-1022',
		watts: 1200,
		price_pkr: 3500,
	},
	{
		name: 'Westpoint Dry Iron',
		slug: 'westpoint-dry-iron',
		brand_id: brandMap['Westpoint'],
		category_id: categoryMap['Electric Irons'],
		model: 'WF-23',
		watts: 1000,
		price_pkr: 2200,
	},
	{
		name: 'Orient LED TV 32 inch',
		slug: 'orient-led-tv-32',
		brand_id: brandMap['Orient'],
		category_id: categoryMap['LED TVs'],
		model: 'OR32S4100',
		watts: 45,
		price_pkr: 38000,
	},
	{
		name: 'Haier LED TV 43 inch',
		slug: 'haier-led-tv-43',
		brand_id: brandMap['Haier'],
		category_id: categoryMap['LED TVs'],
		model: 'LE43K6600HQGA',
		watts: 70,
		price_pkr: 78000,
	},
	{
		name: 'TCL LED TV 55 inch',
		slug: 'tcl-led-tv-55',
		brand_id: brandMap['TCL'],
		category_id: categoryMap['LED TVs'],
		model: '55P615',
		watts: 95,
		price_pkr: 115000,
	},
	{
		name: 'Super Asia Air Cooler',
		slug: 'super-asia-air-cooler',
		brand_id: brandMap['Super Asia'],
		category_id: categoryMap['Air Coolers'],
		model: 'AC-5000',
		watts: 150,
		price_pkr: 18000,
	},
	{
		name: 'Westpoint Electric Oven 45L',
		slug: 'westpoint-electric-oven-45l',
		brand_id: brandMap['Westpoint'],
		category_id: categoryMap['Electric Ovens'],
		model: 'WF-3800RKD',
		watts: 2200,
		price_pkr: 18500,
	},
	{
		name: 'Anex Induction Cooker',
		slug: 'anex-induction-cooker',
		brand_id: brandMap['Anex'],
		category_id: categoryMap['Induction Cookers'],
		model: 'AG-2061',
		watts: 2000,
		price_pkr: 8500,
	},
	{
		name: 'Anex Vacuum Cleaner 1600W',
		slug: 'anex-vacuum-cleaner-1600w',
		brand_id: brandMap['Anex'],
		category_id: categoryMap['Vacuum Cleaners'],
		model: 'AG-2094',
		watts: 1600,
		price_pkr: 12000,
	},
	{
		name: 'Nasgas Water Dispenser Hot & Cold',
		slug: 'nasgas-water-dispenser',
		brand_id: brandMap['Nasgas'],
		category_id: categoryMap['Water Dispensers'],
		model: 'ND-1400',
		watts: 500,
		price_pkr: 22000,
	},
	{
		name: 'Homage UPS 1000VA',
		slug: 'homage-ups-1000va',
		brand_id: brandMap['Homage'],
		category_id: categoryMap['UPS & Inverters'],
		model: 'HTI-1011SX',
		watts: 600,
		price_pkr: 28000,
	},
	{
		name: 'Homage Inverter 2400VA',
		slug: 'homage-inverter-2400va',
		brand_id: brandMap['Homage'],
		category_id: categoryMap['UPS & Inverters'],
		model: 'HTI-2411SX',
		watts: 1440,
		price_pkr: 55000,
	},
];

const run = async () => {
	const client = await pool.connect();

	try {
		await client.query('BEGIN');

		const categoryMap = {};
		for (const cat of categories) {
			const result = await client.query(
				`INSERT INTO categories (name, slug, description) VALUES ($1, $2, $3)
         ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name RETURNING id, name`,
				[cat.name, cat.slug, cat.description],
			);
			categoryMap[result.rows[0].name] = result.rows[0].id;
		}
		console.log(`Seeded ${categories.length} categories`);

		const brandMap = {};
		for (const brand of brands) {
			const result = await client.query(
				`INSERT INTO brands (name, slug, origin_country, website) VALUES ($1, $2, $3, $4)
         ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name RETURNING id, name`,
				[
					brand.name,
					brand.slug,
					brand.origin_country || 'Pakistan',
					brand.website || null,
				],
			);
			brandMap[result.rows[0].name] = result.rows[0].id;
		}
		console.log(`Seeded ${brands.length} brands`);

		const appliances = getAppliances(categoryMap, brandMap);
		let applianceCount = 0;
		for (const appliance of appliances) {
			await client.query(
				`INSERT INTO appliances (name, slug, brand_id, category_id, model, watts, price_pkr, is_inverter)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         ON CONFLICT (slug) DO NOTHING`,
				[
					appliance.name,
					appliance.slug,
					appliance.brand_id,
					appliance.category_id,
					appliance.model || null,
					appliance.watts,
					appliance.price_pkr || null,
					appliance.is_inverter || false,
				],
			);
			applianceCount++;
		}
		console.log(`Seeded ${applianceCount} appliances`);

		await client.query('COMMIT');
		console.log('Seed completed successfully.');
	} catch (err) {
		await client.query('ROLLBACK');
		console.error('Seed failed:', err.message);
		process.exit(1);
	} finally {
		client.release();
		await pool.end();
	}
};

run();
