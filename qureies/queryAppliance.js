import pool from "../db/pool.js";

const BASE_SELECT = `
  SELECT
    a.id,
    a.name,
    a.slug,
    a.model,
    a.watts,
    a.price_pkr,
    a.voltage,
    a.frequency_hz,
    a.is_inverter,
    a.description,
    a.is_active,
    a.created_at,
    a.updated_at,
    b.id AS brand_id,
    b.name AS brand_name,
    b.slug AS brand_slug,
    c.id AS category_id,
    c.name AS category_name,
    c.slug AS category_slug
  FROM appliances a
  JOIN brands b ON a.brand_id = b.id
  JOIN categories c ON a.category_id = c.id
`;

const formatRow = (row) => ({
  id: row.id,
  name: row.name,
  slug: row.slug,
  model: row.model,
  watts: parseFloat(row.watts),
  price_pkr: row.price_pkr ? parseFloat(row.price_pkr) : null,
  voltage: row.voltage,
  frequency_hz: row.frequency_hz,
  is_inverter: row.is_inverter,
  description: row.description,
  is_active: row.is_active,
  created_at: row.created_at,
  updated_at: row.updated_at,
  brand: { id: row.brand_id, name: row.brand_name, slug: row.brand_slug },
  category: { id: row.category_id, name: row.category_name, slug: row.category_slug },
});

export const getAppliances = async ({ category_id, brand_id, is_inverter, min_watts, max_watts, min_price, max_price, search, is_active, page = 1, limit = 20, sort_by = "name", sort_order = "ASC" }) => {
  const conditions = [];
  const values = [];
  let idx = 1;

  if (category_id) { conditions.push(`a.category_id = $${idx++}`); values.push(category_id); }
  if (brand_id) { conditions.push(`a.brand_id = $${idx++}`); values.push(brand_id); }
  if (is_inverter !== undefined) { conditions.push(`a.is_inverter = $${idx++}`); values.push(is_inverter); }
  if (min_watts) { conditions.push(`a.watts >= $${idx++}`); values.push(min_watts); }
  if (max_watts) { conditions.push(`a.watts <= $${idx++}`); values.push(max_watts); }
  if (min_price) { conditions.push(`a.price_pkr >= $${idx++}`); values.push(min_price); }
  if (max_price) { conditions.push(`a.price_pkr <= $${idx++}`); values.push(max_price); }
  if (search) { conditions.push(`(a.name ILIKE $${idx++} OR a.model ILIKE $${idx - 1} OR b.name ILIKE $${idx - 1})`); values.push(`%${search}%`); }
  if (is_active !== undefined) { conditions.push(`a.is_active = $${idx++}`); values.push(is_active); } else { conditions.push(`a.is_active = TRUE`); }

  const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

  const allowedSorts = { name: "a.name", watts: "a.watts", price_pkr: "a.price_pkr", created_at: "a.created_at" };
  const orderCol = allowedSorts[sort_by] || "a.name";
  const orderDir = sort_order.toUpperCase() === "DESC" ? "DESC" : "ASC";

  const offset = (page - 1) * limit;
  values.push(limit);
  values.push(offset);

  const dataResult = await pool.query(
    `${BASE_SELECT} ${where} ORDER BY ${orderCol} ${orderDir} LIMIT $${idx++} OFFSET $${idx++}`,
    values
  );

  const countValues = values.slice(0, values.length - 2);
  const countResult = await pool.query(
    `SELECT COUNT(*) FROM appliances a JOIN brands b ON a.brand_id = b.id JOIN categories c ON a.category_id = c.id ${where}`,
    countValues
  );

  return {
    data: dataResult.rows.map(formatRow),
    total: parseInt(countResult.rows[0].count),
    page: parseInt(page),
    limit: parseInt(limit),
    total_pages: Math.ceil(parseInt(countResult.rows[0].count) / limit),
  };
};

export const getApplianceById = async (id) => {
  const result = await pool.query(`${BASE_SELECT} WHERE a.id = $1`, [id]);
  return result.rows[0] ? formatRow(result.rows[0]) : null;
};

export const getApplianceBySlug = async (slug) => {
  const result = await pool.query(`${BASE_SELECT} WHERE a.slug = $1`, [slug]);
  return result.rows[0] ? formatRow(result.rows[0]) : null;
};

export const createAppliance = async ({ name, slug, brand_id, category_id, model, watts, price_pkr, voltage, frequency_hz, is_inverter, description }) => {
  const result = await pool.query(
    `INSERT INTO appliances (name, slug, brand_id, category_id, model, watts, price_pkr, voltage, frequency_hz, is_inverter, description)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
     RETURNING id`,
    [name, slug, brand_id, category_id, model || null, watts, price_pkr || null, voltage || 220, frequency_hz || 50, is_inverter || false, description || null]
  );
  return getApplianceById(result.rows[0].id);
};

export const updateAppliance = async (id, { name, slug, brand_id, category_id, model, watts, price_pkr, voltage, frequency_hz, is_inverter, description, is_active }) => {
  const result = await pool.query(
    `UPDATE appliances
     SET name = COALESCE($1, name),
         slug = COALESCE($2, slug),
         brand_id = COALESCE($3, brand_id),
         category_id = COALESCE($4, category_id),
         model = COALESCE($5, model),
         watts = COALESCE($6, watts),
         price_pkr = COALESCE($7, price_pkr),
         voltage = COALESCE($8, voltage),
         frequency_hz = COALESCE($9, frequency_hz),
         is_inverter = COALESCE($10, is_inverter),
         description = COALESCE($11, description),
         is_active = COALESCE($12, is_active),
         updated_at = NOW()
     WHERE id = $13
     RETURNING id`,
    [name, slug, brand_id, category_id, model, watts, price_pkr, voltage, frequency_hz, is_inverter, description, is_active, id]
  );
  if (!result.rows[0]) return null;
  return getApplianceById(id);
};

export const deleteAppliance = async (id) => {
  const result = await pool.query(
    "DELETE FROM appliances WHERE id = $1 RETURNING id",
    [id]
  );
  return result.rows[0];
};

export const slugExists = async (slug, excludeId = null) => {
  const result = excludeId
    ? await pool.query("SELECT id FROM appliances WHERE slug = $1 AND id != $2", [slug, excludeId])
    : await pool.query("SELECT id FROM appliances WHERE slug = $1", [slug]);
  return result.rows.length > 0;
};