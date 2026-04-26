import dotenv from 'dotenv';
import pg from 'pg';

dotenv.config();

const { Pool } = pg;
const pool = new Pool({
	connectionString: process.env.DATABASE_URL,
	ssl: { rejectUnauthorized: false },
});

// ─── CATEGORIES ───────────────────────────────────────────────────────────────
const categories = [
	// ── Fans ──
	{
		name: 'Ceiling Fans',
		slug: 'ceiling-fans',
		description: 'Standard, energy-saver and inverter ceiling fans',
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
	// ── Cooling / Heating ──
	{
		name: 'Air Conditioners',
		slug: 'air-conditioners',
		description: 'Split and window air conditioning units',
	},
	{
		name: 'Air Coolers',
		slug: 'air-coolers',
		description: 'Evaporative room air coolers',
	},
	{
		name: 'Room Heaters',
		slug: 'room-heaters',
		description: 'Electric fan heaters, quartz heaters, oil-filled radiators',
	},
	// ── Refrigeration ──
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
	// ── Laundry ──
	{
		name: 'Washing Machines',
		slug: 'washing-machines',
		description: 'Semi-automatic and fully automatic washers',
	},
	// ── Kitchen – cooking ──
	{
		name: 'Microwave Ovens',
		slug: 'microwave-ovens',
		description: 'Solo, grill and air-fryer microwave ovens',
	},
	{
		name: 'Electric Ovens',
		slug: 'electric-ovens',
		description: 'Counter-top baking and cooking ovens',
	},
	{
		name: 'Air Fryers',
		slug: 'air-fryers',
		description: 'Stand-alone electric air fryers',
	},
	{
		name: 'Induction Cookers',
		slug: 'induction-cookers',
		description: 'Induction and infrared cooktops',
	},
	{
		name: 'Gas Cooking Ranges',
		slug: 'gas-cooking-ranges',
		description:
			'Freestanding gas ranges with oven (watts = electric components only)',
	},
	{
		name: 'Built-in Hobs',
		slug: 'built-in-hobs',
		description: 'Built-in gas hobs (watts = auto-ignition electric component)',
	},
	{
		name: 'Kitchen Hoods',
		slug: 'kitchen-hoods',
		description: 'Electric chimney / extractor hoods for kitchens',
	},
	// ── Kitchen – small appliances ──
	{
		name: 'Electric Kettles',
		slug: 'electric-kettles',
		description: 'Cordless and countertop electric kettles',
	},
	{
		name: 'Blenders & Mixers',
		slug: 'blenders-mixers',
		description: 'Hand blenders, jug blenders, stand mixers and hand mixers',
	},
	{
		name: 'Food Processors',
		slug: 'food-processors',
		description: 'Multi-function food processors',
	},
	{
		name: 'Toasters & Sandwich Makers',
		slug: 'toasters-sandwich-makers',
		description: '2/4-slice toasters and sandwich/grill makers',
	},
	// ── Water ──
	{
		name: 'Water Pumps',
		slug: 'water-pumps',
		description: 'Motor pumps for domestic water supply',
	},
	{
		name: 'Water Heaters',
		slug: 'water-heaters',
		description: 'Electric storage and instant geysers',
	},
	{
		name: 'Water Dispensers',
		slug: 'water-dispensers',
		description: 'Hot and cold water dispensers',
	},
	// ── Entertainment ──
	{
		name: 'LED TVs',
		slug: 'led-tvs',
		description: 'LED, QLED and OLED smart televisions',
	},
	// ── Personal care & laundry ──
	{
		name: 'Electric Irons',
		slug: 'electric-irons',
		description: 'Dry and steam irons',
	},
	{
		name: 'Hair Care',
		slug: 'hair-care',
		description: 'Hair dryers, straighteners and stylers',
	},
	{
		name: 'Vacuum Cleaners',
		slug: 'vacuum-cleaners',
		description: 'Dry and wet vacuum cleaners',
	},
	// ── Power ──
	{
		name: 'UPS & Inverters',
		slug: 'ups-inverters',
		description: 'Home UPS and inverter systems',
	},
	// ── Chargers ──
	{
		name: 'Phone Chargers',
		slug: 'phone-chargers',
		description:
			'OEM and standard phone wall chargers, listed by brand output wattage',
	},
	{
		name: 'Laptop Chargers',
		slug: 'laptop-chargers',
		description: 'Laptop AC adapters listed by rated output wattage',
	},
];

// ─── BRANDS ───────────────────────────────────────────────────────────────────
const brands = [
	// ── Local Fan Brands (Gujrat / Gujranwala belt) ──
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
	{ name: 'Younas Fan', slug: 'younas-fan', origin_country: 'Pakistan' },
	{
		name: 'Boss Fan',
		slug: 'boss-fan',
		origin_country: 'Pakistan',
		website: 'https://www.bossfan.com.pk',
	},
	{ name: 'Starco Fan', slug: 'starco-fan', origin_country: 'Pakistan' },
	{ name: 'SK Fan', slug: 'sk-fan', origin_country: 'Pakistan' },
	// ── Major Pakistani White-Goods Brands ──
	{
		name: 'Dawlance',
		slug: 'dawlance',
		origin_country: 'Pakistan',
		website: 'https://www.dawlance.com.pk',
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
		name: 'Waves',
		slug: 'waves',
		origin_country: 'Pakistan',
		website: 'https://www.waves.com.pk',
	},
	{
		name: 'EcoStar',
		slug: 'ecostar',
		origin_country: 'Pakistan',
		website: 'https://www.ecostar.com.pk',
	},
	{
		name: 'Super Asia',
		slug: 'super-asia',
		origin_country: 'Pakistan',
		website: 'https://www.superasia.pk',
	},
	{
		name: 'Homage',
		slug: 'homage',
		origin_country: 'Pakistan',
		website: 'https://www.homage.com.pk',
	},
	{
		name: 'Nasgas',
		slug: 'nasgas',
		origin_country: 'Pakistan',
		website: 'https://nasgas.com',
	},
	{ name: 'Westpoint', slug: 'westpoint', origin_country: 'Pakistan' },
	{ name: 'Anex', slug: 'anex', origin_country: 'Pakistan' },
	{
		name: 'Singer',
		slug: 'singer',
		origin_country: 'Pakistan',
		website: 'https://www.singerpakistan.com.pk',
	},
	{
		name: 'Canon Appliances',
		slug: 'canon-appliances',
		origin_country: 'Pakistan',
	},
	// ── Chinese Brands ──
	{
		name: 'Haier',
		slug: 'haier',
		origin_country: 'China',
		website: 'https://www.haier.com/pk',
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
		name: 'Changhong Ruba',
		slug: 'changhong-ruba',
		origin_country: 'China',
		website: 'https://www.changhongruba.com',
	},
	{
		name: 'Midea',
		slug: 'midea',
		origin_country: 'China',
		website: 'https://www.midea.com/pk',
	},
	{
		name: 'Hisense',
		slug: 'hisense',
		origin_country: 'China',
		website: 'https://www.hisense.com.pk',
	},
	{
		name: 'OPPO',
		slug: 'oppo',
		origin_country: 'China',
		website: 'https://www.oppo.com/pk',
	},
	{
		name: 'Vivo',
		slug: 'vivo',
		origin_country: 'China',
		website: 'https://www.vivo.com/pk',
	},
	{
		name: 'Realme',
		slug: 'realme',
		origin_country: 'China',
		website: 'https://www.realme.com/pk',
	},
	{
		name: 'Xiaomi',
		slug: 'xiaomi',
		origin_country: 'China',
		website: 'https://www.mi.com/pk',
	},
	{
		name: 'Tecno',
		slug: 'tecno',
		origin_country: 'China',
		website: 'https://www.tecno-mobile.com/pk',
	},
	{
		name: 'Infinix',
		slug: 'infinix',
		origin_country: 'China',
		website: 'https://www.infinixmobility.com/pk',
	},
	// ── Korean Brands ──
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
	// ── UK / European Brands ──
	{
		name: 'Kenwood',
		slug: 'kenwood',
		origin_country: 'United Kingdom',
		website: 'https://www.kenwoodpk.com',
	},
	{
		name: 'Philips',
		slug: 'philips',
		origin_country: 'Netherlands',
		website: 'https://www.philips.com/pk',
	},
	// ── American Brands ──
	{
		name: 'Apple',
		slug: 'apple',
		origin_country: 'United States',
		website: 'https://www.apple.com',
	},
	{
		name: 'Google',
		slug: 'google',
		origin_country: 'United States',
		website: 'https://store.google.com',
	},
	{
		name: 'Dell',
		slug: 'dell',
		origin_country: 'United States',
		website: 'https://www.dell.com/pk',
	},
	{
		name: 'HP',
		slug: 'hp',
		origin_country: 'United States',
		website: 'https://www.hp.com/pk',
	},
	// ── Taiwanese Brands ──
	{
		name: 'Asus',
		slug: 'asus',
		origin_country: 'Taiwan',
		website: 'https://www.asus.com/pk',
	},
	{
		name: 'Acer',
		slug: 'acer',
		origin_country: 'Taiwan',
		website: 'https://www.acer.com/pk',
	},
	// ── Finnish Brands ──
	{
		name: 'Nokia',
		slug: 'nokia',
		origin_country: 'Finland',
		website: 'https://www.nokia.com',
	},
	// ── Lenovo ──
	{
		name: 'Lenovo',
		slug: 'lenovo',
		origin_country: 'China',
		website: 'https://www.lenovo.com/pk',
	},
	// ── OnePlus ──
	{
		name: 'OnePlus',
		slug: 'oneplus',
		origin_country: 'China',
		website: 'https://www.oneplus.com/pk',
	},
];

// ─── APPLIANCES ───────────────────────────────────────────────────────────────
const getAppliances = (C, B) => [
	// ════════════════════════════════════════════════════════════
	// CEILING FANS
	// Wattages: standard 75-80 W | energy saver 50 W | inverter 22-30 W
	// Sources: gfc.com.pk, royalfans.com.pk, dealer spec sheets
	// ════════════════════════════════════════════════════════════
	{
		name: 'GFC Ceiling Fan Standard 56"',
		slug: 'gfc-ceiling-fan-56-standard',
		brand_id: B['GFC'],
		category_id: C['Ceiling Fans'],
		model: 'Crown 56"',
		watts: 75,
		price_pkr: 5200,
		is_inverter: false,
		description: '75W standard copper-winding ceiling fan',
	},
	{
		name: 'GFC Ceiling Fan Energy Saver 56"',
		slug: 'gfc-ceiling-fan-56-energy-saver',
		brand_id: B['GFC'],
		category_id: C['Ceiling Fans'],
		model: 'Crown Plus ES 56"',
		watts: 50,
		price_pkr: 7499,
		is_inverter: false,
	},
	{
		name: 'GFC AC/DC Inverter Ceiling Fan',
		slug: 'gfc-acdc-inverter-ceiling-fan',
		brand_id: B['GFC'],
		category_id: C['Ceiling Fans'],
		model: 'Crown Plus AC/DC 56"',
		watts: 28,
		price_pkr: 8200,
		is_inverter: true,
	},
	{
		name: 'GFC Ceiling Fan Standard 48"',
		slug: 'gfc-ceiling-fan-48-standard',
		brand_id: B['GFC'],
		category_id: C['Ceiling Fans'],
		model: 'Crown 48"',
		watts: 65,
		price_pkr: 4800,
		is_inverter: false,
	},
	{
		name: 'GFC Ceiling Fan Energy Saver 48"',
		slug: 'gfc-ceiling-fan-48-energy-saver',
		brand_id: B['GFC'],
		category_id: C['Ceiling Fans'],
		model: 'Crown Plus ES 48"',
		watts: 45,
		price_pkr: 7000,
		is_inverter: false,
	},

	{
		name: 'Royal Fan Ceiling Fan Standard 56"',
		slug: 'royal-ceiling-fan-56-standard',
		brand_id: B['Royal Fan'],
		category_id: C['Ceiling Fans'],
		model: 'Classic 56"',
		watts: 75,
		price_pkr: 5500,
		is_inverter: false,
	},
	{
		name: 'Royal Fan Energy Saver 56"',
		slug: 'royal-ceiling-fan-56-energy-saver',
		brand_id: B['Royal Fan'],
		category_id: C['Ceiling Fans'],
		model: 'Energy Saver 56"',
		watts: 50,
		price_pkr: 7450,
		is_inverter: false,
	},
	{
		name: 'Royal Fan AC/DC Inverter Fan',
		slug: 'royal-smart-inverter-fan',
		brand_id: B['Royal Fan'],
		category_id: C['Ceiling Fans'],
		model: 'Smart Series Inverter',
		watts: 22,
		price_pkr: 9500,
		is_inverter: true,
	},
	{
		name: 'Royal Fan Ceiling Fan Standard 48"',
		slug: 'royal-ceiling-fan-48-standard',
		brand_id: B['Royal Fan'],
		category_id: C['Ceiling Fans'],
		model: 'Classic 48"',
		watts: 65,
		price_pkr: 5100,
		is_inverter: false,
	},

	{
		name: 'Khurshid Ceiling Fan Standard',
		slug: 'khurshid-ceiling-fan-standard',
		brand_id: B['Khurshid Fan'],
		category_id: C['Ceiling Fans'],
		model: 'Classic 56"',
		watts: 80,
		price_pkr: 5000,
		is_inverter: false,
	},
	{
		name: 'Khurshid Inverter Hybrid Fan',
		slug: 'khurshid-inverter-hybrid-fan',
		brand_id: B['Khurshid Fan'],
		category_id: C['Ceiling Fans'],
		model: 'Inverter Hybrid 56"',
		watts: 30,
		price_pkr: 9250,
		is_inverter: true,
	},

	{
		name: 'Tamoor Ceiling Fan Standard',
		slug: 'tamoor-ceiling-fan-standard',
		brand_id: B['Tamoor Fan'],
		category_id: C['Ceiling Fans'],
		model: 'Standard 56"',
		watts: 75,
		price_pkr: 5100,
		is_inverter: false,
	},
	{
		name: 'Tamoor AC/DC Ceiling Fan 30W',
		slug: 'tamoor-acdc-ceiling-fan-30w',
		brand_id: B['Tamoor Fan'],
		category_id: C['Ceiling Fans'],
		model: 'AC/DC Super Pearl 56"',
		watts: 30,
		price_pkr: 7295,
		is_inverter: true,
		description:
			'5-30W on AC, 30W inverter peak – confirmed on product listing',
	},

	{
		name: 'Pak Fan Ceiling Fan Standard',
		slug: 'pak-fan-ceiling-56-standard',
		brand_id: B['Pak Fan'],
		category_id: C['Ceiling Fans'],
		model: 'Classic 56"',
		watts: 75,
		price_pkr: 5300,
		is_inverter: false,
	},
	{
		name: 'Pak Fan Energy Saver',
		slug: 'pak-fan-ceiling-energy-saver',
		brand_id: B['Pak Fan'],
		category_id: C['Ceiling Fans'],
		model: 'ES 56"',
		watts: 50,
		price_pkr: 7200,
		is_inverter: false,
	},

	{
		name: 'Millat Ceiling Fan Standard',
		slug: 'millat-ceiling-fan-standard',
		brand_id: B['Millat Fan'],
		category_id: C['Ceiling Fans'],
		model: 'Classic 56"',
		watts: 75,
		price_pkr: 4900,
		is_inverter: false,
	},
	{
		name: 'Millat Ceiling Fan Energy Saver',
		slug: 'millat-ceiling-fan-energy-saver',
		brand_id: B['Millat Fan'],
		category_id: C['Ceiling Fans'],
		model: 'ES 56"',
		watts: 50,
		price_pkr: 6900,
		is_inverter: false,
	},

	{
		name: 'Younas Ceiling Fan Standard',
		slug: 'younas-ceiling-fan-standard',
		brand_id: B['Younas Fan'],
		category_id: C['Ceiling Fans'],
		model: 'Classic 56"',
		watts: 75,
		price_pkr: 4800,
		is_inverter: false,
	},
	{
		name: 'Younas Ceiling Fan Energy Saver',
		slug: 'younas-ceiling-fan-energy-saver',
		brand_id: B['Younas Fan'],
		category_id: C['Ceiling Fans'],
		model: 'ES 56"',
		watts: 50,
		price_pkr: 6800,
		is_inverter: false,
	},
	{
		name: 'Younas AC/DC Inverter Fan',
		slug: 'younas-acdc-inverter-fan',
		brand_id: B['Younas Fan'],
		category_id: C['Ceiling Fans'],
		model: 'AC/DC Inverter 56"',
		watts: 28,
		price_pkr: 8800,
		is_inverter: true,
	},

	{
		name: 'Boss Fan Ceiling Standard',
		slug: 'boss-fan-ceiling-standard',
		brand_id: B['Boss Fan'],
		category_id: C['Ceiling Fans'],
		model: 'Elite 56"',
		watts: 75,
		price_pkr: 5000,
		is_inverter: false,
	},
	{
		name: 'Boss Fan Energy Saver',
		slug: 'boss-fan-ceiling-energy-saver',
		brand_id: B['Boss Fan'],
		category_id: C['Ceiling Fans'],
		model: 'ES Plus 56"',
		watts: 50,
		price_pkr: 7100,
		is_inverter: false,
	},

	{
		name: 'Starco Ceiling Fan Standard',
		slug: 'starco-ceiling-fan-standard',
		brand_id: B['Starco Fan'],
		category_id: C['Ceiling Fans'],
		model: 'Classic 56"',
		watts: 75,
		price_pkr: 4700,
		is_inverter: false,
	},
	{
		name: 'SK Fan Ceiling Standard',
		slug: 'sk-fan-ceiling-standard',
		brand_id: B['SK Fan'],
		category_id: C['Ceiling Fans'],
		model: 'Classic 56"',
		watts: 75,
		price_pkr: 4600,
		is_inverter: false,
	},

	// ════════════════════════════════════════════════════════════
	// PEDESTAL FANS (85-100 W)
	// ════════════════════════════════════════════════════════════
	{
		name: 'GFC Pedestal Fan 18"',
		slug: 'gfc-pedestal-fan-18',
		brand_id: B['GFC'],
		category_id: C['Pedestal Fans'],
		model: 'Power Series 18"',
		watts: 90,
		price_pkr: 6500,
	},
	{
		name: 'Royal Fan Pedestal Fan 18"',
		slug: 'royal-pedestal-fan-18',
		brand_id: B['Royal Fan'],
		category_id: C['Pedestal Fans'],
		model: 'Deluxe 18"',
		watts: 85,
		price_pkr: 6800,
	},
	{
		name: 'Pak Fan Pedestal Fan 18"',
		slug: 'pak-fan-pedestal-18',
		brand_id: B['Pak Fan'],
		category_id: C['Pedestal Fans'],
		model: 'Standard 18"',
		watts: 88,
		price_pkr: 6400,
	},
	{
		name: 'Millat Pedestal Fan 18"',
		slug: 'millat-pedestal-fan-18',
		brand_id: B['Millat Fan'],
		category_id: C['Pedestal Fans'],
		model: 'Power 18"',
		watts: 90,
		price_pkr: 6200,
	},
	{
		name: 'Super Asia Pedestal Fan 18"',
		slug: 'super-asia-pedestal-fan-18',
		brand_id: B['Super Asia'],
		category_id: C['Pedestal Fans'],
		model: 'SA-518 18"',
		watts: 100,
		price_pkr: 7500,
	},
	{
		name: 'Anex Pedestal Fan 18"',
		slug: 'anex-pedestal-fan-18',
		brand_id: B['Anex'],
		category_id: C['Pedestal Fans'],
		model: 'AG-3016 18"',
		watts: 90,
		price_pkr: 6300,
	},

	// ════════════════════════════════════════════════════════════
	// TABLE FANS (50-60 W)
	// ════════════════════════════════════════════════════════════
	{
		name: 'Anex Table Fan 12"',
		slug: 'anex-table-fan-12',
		brand_id: B['Anex'],
		category_id: C['Table Fans'],
		model: 'AG-3011',
		watts: 55,
		price_pkr: 2800,
	},
	{
		name: 'GFC Table Fan 12"',
		slug: 'gfc-table-fan-12',
		brand_id: B['GFC'],
		category_id: C['Table Fans'],
		model: 'Breeze 12"',
		watts: 55,
		price_pkr: 2900,
	},
	{
		name: 'Royal Fan Table Fan 12"',
		slug: 'royal-table-fan-12',
		brand_id: B['Royal Fan'],
		category_id: C['Table Fans'],
		model: 'Table 12"',
		watts: 55,
		price_pkr: 3000,
	},
	{
		name: 'SK Fan Table Fan 12"',
		slug: 'sk-fan-table-12',
		brand_id: B['SK Fan'],
		category_id: C['Table Fans'],
		model: 'Compact 12"',
		watts: 50,
		price_pkr: 2600,
	},
	{
		name: 'Pak Fan Table Fan 12"',
		slug: 'pak-fan-table-12',
		brand_id: B['Pak Fan'],
		category_id: C['Table Fans'],
		model: 'Desktop 12"',
		watts: 55,
		price_pkr: 2750,
	},

	// ════════════════════════════════════════════════════════════
	// EXHAUST FANS (25-40 W)
	// ════════════════════════════════════════════════════════════
	{
		name: 'GFC Exhaust Fan 9"',
		slug: 'gfc-exhaust-fan-9',
		brand_id: B['GFC'],
		category_id: C['Exhaust Fans'],
		model: '9" Standard',
		watts: 30,
		price_pkr: 1800,
	},
	{
		name: 'GFC Exhaust Fan 12"',
		slug: 'gfc-exhaust-fan-12',
		brand_id: B['GFC'],
		category_id: C['Exhaust Fans'],
		model: '12" Heavy Duty',
		watts: 40,
		price_pkr: 2400,
	},
	{
		name: 'Pak Fan Exhaust Fan 12"',
		slug: 'pak-fan-exhaust-fan-12',
		brand_id: B['Pak Fan'],
		category_id: C['Exhaust Fans'],
		model: '12" Heavy Duty',
		watts: 40,
		price_pkr: 2200,
	},
	{
		name: 'Royal Fan Exhaust Fan 9"',
		slug: 'royal-exhaust-fan-9',
		brand_id: B['Royal Fan'],
		category_id: C['Exhaust Fans'],
		model: '9" Standard',
		watts: 30,
		price_pkr: 1900,
	},
	{
		name: 'Nasgas Exhaust Fan 9"',
		slug: 'nasgas-exhaust-fan-9',
		brand_id: B['Nasgas'],
		category_id: C['Exhaust Fans'],
		model: 'NG-9EF',
		watts: 30,
		price_pkr: 2000,
	},
	{
		name: 'Super Asia Exhaust Fan 12"',
		slug: 'super-asia-exhaust-fan-12',
		brand_id: B['Super Asia'],
		category_id: C['Exhaust Fans'],
		model: 'SA-12EF',
		watts: 40,
		price_pkr: 2300,
	},

	// ════════════════════════════════════════════════════════════
	// WALL FANS (60-75 W)
	// ════════════════════════════════════════════════════════════
	{
		name: 'GFC Wall Fan 18"',
		slug: 'gfc-wall-fan-18',
		brand_id: B['GFC'],
		category_id: C['Wall Fans'],
		model: 'Wall Mount 18"',
		watts: 70,
		price_pkr: 5800,
	},
	{
		name: 'Royal Fan Wall Fan 18"',
		slug: 'royal-wall-fan-18',
		brand_id: B['Royal Fan'],
		category_id: C['Wall Fans'],
		model: 'Wall Deluxe 18"',
		watts: 65,
		price_pkr: 5600,
	},
	{
		name: 'Pak Fan Wall Fan 18"',
		slug: 'pak-fan-wall-18',
		brand_id: B['Pak Fan'],
		category_id: C['Wall Fans'],
		model: 'Wall 18"',
		watts: 70,
		price_pkr: 5400,
	},
	{
		name: 'Millat Wall Fan 18"',
		slug: 'millat-wall-fan-18',
		brand_id: B['Millat Fan'],
		category_id: C['Wall Fans'],
		model: 'Bracket 18"',
		watts: 70,
		price_pkr: 5200,
	},

	// ════════════════════════════════════════════════════════════
	// AIR CONDITIONERS
	// Watt sources: official spec sheets; non-inverter rated input,
	// inverter rated at typical operating load (~70% compressor speed)
	// ════════════════════════════════════════════════════════════
	// Haier
	{
		name: 'Haier 1 Ton Split AC',
		slug: 'haier-1ton-split-ac',
		brand_id: B['Haier'],
		category_id: C['Air Conditioners'],
		model: 'HSU-12LTC',
		watts: 1100,
		price_pkr: 98000,
		is_inverter: false,
	},
	{
		name: 'Haier 1 Ton DC Inverter AC',
		slug: 'haier-1ton-dc-inverter-ac',
		brand_id: B['Haier'],
		category_id: C['Air Conditioners'],
		model: 'HSU-12HFPAAB',
		watts: 810,
		price_pkr: 128000,
		is_inverter: true,
	},
	{
		name: 'Haier 1.5 Ton Split AC',
		slug: 'haier-15ton-split-ac',
		brand_id: B['Haier'],
		category_id: C['Air Conditioners'],
		model: 'HSU-18LTC',
		watts: 1600,
		price_pkr: 115000,
		is_inverter: false,
	},
	{
		name: 'Haier 1.5 Ton DC Inverter AC',
		slug: 'haier-15ton-dc-inverter-ac',
		brand_id: B['Haier'],
		category_id: C['Air Conditioners'],
		model: 'HSU-18HFPAAB',
		watts: 1200,
		price_pkr: 148000,
		is_inverter: true,
	},
	{
		name: 'Haier 2 Ton DC Inverter AC',
		slug: 'haier-2ton-dc-inverter-ac',
		brand_id: B['Haier'],
		category_id: C['Air Conditioners'],
		model: 'HSU-24HFPAAB',
		watts: 1850,
		price_pkr: 195000,
		is_inverter: true,
	},
	// Dawlance
	{
		name: 'Dawlance 1 Ton Inverter AC',
		slug: 'dawlance-1ton-inverter-ac',
		brand_id: B['Dawlance'],
		category_id: C['Air Conditioners'],
		model: 'ENERCON-12',
		watts: 820,
		price_pkr: 125000,
		is_inverter: true,
	},
	{
		name: 'Dawlance 1.5 Ton Inverter AC',
		slug: 'dawlance-15ton-inverter-ac',
		brand_id: B['Dawlance'],
		category_id: C['Air Conditioners'],
		model: 'ENERCON-18',
		watts: 1250,
		price_pkr: 144900,
		is_inverter: true,
	},
	{
		name: 'Dawlance 2 Ton Inverter AC',
		slug: 'dawlance-2ton-inverter-ac',
		brand_id: B['Dawlance'],
		category_id: C['Air Conditioners'],
		model: 'ENERCON-24',
		watts: 1900,
		price_pkr: 198000,
		is_inverter: true,
	},
	// PEL
	{
		name: 'PEL 1 Ton Inverter AC',
		slug: 'pel-1ton-inverter-ac',
		brand_id: B['PEL'],
		category_id: C['Air Conditioners'],
		model: 'PINVO-12K',
		watts: 820,
		price_pkr: 122000,
		is_inverter: true,
	},
	{
		name: 'PEL 1.5 Ton Inverter AC',
		slug: 'pel-15ton-inverter-ac',
		brand_id: B['PEL'],
		category_id: C['Air Conditioners'],
		model: 'PINVO-18K',
		watts: 1280,
		price_pkr: 139000,
		is_inverter: true,
	},
	{
		name: 'PEL 2 Ton Inverter AC',
		slug: 'pel-2ton-inverter-ac',
		brand_id: B['PEL'],
		category_id: C['Air Conditioners'],
		model: 'PINVO-24K',
		watts: 1900,
		price_pkr: 185000,
		is_inverter: true,
	},
	// Orient
	{
		name: 'Orient 1 Ton Inverter AC',
		slug: 'orient-1ton-inverter-ac',
		brand_id: B['Orient'],
		category_id: C['Air Conditioners'],
		model: 'ULTRON-12G',
		watts: 820,
		price_pkr: 120000,
		is_inverter: true,
	},
	{
		name: 'Orient 1.5 Ton Inverter AC',
		slug: 'orient-15ton-inverter-ac',
		brand_id: B['Orient'],
		category_id: C['Air Conditioners'],
		model: 'ULTRON-18G',
		watts: 1250,
		price_pkr: 142000,
		is_inverter: true,
	},
	// Kenwood
	{
		name: 'Kenwood 1 Ton Inverter AC',
		slug: 'kenwood-1ton-inverter-ac',
		brand_id: B['Kenwood'],
		category_id: C['Air Conditioners'],
		model: 'KEC-1267S eComfort',
		watts: 830,
		price_pkr: 144000,
		is_inverter: true,
		description: 'Up to 75% energy saving, EER 3.6',
	},
	{
		name: 'Kenwood 1.5 Ton Inverter AC',
		slug: 'kenwood-15ton-inverter-ac',
		brand_id: B['Kenwood'],
		category_id: C['Air Conditioners'],
		model: 'KES-1862S eSupreme',
		watts: 1230,
		price_pkr: 172000,
		is_inverter: true,
		description: 'Up to 60% energy saving, T3 compressor',
	},
	{
		name: 'Kenwood 1.5 Ton eSmart Onyx',
		slug: 'kenwood-15ton-esmart-onyx',
		brand_id: B['Kenwood'],
		category_id: C['Air Conditioners'],
		model: 'KES-1866S eSmart',
		watts: 1150,
		price_pkr: 239900,
		is_inverter: true,
		description: 'Full 5-DC inverter, EER 4.0, WiFi, T3 compressor',
	},
	// Gree
	{
		name: 'Gree 1.5 Ton Inverter AC',
		slug: 'gree-15ton-inverter-ac',
		brand_id: B['Gree'],
		category_id: C['Air Conditioners'],
		model: 'GS-18CITH11G',
		watts: 1240,
		price_pkr: 158000,
		is_inverter: true,
	},
	{
		name: 'Gree 1 Ton Inverter AC',
		slug: 'gree-1ton-inverter-ac',
		brand_id: B['Gree'],
		category_id: C['Air Conditioners'],
		model: 'GS-12CITH11G',
		watts: 840,
		price_pkr: 130000,
		is_inverter: true,
	},
	// TCL
	{
		name: 'TCL 1 Ton Inverter AC',
		slug: 'tcl-1ton-inverter-ac',
		brand_id: B['TCL'],
		category_id: C['Air Conditioners'],
		model: 'TAC-12CHSA/TPG11',
		watts: 840,
		price_pkr: 115000,
		is_inverter: true,
	},
	{
		name: 'TCL 1.5 Ton Inverter AC',
		slug: 'tcl-15ton-inverter-ac',
		brand_id: B['TCL'],
		category_id: C['Air Conditioners'],
		model: 'TAC-18CHSA/TPG11',
		watts: 1260,
		price_pkr: 138000,
		is_inverter: true,
	},
	// Samsung
	{
		name: 'Samsung 1.5 Ton WindFree AC',
		slug: 'samsung-15ton-windfree-ac',
		brand_id: B['Samsung'],
		category_id: C['Air Conditioners'],
		model: 'AR18BXFAWWKUFE',
		watts: 1260,
		price_pkr: 185000,
		is_inverter: true,
		description: 'WindFree technology, AI Energy mode',
	},
	// LG
	{
		name: 'LG 1.5 Ton Dual Inverter AC',
		slug: 'lg-15ton-dual-inverter-ac',
		brand_id: B['LG'],
		category_id: C['Air Conditioners'],
		model: 'RS-Q18YNZE',
		watts: 1230,
		price_pkr: 175000,
		is_inverter: true,
	},
	// Midea
	{
		name: 'Midea 1.5 Ton DC Inverter AC',
		slug: 'midea-15ton-dc-inverter-ac',
		brand_id: B['Midea'],
		category_id: C['Air Conditioners'],
		model: 'MSCB1CU-18HRFN8',
		watts: 1200,
		price_pkr: 174900,
		is_inverter: true,
	},
	// Changhong Ruba
	{
		name: 'Changhong Ruba 1.5 Ton Inverter AC',
		slug: 'changhong-ruba-15ton-inverter-ac',
		brand_id: B['Changhong Ruba'],
		category_id: C['Air Conditioners'],
		model: 'CS-18H10/R2',
		watts: 1250,
		price_pkr: 132000,
		is_inverter: true,
	},
	// Hisense
	{
		name: 'Hisense 1.5 Ton Inverter AC',
		slug: 'hisense-15ton-inverter-ac',
		brand_id: B['Hisense'],
		category_id: C['Air Conditioners'],
		model: 'AS-18UR4SVEDB5',
		watts: 1250,
		price_pkr: 128000,
		is_inverter: true,
	},

	// ════════════════════════════════════════════════════════════
	// REFRIGERATORS
	// Watt sources: PEL spec sheet (115W PRLP), typical measured draw
	// by size class; inverter models ~40% lower
	// ════════════════════════════════════════════════════════════
	// Dawlance
	{
		name: 'Dawlance Bedroom Refrigerator 4 Cu Ft',
		slug: 'dawlance-fridge-4cuft-bedroom',
		brand_id: B['Dawlance'],
		category_id: C['Refrigerators'],
		model: '9101WB Bedroom',
		watts: 60,
		price_pkr: 43000,
		is_inverter: false,
	},
	{
		name: 'Dawlance Refrigerator 9 Cu Ft',
		slug: 'dawlance-fridge-9cuft',
		brand_id: B['Dawlance'],
		category_id: C['Refrigerators'],
		model: '9155WB',
		watts: 120,
		price_pkr: 62000,
		is_inverter: false,
	},
	{
		name: 'Dawlance Inverter Refrigerator 12 Cu Ft',
		slug: 'dawlance-inverter-fridge-12cuft',
		brand_id: B['Dawlance'],
		category_id: C['Refrigerators'],
		model: '9191WB INV',
		watts: 80,
		price_pkr: 88000,
		is_inverter: true,
	},
	{
		name: 'Dawlance Refrigerator 14 Cu Ft',
		slug: 'dawlance-fridge-14cuft',
		brand_id: B['Dawlance'],
		category_id: C['Refrigerators'],
		model: '9173WB Avante',
		watts: 130,
		price_pkr: 89000,
		is_inverter: false,
	},
	{
		name: 'Dawlance Inverter Refrigerator 16 Cu Ft',
		slug: 'dawlance-inverter-fridge-16cuft',
		brand_id: B['Dawlance'],
		category_id: C['Refrigerators'],
		model: '9178WB HZ INV',
		watts: 90,
		price_pkr: 115000,
		is_inverter: true,
		description: 'A++ inverter, 45% energy saving',
	},
	{
		name: 'Dawlance French Door Refrigerator 20 Cu Ft',
		slug: 'dawlance-fridge-20cuft-french',
		brand_id: B['Dawlance'],
		category_id: C['Refrigerators'],
		model: '900 DFD',
		watts: 150,
		price_pkr: 185000,
		is_inverter: true,
	},
	// Haier
	{
		name: 'Haier Refrigerator 9 Cu Ft',
		slug: 'haier-fridge-9cuft',
		brand_id: B['Haier'],
		category_id: C['Refrigerators'],
		model: 'HRF-216',
		watts: 110,
		price_pkr: 58000,
		is_inverter: false,
	},
	{
		name: 'Haier Refrigerator 14 Cu Ft',
		slug: 'haier-fridge-14cuft',
		brand_id: B['Haier'],
		category_id: C['Refrigerators'],
		model: 'HRF-336',
		watts: 150,
		price_pkr: 85000,
		is_inverter: false,
	},
	{
		name: 'Haier Inverter Refrigerator 16 Cu Ft',
		slug: 'haier-inverter-fridge-16cuft',
		brand_id: B['Haier'],
		category_id: C['Refrigerators'],
		model: 'HRF-346IPGA Smart Inverter',
		watts: 95,
		price_pkr: 118000,
		is_inverter: true,
	},
	{
		name: 'Haier Inverter Refrigerator 20 Cu Ft',
		slug: 'haier-inverter-fridge-20cuft',
		brand_id: B['Haier'],
		category_id: C['Refrigerators'],
		model: 'HRF-538TIFRA Twin Inverter',
		watts: 130,
		price_pkr: 195000,
		is_inverter: true,
	},
	// PEL
	{
		name: 'PEL Life Pro Refrigerator 8 Cu Ft',
		slug: 'pel-fridge-8cuft-lifepro',
		brand_id: B['PEL'],
		category_id: C['Refrigerators'],
		model: 'PRLP-22350 Life Pro',
		watts: 115,
		price_pkr: 55000,
		is_inverter: false,
		description: '115W confirmed on pel.com.pk spec sheet, R-134a, 0.85A',
	},
	{
		name: 'PEL Refrigerator 14 Cu Ft',
		slug: 'pel-fridge-14cuft',
		brand_id: B['PEL'],
		category_id: C['Refrigerators'],
		model: 'PRLP-22550',
		watts: 145,
		price_pkr: 79000,
		is_inverter: false,
	},
	{
		name: 'PEL Inverter Refrigerator 18 Cu Ft',
		slug: 'pel-inverter-fridge-18cuft',
		brand_id: B['PEL'],
		category_id: C['Refrigerators'],
		model: 'PRLP-22850 INV',
		watts: 100,
		price_pkr: 112000,
		is_inverter: true,
	},
	// Orient
	{
		name: 'Orient Refrigerator 14 Cu Ft',
		slug: 'orient-fridge-14cuft',
		brand_id: B['Orient'],
		category_id: C['Refrigerators'],
		model: 'OR-45400',
		watts: 135,
		price_pkr: 80000,
		is_inverter: false,
	},
	// Waves
	{
		name: 'Waves Refrigerator 9 Cu Ft',
		slug: 'waves-fridge-9cuft',
		brand_id: B['Waves'],
		category_id: C['Refrigerators'],
		model: 'WR-250G',
		watts: 100,
		price_pkr: 54000,
		is_inverter: false,
	},
	// Samsung
	{
		name: 'Samsung Double Door Refrigerator 16 Cu Ft',
		slug: 'samsung-fridge-16cuft-dd',
		brand_id: B['Samsung'],
		category_id: C['Refrigerators'],
		model: 'RT42A5552DX',
		watts: 140,
		price_pkr: 130000,
		is_inverter: true,
	},
	// LG
	{
		name: 'LG Double Door Refrigerator 18 Cu Ft',
		slug: 'lg-fridge-18cuft-dd',
		brand_id: B['LG'],
		category_id: C['Refrigerators'],
		model: 'GL-T292RPZX',
		watts: 160,
		price_pkr: 145000,
		is_inverter: true,
	},

	// ════════════════════════════════════════════════════════════
	// DEEP FREEZERS (130-200 W)
	// ════════════════════════════════════════════════════════════
	{
		name: 'Waves Deep Freezer 8 Cu Ft',
		slug: 'waves-deep-freezer-8cuft',
		brand_id: B['Waves'],
		category_id: C['Deep Freezers'],
		model: 'WDF-208',
		watts: 130,
		price_pkr: 55000,
	},
	{
		name: 'Dawlance Deep Freezer 12 Cu Ft',
		slug: 'dawlance-deep-freezer-12cuft',
		brand_id: B['Dawlance'],
		category_id: C['Deep Freezers'],
		model: 'DF-300C',
		watts: 160,
		price_pkr: 72000,
	},
	{
		name: 'Haier Deep Freezer 10 Cu Ft',
		slug: 'haier-deep-freezer-10cuft',
		brand_id: B['Haier'],
		category_id: C['Deep Freezers'],
		model: 'HDF-285',
		watts: 130,
		price_pkr: 65000,
	},
	{
		name: 'PEL Deep Freezer 14 Cu Ft',
		slug: 'pel-deep-freezer-14cuft',
		brand_id: B['PEL'],
		category_id: C['Deep Freezers'],
		model: 'PEL-350S',
		watts: 160,
		price_pkr: 74000,
	},
	{
		name: 'Orient Deep Freezer 10 Cu Ft',
		slug: 'orient-deep-freezer-10cuft',
		brand_id: B['Orient'],
		category_id: C['Deep Freezers'],
		model: 'ODF-280',
		watts: 130,
		price_pkr: 60000,
	},
	{
		name: 'Kenwood Deep Freezer 15 Cu Ft',
		slug: 'kenwood-deep-freezer-15cuft',
		brand_id: B['Kenwood'],
		category_id: C['Deep Freezers'],
		model: 'KDF-430S',
		watts: 175,
		price_pkr: 82000,
	},
	{
		name: 'Dawlance Vertical Freezer 12 Cu Ft',
		slug: 'dawlance-vertical-freezer-12cuft',
		brand_id: B['Dawlance'],
		category_id: C['Deep Freezers'],
		model: 'VF-300C',
		watts: 155,
		price_pkr: 78000,
	},

	// ════════════════════════════════════════════════════════════
	// WASHING MACHINES
	// Semi-auto: ~360W; top-load auto: ~480-550W; front-load: ~600W
	// ════════════════════════════════════════════════════════════
	{
		name: 'Super Asia Semi-Auto Washing Machine 7.5 kg',
		slug: 'super-asia-washer-sa240-75kg',
		brand_id: B['Super Asia'],
		category_id: C['Washing Machines'],
		model: 'SA-240',
		watts: 360,
		price_pkr: 32000,
	},
	{
		name: 'Super Asia Fully Auto Washing Machine 12 kg',
		slug: 'super-asia-washer-12kg-auto',
		brand_id: B['Super Asia'],
		category_id: C['Washing Machines'],
		model: 'SA-888',
		watts: 500,
		price_pkr: 60000,
	},
	{
		name: 'Dawlance Twin Tub Washing Machine 7 kg',
		slug: 'dawlance-washer-twin-7kg',
		brand_id: B['Dawlance'],
		category_id: C['Washing Machines'],
		model: 'DW-6100C',
		watts: 360,
		price_pkr: 34000,
	},
	{
		name: 'Dawlance Top Load Automatic 8 kg',
		slug: 'dawlance-washer-topload-8kg',
		brand_id: B['Dawlance'],
		category_id: C['Washing Machines'],
		model: 'DWT-8100Bs',
		watts: 500,
		price_pkr: 72000,
	},
	{
		name: 'Dawlance Front Load Automatic 8 kg',
		slug: 'dawlance-washer-frontload-8kg',
		brand_id: B['Dawlance'],
		category_id: C['Washing Machines'],
		model: 'DWD-7200',
		watts: 600,
		price_pkr: 95000,
	},
	{
		name: 'Haier Fully Auto Top Load 8 kg',
		slug: 'haier-washer-topload-8kg',
		brand_id: B['Haier'],
		category_id: C['Washing Machines'],
		model: 'HWM80-B714S',
		watts: 550,
		price_pkr: 95000,
	},
	{
		name: 'Haier Front Load 8 kg',
		slug: 'haier-washer-frontload-8kg',
		brand_id: B['Haier'],
		category_id: C['Washing Machines'],
		model: 'HW80-BM14956',
		watts: 600,
		price_pkr: 115000,
	},
	{
		name: 'PEL Semi-Auto Twin Tub 7 kg',
		slug: 'pel-washer-twin-7kg',
		brand_id: B['PEL'],
		category_id: C['Washing Machines'],
		model: 'PAW-7500CG',
		watts: 360,
		price_pkr: 33000,
	},
	{
		name: 'Samsung Front Load 7 kg',
		slug: 'samsung-washer-frontload-7kg',
		brand_id: B['Samsung'],
		category_id: C['Washing Machines'],
		model: 'WW70T4020EX',
		watts: 550,
		price_pkr: 125000,
	},
	{
		name: 'LG Front Load 8 kg',
		slug: 'lg-washer-frontload-8kg',
		brand_id: B['LG'],
		category_id: C['Washing Machines'],
		model: 'FHT1208SWL',
		watts: 600,
		price_pkr: 138000,
	},
	{
		name: 'Kenwood Top Load Automatic 7 kg',
		slug: 'kenwood-washer-topload-7kg',
		brand_id: B['Kenwood'],
		category_id: C['Washing Machines'],
		model: 'KWM-1075',
		watts: 480,
		price_pkr: 68000,
	},
	{
		name: 'Singer Semi-Auto Washing Machine 7 kg',
		slug: 'singer-washer-semi-7kg',
		brand_id: B['Singer'],
		category_id: C['Washing Machines'],
		model: 'SWM-8500',
		watts: 360,
		price_pkr: 30000,
	},

	// ════════════════════════════════════════════════════════════
	// MICROWAVE OVENS
	// Solo: rated output 700-900W; Grill: input 1400-1500W
	// ════════════════════════════════════════════════════════════
	{
		name: 'Dawlance Microwave Oven Solo 25L',
		slug: 'dawlance-microwave-solo-25l',
		brand_id: B['Dawlance'],
		category_id: C['Microwave Ovens'],
		model: 'MD-7',
		watts: 900,
		price_pkr: 22000,
	},
	{
		name: 'Dawlance Microwave Oven Grill 30L',
		slug: 'dawlance-microwave-grill-30l',
		brand_id: B['Dawlance'],
		category_id: C['Microwave Ovens'],
		model: 'INOX-330',
		watts: 1400,
		price_pkr: 38000,
		description: '1400W rated input, 900W microwave + 2000W grill element',
	},
	{
		name: 'Haier Microwave Oven Solo 20L',
		slug: 'haier-microwave-solo-20l',
		brand_id: B['Haier'],
		category_id: C['Microwave Ovens'],
		model: 'HMN-20MXP5',
		watts: 700,
		price_pkr: 19500,
	},
	{
		name: 'Orient Microwave Oven Solo 25L',
		slug: 'orient-microwave-solo-25l',
		brand_id: B['Orient'],
		category_id: C['Microwave Ovens'],
		model: 'OM-25',
		watts: 900,
		price_pkr: 21000,
	},
	{
		name: 'PEL Microwave Oven Solo 20L',
		slug: 'pel-microwave-solo-20l',
		brand_id: B['PEL'],
		category_id: C['Microwave Ovens'],
		model: 'PMO-20WL',
		watts: 700,
		price_pkr: 18500,
	},
	{
		name: 'Nasgas Built-in Microwave Oven Grill 25L',
		slug: 'nasgas-builtin-microwave-grill-25l',
		brand_id: B['Nasgas'],
		category_id: C['Microwave Ovens'],
		model: 'NMW-25G',
		watts: 1450,
		price_pkr: 34999,
		description:
			'Rated input 1450W, output 900W, grill 2000W – nasgas.com/shop',
	},
	{
		name: 'Kenwood Microwave Oven Grill 30L',
		slug: 'kenwood-microwave-grill-30l',
		brand_id: B['Kenwood'],
		category_id: C['Microwave Ovens'],
		model: 'KMW-930G',
		watts: 1450,
		price_pkr: 36000,
	},
	{
		name: 'Samsung Microwave Oven 23L',
		slug: 'samsung-microwave-23l',
		brand_id: B['Samsung'],
		category_id: C['Microwave Ovens'],
		model: 'MS23K3513AK',
		watts: 800,
		price_pkr: 28000,
	},

	// ════════════════════════════════════════════════════════════
	// WATER PUMPS (370-750 W)
	// ════════════════════════════════════════════════════════════
	{
		name: 'Nasgas Water Pump 0.5 HP',
		slug: 'nasgas-water-pump-05hp',
		brand_id: B['Nasgas'],
		category_id: C['Water Pumps'],
		model: 'NWP-05',
		watts: 370,
		price_pkr: 14000,
	},
	{
		name: 'Nasgas Water Pump 1 HP',
		slug: 'nasgas-water-pump-1hp',
		brand_id: B['Nasgas'],
		category_id: C['Water Pumps'],
		model: 'NWP-10',
		watts: 750,
		price_pkr: 22000,
	},
	{
		name: 'GFC Water Pump 0.5 HP',
		slug: 'gfc-water-pump-05hp',
		brand_id: B['GFC'],
		category_id: C['Water Pumps'],
		model: 'WP-0.5',
		watts: 370,
		price_pkr: 15000,
	},
	{
		name: 'GFC Water Pump 1 HP',
		slug: 'gfc-water-pump-1hp',
		brand_id: B['GFC'],
		category_id: C['Water Pumps'],
		model: 'WP-1.0',
		watts: 750,
		price_pkr: 24000,
	},
	{
		name: 'Super Asia Water Pump 0.5 HP',
		slug: 'super-asia-pump-05hp',
		brand_id: B['Super Asia'],
		category_id: C['Water Pumps'],
		model: 'SA-WP05',
		watts: 370,
		price_pkr: 14500,
	},

	// ════════════════════════════════════════════════════════════
	// WATER HEATERS (GEYSERS)
	// Electric storage: 2000 W; instant electric: 2000-3000 W
	// Gas models: watts = auto-ignition only (~10 W)
	// Sources: Super Asia EH-630 spec (2000W), Westpoint WF-1310 (2000W)
	// ════════════════════════════════════════════════════════════
	{
		name: 'Westpoint Electric Geyser 35L',
		slug: 'westpoint-geyser-35l',
		brand_id: B['Westpoint'],
		category_id: C['Water Heaters'],
		model: 'WF-1310',
		watts: 2000,
		price_pkr: 12000,
		description: 'Standard 35L storage electric geyser',
	},
	{
		name: 'Super Asia Electric Water Heater 10L',
		slug: 'super-asia-geyser-10l-electric',
		brand_id: B['Super Asia'],
		category_id: C['Water Heaters'],
		model: 'SEH-10',
		watts: 2000,
		price_pkr: 20500,
		description: 'Compact 10L storage geyser, 2000W, sapphire enamel tank',
	},
	{
		name: 'Super Asia Electric Water Heater 25L',
		slug: 'super-asia-geyser-25l-electric',
		brand_id: B['Super Asia'],
		category_id: C['Water Heaters'],
		model: 'EH-614 (14 gal)',
		watts: 2000,
		price_pkr: 26000,
		description: '14-gallon storage electric geyser',
	},
	{
		name: 'Super Asia Electric Water Heater 37L',
		slug: 'super-asia-geyser-37l-electric',
		brand_id: B['Super Asia'],
		category_id: C['Water Heaters'],
		model: 'EH-630',
		watts: 2000,
		price_pkr: 31000,
		description:
			'37L, 2000W – confirmed on product listing; sapphire enamel, IPX4',
	},
	{
		name: 'Super Asia Electric Water Heater 100L',
		slug: 'super-asia-geyser-100l-electric',
		brand_id: B['Super Asia'],
		category_id: C['Water Heaters'],
		model: 'MEH-100',
		watts: 2000,
		price_pkr: 48000,
	},
	{
		name: 'Super Asia Gas & Electric Geyser 30 Gal',
		slug: 'super-asia-geyser-30gal-hybrid',
		brand_id: B['Super Asia'],
		category_id: C['Water Heaters'],
		model: 'GEH-730AI',
		watts: 2000,
		price_pkr: 42700,
		description:
			'Dual power (gas+electric); electric element 2000W; auto-ignition',
	},
	{
		name: 'Super Asia Gas Instant Geyser 6L',
		slug: 'super-asia-gas-instant-6l',
		brand_id: B['Super Asia'],
		category_id: C['Water Heaters'],
		model: 'GH-206',
		watts: 10,
		price_pkr: 22000,
		description:
			'Gas-powered instant; watts = auto-ignition only. 70% gas energy efficient.',
	},
	{
		name: 'Super Asia Gas Instant Geyser 8L',
		slug: 'super-asia-gas-instant-8l',
		brand_id: B['Super Asia'],
		category_id: C['Water Heaters'],
		model: 'GH-208',
		watts: 10,
		price_pkr: 24000,
		description: 'Gas-powered instant; watts = auto-ignition only',
	},
	{
		name: 'Nasgas Electric Water Heater 25L',
		slug: 'nasgas-geyser-25l-electric',
		brand_id: B['Nasgas'],
		category_id: C['Water Heaters'],
		model: 'ND-EH25',
		watts: 2000,
		price_pkr: 14500,
	},
	{
		name: 'Nasgas Instant Electric Geyser',
		slug: 'nasgas-geyser-instant-electric',
		brand_id: B['Nasgas'],
		category_id: C['Water Heaters'],
		model: 'NAS-IE-1200',
		watts: 2000,
		price_pkr: 11000,
	},
	{
		name: 'Canon Appliances Electric Geyser 35L',
		slug: 'canon-geyser-35l-electric',
		brand_id: B['Canon Appliances'],
		category_id: C['Water Heaters'],
		model: 'CEH-35',
		watts: 2000,
		price_pkr: 16500,
	},
	{
		name: 'Canon Appliances Instant Gas Geyser 6L',
		slug: 'canon-gas-instant-6l',
		brand_id: B['Canon Appliances'],
		category_id: C['Water Heaters'],
		model: 'CIG-06',
		watts: 10,
		price_pkr: 12000,
		description: 'Gas-powered; watts = ignition only',
	},

	// ════════════════════════════════════════════════════════════
	// GAS COOKING RANGES
	// Watts = electric components only (auto-ignition ~10W,
	// electric grill element 2000W where fitted)
	// ════════════════════════════════════════════════════════════
	{
		name: 'Nasgas 3-Burner Cooking Range Auto Ignition',
		slug: 'nasgas-range-3b-auto',
		brand_id: B['Nasgas'],
		category_id: C['Gas Cooking Ranges'],
		model: 'DG-433',
		watts: 10,
		price_pkr: 38000,
		description:
			'3 prime burners, stainless steel, auto-ignition; watts = igniter only',
	},
	{
		name: 'Nasgas 4-Burner Cooking Range',
		slug: 'nasgas-range-4b-auto',
		brand_id: B['Nasgas'],
		category_id: C['Gas Cooking Ranges'],
		model: 'DG-444',
		watts: 10,
		price_pkr: 48000,
		description: '4 prime burners, glass top; watts = igniter+lamp only',
	},
	{
		name: 'Nasgas 5-Burner Cooking Range with Electric Grill',
		slug: 'nasgas-range-5b-egrill',
		brand_id: B['Nasgas'],
		category_id: C['Gas Cooking Ranges'],
		model: 'DG-534',
		watts: 2010,
		price_pkr: 62000,
		description:
			'5 prime burners + 2000W electric grill element + 10W auto-ignition',
	},
	{
		name: 'Super Asia 5-Burner Cooking Range',
		slug: 'super-asia-range-5b',
		brand_id: B['Super Asia'],
		category_id: C['Gas Cooking Ranges'],
		model: 'CR-505',
		watts: 10,
		price_pkr: 58000,
		description: '5-burner auto-ignition gas range; watts = igniter only',
	},

	// ════════════════════════════════════════════════════════════
	// BUILT-IN HOBS (gas; watts = electric ignition component)
	// ════════════════════════════════════════════════════════════
	{
		name: 'Nasgas 2-Burner Built-in Glass Hob',
		slug: 'nasgas-hob-2b-glass',
		brand_id: B['Nasgas'],
		category_id: C['Built-in Hobs'],
		model: 'DG-GN2',
		watts: 10,
		price_pkr: 18000,
		description:
			'2 brass burners, tempered glass, auto-ignition; watts = igniter',
	},
	{
		name: 'Nasgas 3-Burner Built-in S/S Hob',
		slug: 'nasgas-hob-3b-ss',
		brand_id: B['Nasgas'],
		category_id: C['Built-in Hobs'],
		model: 'DG-111',
		watts: 10,
		price_pkr: 22000,
		description: '3 burner stainless steel gas hob, auto-ignition',
	},
	{
		name: 'Nasgas 3-Burner Built-in Glass Hob',
		slug: 'nasgas-hob-3b-glass',
		brand_id: B['Nasgas'],
		category_id: C['Built-in Hobs'],
		model: 'DG-GN3',
		watts: 10,
		price_pkr: 26000,
		description: '3 burner premium glass hob, brass burners',
	},
	{
		name: 'Nasgas 5-Burner Built-in Glass Hob',
		slug: 'nasgas-hob-5b-glass',
		brand_id: B['Nasgas'],
		category_id: C['Built-in Hobs'],
		model: 'DG-GN5',
		watts: 10,
		price_pkr: 38000,
		description: '5 prime brass burners, tempered glass, auto-ignition',
	},
	{
		name: 'Super Asia 3-Burner Built-in Hob',
		slug: 'super-asia-hob-3b',
		brand_id: B['Super Asia'],
		category_id: C['Built-in Hobs'],
		model: 'SA-HB3',
		watts: 10,
		price_pkr: 20000,
	},

	// ════════════════════════════════════════════════════════════
	// KITCHEN HOODS (electric motors)
	// Wattages from nasgas.com/shop official listings:
	//   KHP-T180: 180W | KHP-280: 280W | KHP-270: 320W
	// ════════════════════════════════════════════════════════════
	{
		name: 'Nasgas Kitchen Hood 60cm 180W',
		slug: 'nasgas-hood-60cm-180w',
		brand_id: B['Nasgas'],
		category_id: C['Kitchen Hoods'],
		model: 'KHP-T180',
		watts: 180,
		price_pkr: 22000,
		description:
			'Black T-shape, 1100m³/h suction, 12V LED, 3-speed – nasgas.com/shop',
	},
	{
		name: 'Nasgas Kitchen Hood 60cm 280W',
		slug: 'nasgas-hood-60cm-280w',
		brand_id: B['Nasgas'],
		category_id: C['Kitchen Hoods'],
		model: 'KHP-280',
		watts: 280,
		price_pkr: 32000,
		description: '810mm, dual motor, 1300m³/h, auto-clean – nasgas.com/shop',
	},
	{
		name: 'Nasgas Kitchen Hood 90cm 320W',
		slug: 'nasgas-hood-90cm-320w',
		brand_id: B['Nasgas'],
		category_id: C['Kitchen Hoods'],
		model: 'KHP-270',
		watts: 320,
		price_pkr: 45000,
		description:
			'943mm T-shape, 1400m³/h, pure copper motor, turbo mode – nasgas.com/shop',
	},
	{
		name: 'Super Asia Kitchen Hood 60cm',
		slug: 'super-asia-hood-60cm',
		brand_id: B['Super Asia'],
		category_id: C['Kitchen Hoods'],
		model: 'SA-KH60',
		watts: 180,
		price_pkr: 24000,
	},
	{
		name: 'Orient Kitchen Hood 60cm',
		slug: 'orient-hood-60cm',
		brand_id: B['Orient'],
		category_id: C['Kitchen Hoods'],
		model: 'OH-60S',
		watts: 200,
		price_pkr: 26000,
	},
	{
		name: 'Kenwood Kitchen Hood 90cm',
		slug: 'kenwood-hood-90cm',
		brand_id: B['Kenwood'],
		category_id: C['Kitchen Hoods'],
		model: 'KHC-900',
		watts: 250,
		price_pkr: 38000,
	},

	// ════════════════════════════════════════════════════════════
	// ELECTRIC OVENS (counter-top)
	// ════════════════════════════════════════════════════════════
	{
		name: 'Westpoint Electric Oven 45L',
		slug: 'westpoint-electric-oven-45l',
		brand_id: B['Westpoint'],
		category_id: C['Electric Ovens'],
		model: 'WF-3800RKD',
		watts: 2200,
		price_pkr: 18500,
	},
	{
		name: 'Anex Electric Oven 35L',
		slug: 'anex-electric-oven-35l',
		brand_id: B['Anex'],
		category_id: C['Electric Ovens'],
		model: 'AG-3071',
		watts: 1800,
		price_pkr: 14500,
	},
	{
		name: 'Dawlance Mini Oven 35L',
		slug: 'dawlance-mini-oven-35l',
		brand_id: B['Dawlance'],
		category_id: C['Electric Ovens'],
		model: 'DMWO-35G',
		watts: 1800,
		price_pkr: 16000,
	},
	{
		name: 'Nasgas Built-in Electric Oven 65L',
		slug: 'nasgas-builtin-oven-65l',
		brand_id: B['Nasgas'],
		category_id: C['Electric Ovens'],
		model: 'NBO-65E',
		watts: 2500,
		price_pkr: 55000,
		description: 'Built-in multi-function electric oven with grill',
	},

	// ════════════════════════════════════════════════════════════
	// AIR FRYERS (stand-alone units)
	// ════════════════════════════════════════════════════════════
	{
		name: 'Anex Air Fryer 3.5L',
		slug: 'anex-air-fryer-35l',
		brand_id: B['Anex'],
		category_id: C['Air Fryers'],
		model: 'AG-2019',
		watts: 1400,
		price_pkr: 8500,
	},
	{
		name: 'Westpoint Air Fryer 4.5L',
		slug: 'westpoint-air-fryer-45l',
		brand_id: B['Westpoint'],
		category_id: C['Air Fryers'],
		model: 'WF-5258',
		watts: 1500,
		price_pkr: 10500,
	},
	{
		name: 'Dawlance Air Fryer 3L',
		slug: 'dawlance-air-fryer-3l',
		brand_id: B['Dawlance'],
		category_id: C['Air Fryers'],
		model: 'DAF-3000',
		watts: 1200,
		price_pkr: 9000,
	},
	{
		name: 'Orient Air Fryer 5L',
		slug: 'orient-air-fryer-5l',
		brand_id: B['Orient'],
		category_id: C['Air Fryers'],
		model: 'OAF-50',
		watts: 1700,
		price_pkr: 12000,
	},
	{
		name: 'Philips Air Fryer 4.1L',
		slug: 'philips-air-fryer-41l',
		brand_id: B['Philips'],
		category_id: C['Air Fryers'],
		model: 'HD9252/91',
		watts: 1400,
		price_pkr: 25000,
	},

	// ════════════════════════════════════════════════════════════
	// INDUCTION COOKERS
	// ════════════════════════════════════════════════════════════
	{
		name: 'Anex Induction Cooker',
		slug: 'anex-induction-cooker',
		brand_id: B['Anex'],
		category_id: C['Induction Cookers'],
		model: 'AG-2061',
		watts: 2000,
		price_pkr: 8500,
	},
	{
		name: 'Nasgas Induction Cooker',
		slug: 'nasgas-induction-cooker',
		brand_id: B['Nasgas'],
		category_id: C['Induction Cookers'],
		model: 'NIC-1800',
		watts: 1800,
		price_pkr: 9500,
	},
	{
		name: 'Westpoint Induction Cooker',
		slug: 'westpoint-induction-cooker',
		brand_id: B['Westpoint'],
		category_id: C['Induction Cookers'],
		model: 'WF-273',
		watts: 2000,
		price_pkr: 9000,
	},
	{
		name: 'Philips Induction Cooker',
		slug: 'philips-induction-cooker',
		brand_id: B['Philips'],
		category_id: C['Induction Cookers'],
		model: 'HD4928/01',
		watts: 2100,
		price_pkr: 18000,
	},

	// ════════════════════════════════════════════════════════════
	// AIR COOLERS
	// ════════════════════════════════════════════════════════════
	{
		name: 'Super Asia Air Cooler 60L',
		slug: 'super-asia-air-cooler-60l',
		brand_id: B['Super Asia'],
		category_id: C['Air Coolers'],
		model: 'AC-5000',
		watts: 150,
		price_pkr: 18000,
	},
	{
		name: 'Nasgas Room Air Cooler 65L',
		slug: 'nasgas-air-cooler-65l',
		brand_id: B['Nasgas'],
		category_id: C['Air Coolers'],
		model: 'NAC-9400 AC/DC',
		watts: 230,
		price_pkr: 24000,
		description:
			'230-250W per nasgas.com/shop listing; 100L water tank, hybrid AC/DC',
	},
	{
		name: 'Orient Air Cooler 50L',
		slug: 'orient-air-cooler-50l',
		brand_id: B['Orient'],
		category_id: C['Air Coolers'],
		model: 'OAC-5000',
		watts: 180,
		price_pkr: 19500,
	},
	{
		name: 'Kenwood Air Cooler 50L',
		slug: 'kenwood-air-cooler-50l',
		brand_id: B['Kenwood'],
		category_id: C['Air Coolers'],
		model: 'KAC-5000',
		watts: 200,
		price_pkr: 22000,
	},
	{
		name: 'Waves Air Cooler 50L',
		slug: 'waves-air-cooler-50l',
		brand_id: B['Waves'],
		category_id: C['Air Coolers'],
		model: 'WAC-5000',
		watts: 150,
		price_pkr: 17000,
	},

	// ════════════════════════════════════════════════════════════
	// ROOM HEATERS
	// NasGas NAS-1200: 1200W confirmed on nasgas.com/shop
	// ════════════════════════════════════════════════════════════
	{
		name: 'Nasgas Halogen Heater 1200W',
		slug: 'nasgas-halogen-heater-1200w',
		brand_id: B['Nasgas'],
		category_id: C['Room Heaters'],
		model: 'NAS-1200',
		watts: 1200,
		price_pkr: 5500,
		description:
			'1200W confirmed on nasgas.com/shop listing; 3 heating modes, timer',
	},
	{
		name: 'Nasgas Quartz Heater 2000W',
		slug: 'nasgas-quartz-heater-2000w',
		brand_id: B['Nasgas'],
		category_id: C['Room Heaters'],
		model: 'NAS-2000',
		watts: 2000,
		price_pkr: 7000,
	},
	{
		name: 'Anex Fan Heater 2000W',
		slug: 'anex-fan-heater-2000w',
		brand_id: B['Anex'],
		category_id: C['Room Heaters'],
		model: 'AG-3013',
		watts: 2000,
		price_pkr: 5500,
	},
	{
		name: 'Westpoint Fan Heater 2000W',
		slug: 'westpoint-fan-heater-2000w',
		brand_id: B['Westpoint'],
		category_id: C['Room Heaters'],
		model: 'WF-5204',
		watts: 2000,
		price_pkr: 6000,
	},
	{
		name: 'Kenwood Oil-Filled Radiator 2500W',
		slug: 'kenwood-oil-filled-radiator',
		brand_id: B['Kenwood'],
		category_id: C['Room Heaters'],
		model: 'KOH-9F',
		watts: 2500,
		price_pkr: 22000,
		description: '9-fin oil filled radiator, 2500W, thermostat control',
	},
	{
		name: 'Philips Space Heater 2000W',
		slug: 'philips-space-heater-2000w',
		brand_id: B['Philips'],
		category_id: C['Room Heaters'],
		model: 'AHR2124',
		watts: 2000,
		price_pkr: 15000,
	},

	// ════════════════════════════════════════════════════════════
	// LED TVs
	// Typical measured consumption: 32"=35-45W, 43"=65-75W,
	// 50"=80-90W, 55"=90-105W, 65"=120-140W, 75"=150-180W
	// ════════════════════════════════════════════════════════════
	{
		name: 'Orient LED TV 32"',
		slug: 'orient-led-tv-32',
		brand_id: B['Orient'],
		category_id: C['LED TVs'],
		model: 'OR32S4100',
		watts: 45,
		price_pkr: 38000,
	},
	{
		name: 'Orient Smart LED TV 43"',
		slug: 'orient-led-tv-43-smart',
		brand_id: B['Orient'],
		category_id: C['LED TVs'],
		model: 'OR43S8100F',
		watts: 70,
		price_pkr: 72000,
	},
	{
		name: 'Haier LED TV 32"',
		slug: 'haier-led-tv-32',
		brand_id: B['Haier'],
		category_id: C['LED TVs'],
		model: 'LE32K6000HA',
		watts: 38,
		price_pkr: 35000,
	},
	{
		name: 'Haier Smart LED TV 43"',
		slug: 'haier-led-tv-43-smart',
		brand_id: B['Haier'],
		category_id: C['LED TVs'],
		model: 'LE43K6600HQGA',
		watts: 70,
		price_pkr: 78000,
	},
	{
		name: 'Haier Smart QLED TV 55"',
		slug: 'haier-qled-tv-55',
		brand_id: B['Haier'],
		category_id: C['LED TVs'],
		model: '55S9QT',
		watts: 100,
		price_pkr: 145000,
	},
	{
		name: 'TCL Smart LED TV 32"',
		slug: 'tcl-led-tv-32',
		brand_id: B['TCL'],
		category_id: C['LED TVs'],
		model: '32S5400A',
		watts: 38,
		price_pkr: 32000,
	},
	{
		name: 'TCL Smart LED TV 43"',
		slug: 'tcl-led-tv-43',
		brand_id: B['TCL'],
		category_id: C['LED TVs'],
		model: '43P615',
		watts: 65,
		price_pkr: 65000,
	},
	{
		name: 'TCL QLED Smart TV 55"',
		slug: 'tcl-qled-tv-55',
		brand_id: B['TCL'],
		category_id: C['LED TVs'],
		model: '55C635',
		watts: 95,
		price_pkr: 115000,
	},
	{
		name: 'TCL QLED Smart TV 65"',
		slug: 'tcl-qled-tv-65',
		brand_id: B['TCL'],
		category_id: C['LED TVs'],
		model: '65C635',
		watts: 130,
		price_pkr: 165000,
	},
	{
		name: 'Samsung Crystal 4K TV 43"',
		slug: 'samsung-crystal4k-tv-43',
		brand_id: B['Samsung'],
		category_id: C['LED TVs'],
		model: 'UA43AU7000',
		watts: 68,
		price_pkr: 88000,
	},
	{
		name: 'Samsung Crystal 4K TV 55"',
		slug: 'samsung-crystal4k-tv-55',
		brand_id: B['Samsung'],
		category_id: C['LED TVs'],
		model: 'UA55AU7000',
		watts: 100,
		price_pkr: 135000,
	},
	{
		name: 'Samsung QLED 4K TV 65"',
		slug: 'samsung-qled-tv-65',
		brand_id: B['Samsung'],
		category_id: C['LED TVs'],
		model: 'QA65Q60B',
		watts: 130,
		price_pkr: 220000,
	},
	{
		name: 'LG 4K Smart LED TV 43"',
		slug: 'lg-4k-led-tv-43',
		brand_id: B['LG'],
		category_id: C['LED TVs'],
		model: '43UP7750PVB',
		watts: 68,
		price_pkr: 85000,
	},
	{
		name: 'LG NanoCell TV 55"',
		slug: 'lg-nanocell-tv-55',
		brand_id: B['LG'],
		category_id: C['LED TVs'],
		model: '55NANO75SQA',
		watts: 98,
		price_pkr: 130000,
	},
	{
		name: 'EcoStar Smart LED TV 32"',
		slug: 'ecostar-led-tv-32',
		brand_id: B['EcoStar'],
		category_id: C['LED TVs'],
		model: 'CX-32U571',
		watts: 38,
		price_pkr: 30000,
	},
	{
		name: 'EcoStar Smart LED TV 43"',
		slug: 'ecostar-led-tv-43',
		brand_id: B['EcoStar'],
		category_id: C['LED TVs'],
		model: 'CX-43U571',
		watts: 68,
		price_pkr: 58000,
	},
	{
		name: 'Changhong Ruba 43" Smart TV',
		slug: 'changhong-ruba-led-tv-43',
		brand_id: B['Changhong Ruba'],
		category_id: C['LED TVs'],
		model: 'LUD43C5500I',
		watts: 68,
		price_pkr: 60000,
	},
	{
		name: 'Dawlance Smart LED TV 32"',
		slug: 'dawlance-led-tv-32',
		brand_id: B['Dawlance'],
		category_id: C['LED TVs'],
		model: 'DWD-32G15S',
		watts: 38,
		price_pkr: 34000,
	},
	{
		name: 'Dawlance QLED TV 55"',
		slug: 'dawlance-qled-tv-55',
		brand_id: B['Dawlance'],
		category_id: C['LED TVs'],
		model: 'DWD-55G80Q',
		watts: 100,
		price_pkr: 125000,
	},
	{
		name: 'Hisense Smart LED TV 43"',
		slug: 'hisense-led-tv-43',
		brand_id: B['Hisense'],
		category_id: C['LED TVs'],
		model: '43A62H',
		watts: 68,
		price_pkr: 62000,
	},
	{
		name: 'Hisense ULED 4K TV 55"',
		slug: 'hisense-uled-tv-55',
		brand_id: B['Hisense'],
		category_id: C['LED TVs'],
		model: '55U6H',
		watts: 98,
		price_pkr: 115000,
	},

	// ════════════════════════════════════════════════════════════
	// ELECTRIC IRONS
	// ════════════════════════════════════════════════════════════
	{
		name: 'Anex Steam Iron',
		slug: 'anex-electric-iron-steam',
		brand_id: B['Anex'],
		category_id: C['Electric Irons'],
		model: 'AG-1022',
		watts: 1200,
		price_pkr: 3500,
	},
	{
		name: 'Anex Dry Iron',
		slug: 'anex-dry-iron',
		brand_id: B['Anex'],
		category_id: C['Electric Irons'],
		model: 'AG-1021',
		watts: 1000,
		price_pkr: 2200,
	},
	{
		name: 'Westpoint Dry Iron',
		slug: 'westpoint-dry-iron',
		brand_id: B['Westpoint'],
		category_id: C['Electric Irons'],
		model: 'WF-23',
		watts: 1000,
		price_pkr: 2200,
	},
	{
		name: 'Westpoint Steam Iron',
		slug: 'westpoint-steam-iron',
		brand_id: B['Westpoint'],
		category_id: C['Electric Irons'],
		model: 'WF-26',
		watts: 1200,
		price_pkr: 3200,
	},
	{
		name: 'Philips Steam Iron',
		slug: 'philips-steam-iron',
		brand_id: B['Philips'],
		category_id: C['Electric Irons'],
		model: 'GC1905/30',
		watts: 1440,
		price_pkr: 5500,
	},
	{
		name: 'Philips PerfectCare Steam Iron',
		slug: 'philips-perfectcare-steam-iron',
		brand_id: B['Philips'],
		category_id: C['Electric Irons'],
		model: 'GC3920/28',
		watts: 2400,
		price_pkr: 12000,
		description: '2400W high-end steam generator iron',
	},
	{
		name: 'Singer Steam Iron',
		slug: 'singer-steam-iron',
		brand_id: B['Singer'],
		category_id: C['Electric Irons'],
		model: 'SI-1200',
		watts: 1200,
		price_pkr: 3000,
	},

	// ════════════════════════════════════════════════════════════
	// HAIR CARE
	// ════════════════════════════════════════════════════════════
	{
		name: 'Anex Hair Dryer 1200W',
		slug: 'anex-hair-dryer-1200w',
		brand_id: B['Anex'],
		category_id: C['Hair Care'],
		model: 'AG-7002',
		watts: 1200,
		price_pkr: 2500,
	},
	{
		name: 'Westpoint Hair Dryer 1800W',
		slug: 'westpoint-hair-dryer-1800w',
		brand_id: B['Westpoint'],
		category_id: C['Hair Care'],
		model: 'WF-6255',
		watts: 1800,
		price_pkr: 3800,
	},
	{
		name: 'Philips Hair Dryer 1600W',
		slug: 'philips-hair-dryer-1600w',
		brand_id: B['Philips'],
		category_id: C['Hair Care'],
		model: 'BHD006/03',
		watts: 1600,
		price_pkr: 5500,
	},
	{
		name: 'Philips Hair Dryer 2100W',
		slug: 'philips-hair-dryer-2100w',
		brand_id: B['Philips'],
		category_id: C['Hair Care'],
		model: 'BHD360/10',
		watts: 2100,
		price_pkr: 9000,
		description: '2100W Thermal Care heat protection dryer',
	},
	{
		name: 'Anex Hair Straightener 90W',
		slug: 'anex-hair-straightener-90w',
		brand_id: B['Anex'],
		category_id: C['Hair Care'],
		model: 'AG-7064',
		watts: 90,
		price_pkr: 2000,
	},
	{
		name: 'Westpoint Hair Straightener',
		slug: 'westpoint-hair-straightener',
		brand_id: B['Westpoint'],
		category_id: C['Hair Care'],
		model: 'WF-6350',
		watts: 55,
		price_pkr: 2400,
	},
	{
		name: 'Dawlance Hair Straightener',
		slug: 'dawlance-hair-straightener',
		brand_id: B['Dawlance'],
		category_id: C['Hair Care'],
		model: 'DHS-100',
		watts: 90,
		price_pkr: 2800,
	},
	{
		name: 'Philips Hair Straightener',
		slug: 'philips-hair-straightener',
		brand_id: B['Philips'],
		category_id: C['Hair Care'],
		model: 'HP8316/00',
		watts: 230,
		price_pkr: 7500,
	},

	// ════════════════════════════════════════════════════════════
	// VACUUM CLEANERS
	// ════════════════════════════════════════════════════════════
	{
		name: 'Anex Vacuum Cleaner 1600W',
		slug: 'anex-vacuum-cleaner-1600w',
		brand_id: B['Anex'],
		category_id: C['Vacuum Cleaners'],
		model: 'AG-2094',
		watts: 1600,
		price_pkr: 12000,
	},
	{
		name: 'Westpoint Vacuum Cleaner 1800W',
		slug: 'westpoint-vacuum-1800w',
		brand_id: B['Westpoint'],
		category_id: C['Vacuum Cleaners'],
		model: 'WF-3600',
		watts: 1800,
		price_pkr: 15000,
	},
	{
		name: 'Philips Vacuum Cleaner 1800W',
		slug: 'philips-vacuum-1800w',
		brand_id: B['Philips'],
		category_id: C['Vacuum Cleaners'],
		model: 'FC9352/01',
		watts: 1800,
		price_pkr: 22000,
	},
	{
		name: 'Samsung Vacuum Cleaner 1600W',
		slug: 'samsung-vacuum-1600w',
		brand_id: B['Samsung'],
		category_id: C['Vacuum Cleaners'],
		model: 'VC16TCANDBN',
		watts: 1600,
		price_pkr: 18000,
	},

	// ════════════════════════════════════════════════════════════
	// WATER DISPENSERS
	// ════════════════════════════════════════════════════════════
	{
		name: 'Nasgas Water Dispenser Hot & Cold',
		slug: 'nasgas-water-dispenser-hc',
		brand_id: B['Nasgas'],
		category_id: C['Water Dispensers'],
		model: 'ND-1400',
		watts: 500,
		price_pkr: 22000,
	},
	{
		name: 'Orient Water Dispenser 3-Tap',
		slug: 'orient-water-dispenser-3tap',
		brand_id: B['Orient'],
		category_id: C['Water Dispensers'],
		model: 'CRYSTAL 3SR',
		watts: 500,
		price_pkr: 26000,
	},
	{
		name: 'Dawlance Water Dispenser Hot & Cold',
		slug: 'dawlance-water-dispenser-hc',
		brand_id: B['Dawlance'],
		category_id: C['Water Dispensers'],
		model: 'DW-1060 HC',
		watts: 500,
		price_pkr: 24000,
	},
	{
		name: 'Homage Water Dispenser',
		slug: 'homage-water-dispenser',
		brand_id: B['Homage'],
		category_id: C['Water Dispensers'],
		model: 'HWD-49320P',
		watts: 500,
		price_pkr: 23000,
	},
	{
		name: 'Waves Water Dispenser',
		slug: 'waves-water-dispenser',
		brand_id: B['Waves'],
		category_id: C['Water Dispensers'],
		model: 'WD-600',
		watts: 400,
		price_pkr: 20000,
	},
	{
		name: 'Changhong Ruba Water Dispenser',
		slug: 'changhong-ruba-water-dispenser',
		brand_id: B['Changhong Ruba'],
		category_id: C['Water Dispensers'],
		model: 'WD-130',
		watts: 500,
		price_pkr: 21000,
	},

	// ════════════════════════════════════════════════════════════
	// UPS & INVERTERS
	// ════════════════════════════════════════════════════════════
	{
		name: 'Homage UPS 650VA',
		slug: 'homage-ups-650va',
		brand_id: B['Homage'],
		category_id: C['UPS & Inverters'],
		model: 'HTI-0651SX',
		watts: 390,
		price_pkr: 18000,
	},
	{
		name: 'Homage UPS 1000VA',
		slug: 'homage-ups-1000va',
		brand_id: B['Homage'],
		category_id: C['UPS & Inverters'],
		model: 'HTI-1011SX',
		watts: 600,
		price_pkr: 28000,
	},
	{
		name: 'Homage UPS 1500VA',
		slug: 'homage-ups-1500va',
		brand_id: B['Homage'],
		category_id: C['UPS & Inverters'],
		model: 'HTI-1511SX',
		watts: 900,
		price_pkr: 38000,
	},
	{
		name: 'Homage Inverter 2400VA',
		slug: 'homage-inverter-2400va',
		brand_id: B['Homage'],
		category_id: C['UPS & Inverters'],
		model: 'HTI-2411SX',
		watts: 1440,
		price_pkr: 55000,
	},
	{
		name: 'Homage Inverter 3500VA',
		slug: 'homage-inverter-3500va',
		brand_id: B['Homage'],
		category_id: C['UPS & Inverters'],
		model: 'HTI-3511SX',
		watts: 2100,
		price_pkr: 75000,
	},
	{
		name: 'Homage Solar Inverter 3000VA',
		slug: 'homage-solar-inverter-3000va',
		brand_id: B['Homage'],
		category_id: C['UPS & Inverters'],
		model: 'HPVS-3022',
		watts: 3000,
		price_pkr: 95000,
		description: 'Hybrid solar inverter, supports solar panels + grid',
	},
	{
		name: 'Nasgas UPS 1000VA',
		slug: 'nasgas-ups-1000va',
		brand_id: B['Nasgas'],
		category_id: C['UPS & Inverters'],
		model: 'NG-UPS-1000',
		watts: 600,
		price_pkr: 25000,
	},
	{
		name: 'Orient UPS 1000VA',
		slug: 'orient-ups-1000va',
		brand_id: B['Orient'],
		category_id: C['UPS & Inverters'],
		model: 'OUP-1000',
		watts: 600,
		price_pkr: 26000,
	},

	// ════════════════════════════════════════════════════════════
	// ELECTRIC KETTLES (1500-2200 W)
	// ════════════════════════════════════════════════════════════
	{
		name: 'Anex Electric Kettle 1.8L 1500W',
		slug: 'anex-kettle-18l-1500w',
		brand_id: B['Anex'],
		category_id: C['Electric Kettles'],
		model: 'AG-4027',
		watts: 1500,
		price_pkr: 2800,
	},
	{
		name: 'Westpoint Electric Kettle 1.8L',
		slug: 'westpoint-kettle-18l',
		brand_id: B['Westpoint'],
		category_id: C['Electric Kettles'],
		model: 'WF-8261',
		watts: 1800,
		price_pkr: 3200,
	},
	{
		name: 'Dawlance Electric Kettle 1.7L',
		slug: 'dawlance-kettle-17l',
		brand_id: B['Dawlance'],
		category_id: C['Electric Kettles'],
		model: 'DEK-170G',
		watts: 1800,
		price_pkr: 3500,
	},
	{
		name: 'Philips Electric Kettle 1.7L',
		slug: 'philips-kettle-17l',
		brand_id: B['Philips'],
		category_id: C['Electric Kettles'],
		model: 'HD9350/91',
		watts: 2200,
		price_pkr: 6000,
	},
	{
		name: 'Nasgas Electric Kettle 1.8L',
		slug: 'nasgas-kettle-18l',
		brand_id: B['Nasgas'],
		category_id: C['Electric Kettles'],
		model: 'NK-180',
		watts: 1800,
		price_pkr: 3000,
	},
	{
		name: 'Singer Electric Kettle 1.7L',
		slug: 'singer-kettle-17l',
		brand_id: B['Singer'],
		category_id: C['Electric Kettles'],
		model: 'SK-1700',
		watts: 1500,
		price_pkr: 2600,
	},

	// ════════════════════════════════════════════════════════════
	// BLENDERS & MIXERS
	// ════════════════════════════════════════════════════════════
	{
		name: 'Anex Blender 2L 350W',
		slug: 'anex-blender-2l-350w',
		brand_id: B['Anex'],
		category_id: C['Blenders & Mixers'],
		model: 'AG-6040',
		watts: 350,
		price_pkr: 3500,
	},
	{
		name: 'Westpoint Blender 1.5L 400W',
		slug: 'westpoint-blender-15l-400w',
		brand_id: B['Westpoint'],
		category_id: C['Blenders & Mixers'],
		model: 'WF-9285',
		watts: 400,
		price_pkr: 4200,
	},
	{
		name: 'Nasgas Blender 1.5L 350W',
		slug: 'nasgas-blender-15l-350w',
		brand_id: B['Nasgas'],
		category_id: C['Blenders & Mixers'],
		model: 'NB-350',
		watts: 350,
		price_pkr: 3000,
	},
	{
		name: 'Dawlance Hand Blender 600W',
		slug: 'dawlance-hand-blender-600w',
		brand_id: B['Dawlance'],
		category_id: C['Blenders & Mixers'],
		model: 'DHB-600',
		watts: 600,
		price_pkr: 4500,
	},
	{
		name: 'Philips Hand Mixer 450W',
		slug: 'philips-hand-mixer-450w',
		brand_id: B['Philips'],
		category_id: C['Blenders & Mixers'],
		model: 'HR3705/10',
		watts: 450,
		price_pkr: 7500,
	},
	{
		name: 'Kenwood Stand Mixer 1000W',
		slug: 'kenwood-stand-mixer-1000w',
		brand_id: B['Kenwood'],
		category_id: C['Blenders & Mixers'],
		model: 'KM010A Chef',
		watts: 1000,
		price_pkr: 55000,
		description: 'Kenwood Chef 1000W stand mixer',
	},
	{
		name: 'Singer Blender 1.5L 500W',
		slug: 'singer-blender-15l-500w',
		brand_id: B['Singer'],
		category_id: C['Blenders & Mixers'],
		model: 'SB-5000',
		watts: 500,
		price_pkr: 3800,
	},

	// ════════════════════════════════════════════════════════════
	// FOOD PROCESSORS
	// ════════════════════════════════════════════════════════════
	{
		name: 'Anex Food Processor 800W',
		slug: 'anex-food-processor-800w',
		brand_id: B['Anex'],
		category_id: C['Food Processors'],
		model: 'AG-3059',
		watts: 800,
		price_pkr: 6500,
	},
	{
		name: 'Westpoint Food Processor 700W',
		slug: 'westpoint-food-proc-700w',
		brand_id: B['Westpoint'],
		category_id: C['Food Processors'],
		model: 'WF-1804',
		watts: 700,
		price_pkr: 7000,
	},
	{
		name: 'Kenwood Food Processor 800W',
		slug: 'kenwood-food-proc-800w',
		brand_id: B['Kenwood'],
		category_id: C['Food Processors'],
		model: 'FDP301WH',
		watts: 800,
		price_pkr: 18000,
	},
	{
		name: 'Philips Food Processor 650W',
		slug: 'philips-food-proc-650w',
		brand_id: B['Philips'],
		category_id: C['Food Processors'],
		model: 'HR7761/00',
		watts: 650,
		price_pkr: 15000,
	},

	// ════════════════════════════════════════════════════════════
	// TOASTERS & SANDWICH MAKERS
	// ════════════════════════════════════════════════════════════
	{
		name: 'Anex 2-Slice Toaster 800W',
		slug: 'anex-toaster-2slice',
		brand_id: B['Anex'],
		category_id: C['Toasters & Sandwich Makers'],
		model: 'AG-3016T',
		watts: 800,
		price_pkr: 2500,
	},
	{
		name: 'Anex Sandwich Maker 750W',
		slug: 'anex-sandwich-maker',
		brand_id: B['Anex'],
		category_id: C['Toasters & Sandwich Makers'],
		model: 'AG-2034',
		watts: 750,
		price_pkr: 2200,
	},
	{
		name: 'Westpoint 4-Slice Toaster 1500W',
		slug: 'westpoint-toaster-4slice',
		brand_id: B['Westpoint'],
		category_id: C['Toasters & Sandwich Makers'],
		model: 'WF-2500T',
		watts: 1500,
		price_pkr: 4200,
	},
	{
		name: 'Dawlance Sandwich Maker 800W',
		slug: 'dawlance-sandwich-maker',
		brand_id: B['Dawlance'],
		category_id: C['Toasters & Sandwich Makers'],
		model: 'DSM-220',
		watts: 800,
		price_pkr: 2600,
	},
	{
		name: 'Philips Toaster HD2581 1000W',
		slug: 'philips-toaster-hd2581',
		brand_id: B['Philips'],
		category_id: C['Toasters & Sandwich Makers'],
		model: 'HD2581/90',
		watts: 1000,
		price_pkr: 6500,
	},

	// ════════════════════════════════════════════════════════════
	// PHONE CHARGERS
	// Watts = rated output wattage (what the device receives)
	// Sources: official brand spec sheets and product listings
	// ════════════════════════════════════════════════════════════
	// ── Xiaomi ──
	{
		name: 'Xiaomi Standard Charger 10W',
		slug: 'xiaomi-charger-10w',
		brand_id: B['Xiaomi'],
		category_id: C['Phone Chargers'],
		model: 'MDY-08-EI',
		watts: 10,
		price_pkr: 800,
		description:
			'5V/2A basic USB-A charger bundled with entry-level Redmi phones',
	},
	{
		name: 'Xiaomi Fast Charger 18W',
		slug: 'xiaomi-charger-18w',
		brand_id: B['Xiaomi'],
		category_id: C['Phone Chargers'],
		model: 'MDY-11-EZ',
		watts: 18,
		price_pkr: 1500,
		description: '18W Quick Charge 3.0 USB-A charger',
	},
	{
		name: 'Xiaomi Turbo Charger 33W',
		slug: 'xiaomi-charger-33w',
		brand_id: B['Xiaomi'],
		category_id: C['Phone Chargers'],
		model: 'MDY-12-EH',
		watts: 33,
		price_pkr: 2500,
		description:
			'33W dual-port (USB-A + USB-C) turbo charger, compatible: Note 10/11/12 Pro, Poco X3/X5',
	},
	{
		name: 'Xiaomi HyperCharge 67W',
		slug: 'xiaomi-charger-67w',
		brand_id: B['Xiaomi'],
		category_id: C['Phone Chargers'],
		model: 'MDY-13-EE',
		watts: 67,
		price_pkr: 4500,
		description: '67W single USB-C, PD 3.0; compatible: 12 Pro/13/14 series',
	},
	{
		name: 'Xiaomi HyperCharge 120W',
		slug: 'xiaomi-charger-120w',
		brand_id: B['Xiaomi'],
		category_id: C['Phone Chargers'],
		model: 'AD120200UK',
		watts: 120,
		price_pkr: 7500,
		description:
			'120W GaN, single USB-C; compatible: Xiaomi 11T Pro, 12S Ultra',
	},
	// ── Samsung ──
	{
		name: 'Samsung Adaptive Fast Charger 15W',
		slug: 'samsung-charger-15w',
		brand_id: B['Samsung'],
		category_id: C['Phone Chargers'],
		model: 'EP-TA20',
		watts: 15,
		price_pkr: 1400,
		description:
			'5V/2A + 9V/1.67A, micro-USB or USB-C; bundled with Galaxy A-series',
	},
	{
		name: 'Samsung Super Fast Charger 25W',
		slug: 'samsung-charger-25w',
		brand_id: B['Samsung'],
		category_id: C['Phone Chargers'],
		model: 'EP-TA800',
		watts: 25,
		price_pkr: 2800,
		description:
			'25W PD, USB-C; compatible: Galaxy S21/S22/S23, A52s, A73 etc.',
	},
	{
		name: 'Samsung Super Fast Charger 2.0 45W',
		slug: 'samsung-charger-45w',
		brand_id: B['Samsung'],
		category_id: C['Phone Chargers'],
		model: 'EP-TA845',
		watts: 45,
		price_pkr: 5500,
		description:
			'45W PPS USB-C; compatible: Galaxy S22/S23 Ultra, Note 20 Ultra, Z Fold',
	},
	// ── OnePlus ──
	{
		name: 'OnePlus Dash Charge 30W',
		slug: 'oneplus-charger-30w',
		brand_id: B['OnePlus'],
		category_id: C['Phone Chargers'],
		model: 'DC0504A3GB',
		watts: 30,
		price_pkr: 2500,
		description: '5V/6A Dash Charge; compatible: OnePlus 6/6T/7',
	},
	{
		name: 'OnePlus Warp Charge 65W',
		slug: 'oneplus-charger-65w',
		brand_id: B['OnePlus'],
		category_id: C['Phone Chargers'],
		model: 'WC065A21JH',
		watts: 65,
		price_pkr: 4500,
		description:
			'65W Warp Charge, dual circuit; compatible: OnePlus 8T/9/9R/9 Pro/10 Pro. 38 min full charge on 9R.',
	},
	{
		name: 'OnePlus SUPERVOOC 80W',
		slug: 'oneplus-charger-80w',
		brand_id: B['OnePlus'],
		category_id: C['Phone Chargers'],
		model: 'VH058F3FH',
		watts: 80,
		price_pkr: 6000,
		description: '80W SUPERVOOC; compatible: OnePlus 10T/11/12',
	},
	{
		name: 'OnePlus SUPERVOOC 100W',
		slug: 'oneplus-charger-100w',
		brand_id: B['OnePlus'],
		category_id: C['Phone Chargers'],
		model: 'VH060F3UK',
		watts: 100,
		price_pkr: 7500,
		description: '100W SUPERVOOC; compatible: OnePlus 11 Pro/12 Pro',
	},
	// ── Apple ──
	{
		name: 'Apple 5W USB Power Adapter',
		slug: 'apple-charger-5w',
		brand_id: B['Apple'],
		category_id: C['Phone Chargers'],
		model: 'A1385 / A1399',
		watts: 5,
		price_pkr: 2500,
		description:
			'Legacy 5W USB-A adapter bundled with iPhone 5/6/7/8; still sold as accessory',
	},
	{
		name: 'Apple 12W USB Power Adapter',
		slug: 'apple-charger-12w',
		brand_id: B['Apple'],
		category_id: C['Phone Chargers'],
		model: 'A2167',
		watts: 12,
		price_pkr: 3500,
		description: '12W USB-A; good for fast-charging older iPhones and iPads',
	},
	{
		name: 'Apple 20W USB-C Power Adapter',
		slug: 'apple-charger-20w',
		brand_id: B['Apple'],
		category_id: C['Phone Chargers'],
		model: 'MHJA3ZA/A',
		watts: 20,
		price_pkr: 5500,
		description: '20W USB-C PD; fast charges iPhone 12/13/14/15 and AirPods',
	},
	// ── OPPO ──
	{
		name: 'OPPO VOOC Flash Charge 33W',
		slug: 'oppo-charger-33w',
		brand_id: B['OPPO'],
		category_id: C['Phone Chargers'],
		model: 'VCA7JACH',
		watts: 33,
		price_pkr: 2500,
		description: '33W VOOC 4.0 USB-A; compatible: OPPO F19/Reno 6/A96',
	},
	{
		name: 'OPPO SuperVOOC 65W',
		slug: 'oppo-charger-65w',
		brand_id: B['OPPO'],
		category_id: C['Phone Chargers'],
		model: 'VCB4JACH',
		watts: 65,
		price_pkr: 5000,
		description:
			'65W SuperVOOC, USB-C; compatible: OPPO Find X3/Reno 7 Pro/10 Pro',
	},
	{
		name: 'OPPO SuperVOOC 150W',
		slug: 'oppo-charger-150w',
		brand_id: B['OPPO'],
		category_id: C['Phone Chargers'],
		model: 'VCH4JACH',
		watts: 150,
		price_pkr: 9500,
		description: '150W ultra-fast; compatible: Find X6 Pro / X5 Pro',
	},
	// ── Vivo ──
	{
		name: 'Vivo FlashCharge 33W',
		slug: 'vivo-charger-33w',
		brand_id: B['Vivo'],
		category_id: C['Phone Chargers'],
		model: 'V19800AC',
		watts: 33,
		price_pkr: 2500,
		description: '33W FlashCharge USB-C; bundled with Vivo Y76/V23',
	},
	{
		name: 'Vivo FlashCharge 44W',
		slug: 'vivo-charger-44w',
		brand_id: B['Vivo'],
		category_id: C['Phone Chargers'],
		model: 'V21044AC',
		watts: 44,
		price_pkr: 3500,
		description: '44W FlashCharge; compatible: Vivo X70/V23 Pro',
	},
	{
		name: 'Vivo FlashCharge 80W',
		slug: 'vivo-charger-80w',
		brand_id: B['Vivo'],
		category_id: C['Phone Chargers'],
		model: 'V22280AC',
		watts: 80,
		price_pkr: 6000,
		description: '80W FlashCharge; compatible: Vivo X90',
	},
	// ── Realme ──
	{
		name: 'Realme DART Charge 33W',
		slug: 'realme-charger-33w',
		brand_id: B['Realme'],
		category_id: C['Phone Chargers'],
		model: 'VC33JAACH',
		watts: 33,
		price_pkr: 2200,
		description: '33W DART USB-A; compatible: Realme 9 Pro/ GT Neo',
	},
	{
		name: 'Realme SuperDart 65W',
		slug: 'realme-charger-65w',
		brand_id: B['Realme'],
		category_id: C['Phone Chargers'],
		model: 'VC65JAACH',
		watts: 65,
		price_pkr: 4800,
		description: '65W SuperDart USB-C; compatible: Realme GT 2 Pro',
	},
	{
		name: 'Realme UltraDart 150W',
		slug: 'realme-charger-150w',
		brand_id: B['Realme'],
		category_id: C['Phone Chargers'],
		model: 'VC150JAACH',
		watts: 150,
		price_pkr: 9000,
		description: '150W UltraDart; compatible: Realme GT Neo 5',
	},
	// ── Google ──
	{
		name: 'Google USB-C 18W Power Adapter',
		slug: 'google-charger-18w',
		brand_id: B['Google'],
		category_id: C['Phone Chargers'],
		model: 'G1000-US',
		watts: 18,
		price_pkr: 3000,
		description: '18W USB-C PD; bundled with Pixel 3/4',
	},
	{
		name: 'Google 30W USB-C Charger',
		slug: 'google-charger-30w',
		brand_id: B['Google'],
		category_id: C['Phone Chargers'],
		model: 'GA03502-US',
		watts: 30,
		price_pkr: 5000,
		description:
			'30W USB-C PD; compatible: Pixel 6/7/8 series; 50-60% in 30 min',
	},
	// ── Nokia ──
	{
		name: 'Nokia Charger 10W',
		slug: 'nokia-charger-10w',
		brand_id: B['Nokia'],
		category_id: C['Phone Chargers'],
		model: 'AD-5WX',
		watts: 10,
		price_pkr: 800,
		description: '5V/2A standard USB-A charger bundled with Nokia G-series',
	},
	{
		name: 'Nokia Fast Charger 18W',
		slug: 'nokia-charger-18w',
		brand_id: B['Nokia'],
		category_id: C['Phone Chargers'],
		model: 'AD-18WX',
		watts: 18,
		price_pkr: 1500,
		description: '18W USB-C QC; compatible: Nokia X10/X20/G50',
	},
	// ── Tecno ──
	{
		name: 'Tecno Standard Charger 10W',
		slug: 'tecno-charger-10w',
		brand_id: B['Tecno'],
		category_id: C['Phone Chargers'],
		model: 'TC-C01',
		watts: 10,
		price_pkr: 700,
		description: '5V/2A; bundled with Tecno Spark and Pop series',
	},
	{
		name: 'Tecno Fast Charger 33W',
		slug: 'tecno-charger-33w',
		brand_id: B['Tecno'],
		category_id: C['Phone Chargers'],
		model: 'TC-C033',
		watts: 33,
		price_pkr: 2000,
		description: '33W; compatible: Tecno Camon 19 Pro/Phantom X2',
	},
	// ── Infinix ──
	{
		name: 'Infinix Standard Charger 10W',
		slug: 'infinix-charger-10w',
		brand_id: B['Infinix'],
		category_id: C['Phone Chargers'],
		model: 'IF-C01',
		watts: 10,
		price_pkr: 700,
	},
	{
		name: 'Infinix Fast Charger 33W',
		slug: 'infinix-charger-33w',
		brand_id: B['Infinix'],
		category_id: C['Phone Chargers'],
		model: 'XC-033',
		watts: 33,
		price_pkr: 2200,
		description: '33W; compatible: Infinix Zero 20/Note 12 VIP',
	},
	{
		name: 'Infinix All-Round Fast Charger 45W',
		slug: 'infinix-charger-45w',
		brand_id: B['Infinix'],
		category_id: C['Phone Chargers'],
		model: 'XC-045',
		watts: 45,
		price_pkr: 3500,
		description: '45W; compatible: Infinix Zero Ultra',
	},

	// ════════════════════════════════════════════════════════════
	// LAPTOP CHARGERS
	// Watts = adapter rated output (printed on the brick)
	// Note on PM Laptop Scheme: Government distributed Lenovo V14 G3
	// (Core i5-1235U, 8GB RAM, 256GB SSD) with a 65W USB-C adapter.
	// Sources: cargeek.pk, startuppakistan.com.pk (confirmed Lenovo V14 G3)
	// ════════════════════════════════════════════════════════════
	// ── Dell ──
	{
		name: 'Dell 45W USB-C Laptop Charger',
		slug: 'dell-charger-45w-usbc',
		brand_id: B['Dell'],
		category_id: C['Laptop Chargers'],
		model: '492-BDZX / HA45NM180',
		watts: 45,
		price_pkr: 3500,
		description:
			'USB-C PD 45W; compatible: Dell XPS 13, Inspiron 14 (Intel Evo)',
	},
	{
		name: 'Dell 65W Laptop Adapter',
		slug: 'dell-charger-65w',
		brand_id: B['Dell'],
		category_id: C['Laptop Chargers'],
		model: 'HA65NM130',
		watts: 65,
		price_pkr: 4500,
		description:
			'7.4mm barrel, 65W; compatible: Dell Inspiron 15/17, Latitude 3xxx',
	},
	{
		name: 'Dell 90W Laptop Adapter',
		slug: 'dell-charger-90w',
		brand_id: B['Dell'],
		category_id: C['Laptop Chargers'],
		model: 'PA-10 / DA90PM111',
		watts: 90,
		price_pkr: 5500,
		description:
			'7.4mm barrel, 90W; compatible: Dell Precision, Latitude 5xxx/7xxx',
	},
	{
		name: 'Dell 130W Laptop Adapter',
		slug: 'dell-charger-130w',
		brand_id: B['Dell'],
		category_id: C['Laptop Chargers'],
		model: 'HA130PM130',
		watts: 130,
		price_pkr: 7500,
		description:
			'7.4mm, 130W; compatible: Dell Alienware, G-series gaming laptops',
	},
	// ── HP ──
	{
		name: 'HP 45W Smart AC Adapter',
		slug: 'hp-charger-45w',
		brand_id: B['HP'],
		category_id: C['Laptop Chargers'],
		model: 'H6Y88AA',
		watts: 45,
		price_pkr: 3500,
		description:
			'4.5mm barrel; compatible: HP Pavilion x360, Spectre x360 (older)',
	},
	{
		name: 'HP 65W Smart AC Adapter',
		slug: 'hp-charger-65w',
		brand_id: B['HP'],
		category_id: C['Laptop Chargers'],
		model: '709985-001',
		watts: 65,
		price_pkr: 4500,
		description: '4.5mm, 65W; compatible: HP ProBook 440/450, EliteBook 840',
	},
	{
		name: 'HP 90W Smart AC Adapter',
		slug: 'hp-charger-90w',
		brand_id: B['HP'],
		category_id: C['Laptop Chargers'],
		model: '693711-001',
		watts: 90,
		price_pkr: 5800,
		description: '7.4mm, 90W; compatible: HP EliteBook, ZBook workstations',
	},
	{
		name: 'HP 65W USB-C Travel Adapter',
		slug: 'hp-charger-65w-usbc',
		brand_id: B['HP'],
		category_id: C['Laptop Chargers'],
		model: '1P3K6AA',
		watts: 65,
		price_pkr: 5000,
		description:
			'USB-C PD 65W; compatible: HP Spectre 13/14, Elite Dragonfly, Envy x360 (USB-C)',
	},
	// ── Lenovo ──
	{
		name: 'Lenovo 45W USB-C Adapter',
		slug: 'lenovo-charger-45w-usbc',
		brand_id: B['Lenovo'],
		category_id: C['Laptop Chargers'],
		model: 'GX20P92529',
		watts: 45,
		price_pkr: 3500,
		description:
			'USB-C PD 45W; compatible: ThinkPad X1 Carbon, IdeaPad 14 (USB-C)',
	},
	{
		name: 'Lenovo 65W USB-C Adapter (PM Laptop Scheme)',
		slug: 'lenovo-charger-65w-usbc-pm',
		brand_id: B['Lenovo'],
		category_id: C['Laptop Chargers'],
		model: 'GAN65C2 / ADL65YDC3A',
		watts: 65,
		price_pkr: 4500,
		description:
			'PM Youth Laptop Scheme 2023: Lenovo V14 G3 (i5-1235U, 8GB, 256GB SSD). Shipped with this 65W USB-C GaN adapter.',
	},
	{
		name: 'Lenovo 90W AC Adapter',
		slug: 'lenovo-charger-90w',
		brand_id: B['Lenovo'],
		category_id: C['Laptop Chargers'],
		model: 'SA10E75847',
		watts: 90,
		price_pkr: 5800,
		description:
			'Round barrel, 90W; compatible: IdeaPad 320/330/340, Legion Y series',
	},
	{
		name: 'Lenovo 135W Slim Tip Adapter',
		slug: 'lenovo-charger-135w',
		brand_id: B['Lenovo'],
		category_id: C['Laptop Chargers'],
		model: '4X20E75111',
		watts: 135,
		price_pkr: 7500,
		description: '135W; compatible: Legion 5/5 Pro, ThinkPad P53',
	},
	{
		name: 'Lenovo 170W Slim Tip Adapter',
		slug: 'lenovo-charger-170w',
		brand_id: B['Lenovo'],
		category_id: C['Laptop Chargers'],
		model: 'SA10E75848',
		watts: 170,
		price_pkr: 9000,
		description: '170W; compatible: Legion 7/7i, Yoga 7 AIO',
	},
	// ── Apple ──
	{
		name: 'Apple MacBook 30W USB-C Adapter',
		slug: 'apple-charger-macbook-30w',
		brand_id: B['Apple'],
		category_id: C['Laptop Chargers'],
		model: 'A2164 MHJA3',
		watts: 30,
		price_pkr: 9000,
		description:
			'30W USB-C; compatible: MacBook Air 13" M3 (base), older MacBook 12"',
	},
	{
		name: 'Apple MacBook Air 45W MagSafe 2',
		slug: 'apple-charger-macbook-air-45w',
		brand_id: B['Apple'],
		category_id: C['Laptop Chargers'],
		model: 'A1436',
		watts: 45,
		price_pkr: 12000,
		description: '45W MagSafe 2; compatible: MacBook Air 2012-2017',
	},
	{
		name: 'Apple MacBook Pro 61W USB-C',
		slug: 'apple-charger-macbookpro-61w',
		brand_id: B['Apple'],
		category_id: C['Laptop Chargers'],
		model: 'A1947 MLYV3',
		watts: 61,
		price_pkr: 16000,
		description: '61W USB-C PD; compatible: MacBook Pro 13" (Intel & M1/M2)',
	},
	{
		name: 'Apple MacBook Pro 96W USB-C',
		slug: 'apple-charger-macbookpro-96w',
		brand_id: B['Apple'],
		category_id: C['Laptop Chargers'],
		model: 'A2166 MNYV3',
		watts: 96,
		price_pkr: 22000,
		description: '96W USB-C PD; compatible: MacBook Pro 16" Intel (2019-2021)',
	},
	{
		name: 'Apple MacBook Pro 140W MagSafe 3',
		slug: 'apple-charger-macbookpro-140w',
		brand_id: B['Apple'],
		category_id: C['Laptop Chargers'],
		model: 'A2452 MLYU3',
		watts: 140,
		price_pkr: 28000,
		description:
			'140W USB-C MagSafe 3; compatible: MacBook Pro 14"/16" M2/M3 Pro & Max; fast charges in ~30 min to 50%',
	},
	// ── Asus ──
	{
		name: 'Asus 45W USB-C Adapter',
		slug: 'asus-charger-45w-usbc',
		brand_id: B['Asus'],
		category_id: C['Laptop Chargers'],
		model: 'AD883220',
		watts: 45,
		price_pkr: 4000,
	},
	{
		name: 'Asus 65W Laptop Adapter',
		slug: 'asus-charger-65w',
		brand_id: B['Asus'],
		category_id: C['Laptop Chargers'],
		model: 'ADP-65GD B',
		watts: 65,
		price_pkr: 4800,
		description: '4.0mm barrel, 65W; compatible: VivoBook 14/15, ZenBook 14',
	},
	{
		name: 'Asus 90W Laptop Adapter',
		slug: 'asus-charger-90w',
		brand_id: B['Asus'],
		category_id: C['Laptop Chargers'],
		model: 'ADP-90YD B',
		watts: 90,
		price_pkr: 6000,
		description: '4.5mm, 90W; compatible: ROG, TUF Gaming, ProArt StudioBook',
	},
	{
		name: 'Asus 150W Slim Adapter',
		slug: 'asus-charger-150w',
		brand_id: B['Asus'],
		category_id: C['Laptop Chargers'],
		model: 'ADP-150CH B',
		watts: 150,
		price_pkr: 8500,
		description: '150W; compatible: ROG Strix G15/G17, TUF A15/A17 (RTX 3070+)',
	},
	// ── Acer ──
	{
		name: 'Acer 45W USB-C Adapter',
		slug: 'acer-charger-45w-usbc',
		brand_id: B['Acer'],
		category_id: C['Laptop Chargers'],
		model: 'NP.ADT0A.076',
		watts: 45,
		price_pkr: 3800,
		description: 'USB-C PD 45W; compatible: Acer Swift 3/5 (USB-C models)',
	},
	{
		name: 'Acer 65W Laptop Adapter',
		slug: 'acer-charger-65w',
		brand_id: B['Acer'],
		category_id: C['Laptop Chargers'],
		model: 'KP.06503.006',
		watts: 65,
		price_pkr: 4500,
		description: '3.0mm, 65W; compatible: Aspire 5/7, Swift 3',
	},
	{
		name: 'Acer 90W Laptop Adapter',
		slug: 'acer-charger-90w',
		brand_id: B['Acer'],
		category_id: C['Laptop Chargers'],
		model: 'KP.09001.016',
		watts: 90,
		price_pkr: 6000,
		description: '90W; compatible: Aspire 7, Nitro 5 (GTX models)',
	},
];

// ─── SEED RUNNER ─────────────────────────────────────────────────────────────
const run = async () => {
	const client = await pool.connect();

	try {
		await client.query('BEGIN');

		// ── Remove legacy seed.js appliances whose slugs were renamed here ──
		// These were inserted by seed.js with shorter/different slugs.
		// Deleting them first lets populate re-insert the correct versions
		// (better model numbers, corrected wattages, extra detail fields).
		// pel-fridge-14cuft is also here because seed.js had the wrong model
		// number (PRLP-22350 instead of the correct PRLP-22550).
		const legacySlugs = [
			'gfc-ceiling-fan-standard', // → gfc-ceiling-fan-56-standard
			'gfc-ceiling-fan-energy-saver', // → gfc-ceiling-fan-56-energy-saver
			'royal-ceiling-fan-standard', // → royal-ceiling-fan-56-standard
			'royal-ceiling-fan-energy-saver', // → royal-ceiling-fan-56-energy-saver
			'tamoor-acdc-ceiling-fan', // → tamoor-acdc-ceiling-fan-30w
			'pak-fan-ceiling-standard', // → pak-fan-ceiling-56-standard
			'gfc-pedestal-fan', // → gfc-pedestal-fan-18
			'royal-pedestal-fan', // → royal-pedestal-fan-18
			'anex-table-fan', // → anex-table-fan-12
			'gfc-exhaust-fan', // → gfc-exhaust-fan-9
			'pak-fan-exhaust-fan', // → pak-fan-exhaust-fan-12
			'super-asia-washing-machine-semiauto', // → super-asia-washer-sa240-75kg
			'haier-fully-auto-washer-8kg', // → haier-washer-topload-8kg
			'dawlance-microwave-25l', // → dawlance-microwave-solo-25l
			'haier-microwave-20l', // → haier-microwave-solo-20l
			'haier-led-tv-43', // → haier-led-tv-43-smart (same model, slug clash)
			'super-asia-air-cooler', // → super-asia-air-cooler-60l
			'nasgas-water-dispenser', // → nasgas-water-dispenser-hc
			'pel-fridge-14cuft', // wrong model PRLP-22350 → correct PRLP-22550
		];
		const { rowCount: deleted } = await client.query(
			`DELETE FROM appliances WHERE slug = ANY($1)`,
			[legacySlugs],
		);
		console.log(`✔  Removed ${deleted} legacy slugs`);

		// ── Categories ──
		const categoryMap = {};
		for (const cat of categories) {
			const result = await client.query(
				`INSERT INTO categories (name, slug, description)
				 VALUES ($1, $2, $3)
				 ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description
				 RETURNING id, name`,
				[cat.name, cat.slug, cat.description],
			);
			categoryMap[result.rows[0].name] = result.rows[0].id;
		}
		console.log(`✔  Upserted ${categories.length} categories`);

		// ── Brands ──
		const brandMap = {};
		for (const brand of brands) {
			const result = await client.query(
				`INSERT INTO brands (name, slug, origin_country, website)
				 VALUES ($1, $2, $3, $4)
				 ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, origin_country = EXCLUDED.origin_country
				 RETURNING id, name`,
				[
					brand.name,
					brand.slug,
					brand.origin_country || 'Pakistan',
					brand.website || null,
				],
			);
			brandMap[result.rows[0].name] = result.rows[0].id;
		}
		console.log(`✔  Upserted ${brands.length} brands`);

		// ── Appliances ──
		const appliances = getAppliances(categoryMap, brandMap);
		let inserted = 0;
		let skipped = 0;
		for (const a of appliances) {
			const result = await client.query(
				`INSERT INTO appliances
					(name, slug, brand_id, category_id, model, watts, price_pkr, voltage, frequency_hz, is_inverter, description)
				 VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
				 ON CONFLICT (slug) DO NOTHING
				 RETURNING id`,
				[
					a.name,
					a.slug,
					a.brand_id,
					a.category_id,
					a.model || null,
					a.watts,
					a.price_pkr || 0,
					a.voltage || 220,
					a.frequency_hz || 50,
					a.is_inverter || false,
					a.description || null,
				],
			);
			if (result.rowCount > 0) inserted++;
			else skipped++;
		}
		console.log(
			`✔  Appliances: ${inserted} inserted, ${skipped} already existed (skipped)`,
		);

		await client.query('COMMIT');
		console.log('\n🎉  populate completed successfully.\n');
		console.log(`   Categories : ${categories.length}`);
		console.log(`   Brands     : ${brands.length}`);
		console.log(`   Appliances : ${appliances.length} total (${inserted} new)`);
	} catch (err) {
		await client.query('ROLLBACK');
		console.error('❌  populate failed:', err.message);
		process.exit(1);
	} finally {
		client.release();
		await pool.end();
	}
};

run();
