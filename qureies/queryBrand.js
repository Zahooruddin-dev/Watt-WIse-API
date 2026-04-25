import pool from "../db/pool.js";

export const getAllBrands = async (includeInactive = false) => {
  const condition = includeInactive ? "" : "WHERE is_active = TRUE";
  const result = await pool.query(
    `SELECT id, name, slug, origin_country, website, is_active, created_at, updated_at FROM brands ${condition} ORDER BY name ASC`
  );
  return result.rows;
};

export const getBrandById = async (id) => {
  const result = await pool.query(
    "SELECT id, name, slug, origin_country, website, is_active, created_at, updated_at FROM brands WHERE id = $1",
    [id]
  );
  return result.rows[0];
};

export const getBrandBySlug = async (slug) => {
  const result = await pool.query(
    "SELECT id, name, slug, origin_country, website, is_active, created_at, updated_at FROM brands WHERE slug = $1",
    [slug]
  );
  return result.rows[0];
};

export const createBrand = async ({ name, slug, origin_country, website }) => {
  const result = await pool.query(
    "INSERT INTO brands (name, slug, origin_country, website) VALUES ($1, $2, $3, $4) RETURNING *",
    [name, slug, origin_country || "Pakistan", website || null]
  );
  return result.rows[0];
};

export const updateBrand = async (id, { name, slug, origin_country, website, is_active }) => {
  const result = await pool.query(
    `UPDATE brands
     SET name = COALESCE($1, name),
         slug = COALESCE($2, slug),
         origin_country = COALESCE($3, origin_country),
         website = COALESCE($4, website),
         is_active = COALESCE($5, is_active),
         updated_at = NOW()
     WHERE id = $6
     RETURNING *`,
    [name, slug, origin_country, website, is_active, id]
  );
  return result.rows[0];
};

export const deleteBrand = async (id) => {
  const result = await pool.query(
    "DELETE FROM brands WHERE id = $1 RETURNING id",
    [id]
  );
  return result.rows[0];
};

export const brandHasAppliances = async (id) => {
  const result = await pool.query(
    "SELECT COUNT(*) FROM appliances WHERE brand_id = $1",
    [id]
  );
  return parseInt(result.rows[0].count) > 0;
};