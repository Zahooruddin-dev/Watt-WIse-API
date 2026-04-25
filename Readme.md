# WattWise PK

An open source REST API for Pakistani home appliance wattage and pricing data. Track power consumption and PKR prices across all major categories and brands including GFC, Royal Fan, Khurshid, Tamoor, Dawlance, Haier, PEL, Orient, and more.

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Database Setup](#database-setup)
- [Admin Setup](#admin-setup)
- [Seeding Data](#seeding-data)
- [Authentication](#authentication)
- [API Reference](#api-reference)
  - [Appliances](#appliances)
  - [Categories](#categories)
  - [Brands](#brands)
  - [Stats](#stats)
- [Query Parameters](#query-parameters)
- [Response Format](#response-format)
- [Error Codes](#error-codes)
- [Contributing](#contributing)

---

## Tech Stack

- **Runtime**: Node.js (ESM)
- **Framework**: Express.js
- **Database**: PostgreSQL via [Neon](https://neon.tech) (serverless Postgres)
- **Auth**: JSON Web Tokens (JWT)
- **Validation**: express-validator
- **Password Hashing**: bcryptjs

---

## Project Structure

```
wattwise-pk/
├── src/
│   ├── app.js
│   ├── db/
│   │   ├── pool.js
│   │   └── schema.sql
│   ├── middleware/
│   │   └── auth.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── applianceController.js
│   │   ├── brandController.js
│   │   ├── categoryController.js
│   │   └── statsController.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── applianceRoutes.js
│   │   ├── brandRoutes.js
│   │   ├── categoryRoutes.js
│   │   └── statsRoutes.js
│   ├── queries/
│   │   ├── adminQueries.js
│   │   ├── applianceQueries.js
│   │   ├── brandQueries.js
│   │   ├── categoryQueries.js
│   │   └── statsQueries.js
│   └── validation/
│       ├── authValidation.js
│       ├── applianceValidation.js
│       ├── brandValidation.js
│       └── categoryValidation.js
├── scripts/
│   ├── createAdmin.js
│   └── seed.js
├── .env.example
├── package.json
└── README.md
```

---

## Getting Started

```bash
git clone https://github.com/zahooruddin-dev/wattwise-pk.git
cd wattwise-pk
npm install
cp .env.example .env
```

Fill in your `.env` file, then run the schema and seed scripts as described below.

```bash
npm run dev
```

---

## Environment Variables

| Variable | Description |
|---|---|
| `DATABASE_URL` | Neon PostgreSQL connection string |
| `JWT_SECRET` | A long random secret string for signing tokens |
| `JWT_EXPIRES_IN` | Token expiry duration, e.g. `24h` or `7d` |
| `PORT` | Port to run the server on (default: `3000`) |

Generate a secure `JWT_SECRET` with:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

---

## Database Setup

Create a project at [neon.tech](https://neon.tech), copy your connection string into `.env`, then run the schema:

```bash
psql $DATABASE_URL -f src/db/schema.sql
```

Or paste the contents of `src/db/schema.sql` directly into the Neon SQL editor.

---

## Admin Setup

Only one admin account is needed. Run the interactive script:

```bash
npm run create-admin
```

You will be prompted for a username and password. The password is hashed with bcrypt (cost factor 12) before storage.

---

## Seeding Data

The seed script inserts 20 categories, 25 brands, and 50 appliances covering the most common Pakistani appliance types and brands.

```bash
npm run seed
```

The seed is safe to run multiple times. It uses `ON CONFLICT DO NOTHING` so existing records are not duplicated.

---

## Authentication

All `POST`, `PUT`, and `DELETE` endpoints require an admin JWT token.

**Login:**

```
POST /api/auth/login
Content-Type: application/json

{
  "username": "your_admin_username",
  "password": "your_password"
}
```

**Response:**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "admin": {
    "id": 1,
    "username": "your_admin_username"
  }
}
```

**Using the token:**

Include it in the `Authorization` header of all write requests:

```
Authorization: Bearer <token>
```

---

## API Reference

Base URL: `http://localhost:3000/api`

---

### Appliances

#### List Appliances

```
GET /api/appliances
```

Returns a paginated list of all active appliances. Supports rich filtering — see [Query Parameters](#query-parameters).

**Example Response:**

```json
{
  "data": [
    {
      "id": 1,
      "name": "GFC Ceiling Fan Standard",
      "slug": "gfc-ceiling-fan-standard",
      "model": "Crown 56\"",
      "watts": 75,
      "price_pkr": 5200,
      "voltage": 220,
      "frequency_hz": 50,
      "is_inverter": false,
      "description": null,
      "is_active": true,
      "created_at": "2024-01-01T00:00:00.000Z",
      "updated_at": "2024-01-01T00:00:00.000Z",
      "brand": { "id": 1, "name": "GFC", "slug": "gfc" },
      "category": { "id": 1, "name": "Ceiling Fans", "slug": "ceiling-fans" }
    }
  ],
  "total": 50,
  "page": 1,
  "limit": 20,
  "total_pages": 3
}
```

---

#### Get Single Appliance

```
GET /api/appliances/:id
```

Accepts either a numeric `id` or a `slug`.

```
GET /api/appliances/1
GET /api/appliances/gfc-ceiling-fan-standard
```

---

#### Create Appliance — Admin Only

```
POST /api/appliances
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Royal Fan Ceiling Fan Standard",
  "slug": "royal-ceiling-fan-56",
  "brand_id": 2,
  "category_id": 1,
  "model": "Classic 56\"",
  "watts": 75,
  "price_pkr": 5500,
  "voltage": 220,
  "frequency_hz": 50,
  "is_inverter": false,
  "description": "Standard 56 inch ceiling fan"
}
```

| Field | Type | Required | Notes |
|---|---|---|---|
| `name` | string | yes | Max 200 chars |
| `slug` | string | yes | Lowercase, hyphens only, must be unique |
| `brand_id` | integer | yes | Must exist in brands table |
| `category_id` | integer | yes | Must exist in categories table |
| `model` | string | no | Max 200 chars |
| `watts` | number | yes | Must be greater than 0 |
| `price_pkr` | number | no | Price in Pakistani Rupees |
| `voltage` | integer | no | Default: 220 |
| `frequency_hz` | integer | no | Default: 50 |
| `is_inverter` | boolean | no | Default: false |
| `description` | string | no | Max 1000 chars |

---

#### Update Appliance — Admin Only

```
PUT /api/appliances/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "price_pkr": 5800,
  "watts": 72
}
```

All fields are optional. Only the fields provided will be updated.

---

#### Delete Appliance — Admin Only

```
DELETE /api/appliances/:id
Authorization: Bearer <token>
```

---

### Categories

#### List Categories

```
GET /api/categories
```

Returns all active categories. Admin users can pass `?include_inactive=true` to include inactive ones.

**Seeded categories:**

| Name | Slug |
|---|---|
| Ceiling Fans | ceiling-fans |
| Pedestal Fans | pedestal-fans |
| Table Fans | table-fans |
| Exhaust Fans | exhaust-fans |
| Wall Fans | wall-fans |
| Air Conditioners | air-conditioners |
| Refrigerators | refrigerators |
| Deep Freezers | deep-freezers |
| Washing Machines | washing-machines |
| Microwave Ovens | microwave-ovens |
| Water Pumps | water-pumps |
| Water Heaters | water-heaters |
| Electric Irons | electric-irons |
| LED TVs | led-tvs |
| Air Coolers | air-coolers |
| Electric Ovens | electric-ovens |
| Induction Cookers | induction-cookers |
| Vacuum Cleaners | vacuum-cleaners |
| Water Dispensers | water-dispensers |
| UPS & Inverters | ups-inverters |

---

#### Get Single Category

```
GET /api/categories/:id
GET /api/categories/ceiling-fans
```

---

#### Create Category — Admin Only

```
POST /api/categories
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Air Fryers",
  "slug": "air-fryers",
  "description": "Electric air fryers for oil-free cooking"
}
```

---

#### Update Category — Admin Only

```
PUT /api/categories/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "description": "Updated description",
  "is_active": false
}
```

---

#### Delete Category — Admin Only

```
DELETE /api/categories/:id
Authorization: Bearer <token>
```

A category cannot be deleted if it has appliances assigned to it. Reassign or delete those appliances first.

---

### Brands

#### List Brands

```
GET /api/brands
```

**Seeded brands:**

| Name | Slug | Country |
|---|---|---|
| GFC | gfc | Pakistan |
| Royal Fan | royal-fan | Pakistan |
| Khurshid Fan | khurshid-fan | Pakistan |
| Tamoor Fan | tamoor-fan | Pakistan |
| Pak Fan | pak-fan | Pakistan |
| Millat Fan | millat-fan | Pakistan |
| Dawlance | dawlance | Pakistan |
| Haier | haier | China |
| PEL | pel | Pakistan |
| Orient | orient | Pakistan |
| Kenwood | kenwood | United Kingdom |
| Gree | gree | China |
| TCL | tcl | China |
| Samsung | samsung | South Korea |
| LG | lg | South Korea |
| Waves | waves | Pakistan |
| Super Asia | super-asia | Pakistan |
| Changhong Ruba | changhong-ruba | China |
| EcoStar | ecostar | Pakistan |
| Westpoint | westpoint | Pakistan |
| Anex | anex | Pakistan |
| Homage | homage | Pakistan |
| Nasgas | nasgas | Pakistan |

---

#### Get Single Brand

```
GET /api/brands/:id
GET /api/brands/gfc
```

---

#### Create Brand — Admin Only

```
POST /api/brands
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Boss Fan",
  "slug": "boss-fan",
  "origin_country": "Pakistan",
  "website": "https://www.bossfan.com.pk"
}
```

| Field | Type | Required |
|---|---|---|
| `name` | string | yes |
| `slug` | string | yes |
| `origin_country` | string | no — defaults to Pakistan |
| `website` | string | no — must be valid URL |

---

#### Update Brand — Admin Only

```
PUT /api/brands/:id
Authorization: Bearer <token>
```

---

#### Delete Brand — Admin Only

```
DELETE /api/brands/:id
Authorization: Bearer <token>
```

A brand cannot be deleted if it has appliances assigned to it.

---

### Stats

Public endpoints, no authentication required.

#### Overview Stats

```
GET /api/stats
```

```json
{
  "data": {
    "total_appliances": "50",
    "total_brands": "23",
    "total_categories": "20",
    "avg_watts": "468.32",
    "min_watts": "22.00",
    "max_watts": "2200.00",
    "avg_price_pkr": "47820.00"
  }
}
```

---

#### Stats by Category

```
GET /api/stats/by-category
```

Returns wattage and pricing aggregates grouped by category.

---

#### Stats by Brand

```
GET /api/stats/by-brand
```

Returns wattage and pricing aggregates grouped by brand.

---

#### Most Efficient Appliances

```
GET /api/stats/most-efficient?limit=10
```

Returns the appliances with the lowest wattage across all categories.

---

## Query Parameters

All query parameters apply to `GET /api/appliances`.

| Parameter | Type | Description |
|---|---|---|
| `category_id` | integer | Filter by category ID |
| `brand_id` | integer | Filter by brand ID |
| `is_inverter` | boolean | `true` or `false` |
| `min_watts` | number | Minimum wattage |
| `max_watts` | number | Maximum wattage |
| `min_price` | number | Minimum price in PKR |
| `max_price` | number | Maximum price in PKR |
| `search` | string | Search in name, model, and brand name |
| `page` | integer | Page number, default `1` |
| `limit` | integer | Results per page, default `20`, max `100` |
| `sort_by` | string | `name`, `watts`, `price_pkr`, or `created_at` |
| `sort_order` | string | `ASC` or `DESC` |

**Examples:**

```
GET /api/appliances?category_id=1&sort_by=watts&sort_order=ASC
GET /api/appliances?brand_id=9&is_inverter=true
GET /api/appliances?min_watts=50&max_watts=100&search=gfc
GET /api/appliances?min_price=5000&max_price=10000&page=2&limit=10
```

---

## Response Format

All successful responses return JSON with a `data` field.

**Single resource:**

```json
{
  "data": { ... }
}
```

**List resource:**

```json
{
  "data": [ ... ],
  "total": 50,
  "page": 1,
  "limit": 20,
  "total_pages": 3
}
```

**Delete/action:**

```json
{
  "message": "Appliance deleted successfully"
}
```

---

## Error Codes

| Code | Meaning |
|---|---|
| `400` | Validation error — check the `errors` array in the response |
| `401` | Unauthorized — token missing, invalid, or expired |
| `404` | Resource not found |
| `409` | Conflict — duplicate slug, or cannot delete a resource with dependencies |
| `500` | Internal server error |

**Validation error response:**

```json
{
  "errors": [
    {
      "type": "field",
      "msg": "Watts must be a positive number",
      "path": "watts",
      "location": "body"
    }
  ]
}
```

---

## Contributing

Pull requests are welcome. To add new appliance data, run the seed script or use the admin endpoints. To propose new categories or brands, open an issue.

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Open a pull request

---

## License

MIT