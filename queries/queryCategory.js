import pool from "../db/pool.js";

export const getAllCategories = async (includeInactive = false) => {
  const condition = includeInactive ? "" : "WHERE is_active = TRUE";
  const result = await pool.query(
    `SELECT id, name, slug, description, is_active, created_at, updated_at FROM categories ${condition} ORDER BY name ASC`
  );
  return result.rows;
};

export const getCategoryById = async (id) => {
  const result = await pool.query(
    "SELECT id, name, slug, description, is_active, created_at, updated_at FROM categories WHERE id = $1",
    [id]
  );
  return result.rows[0];
};

export const getCategoryBySlug = async (slug) => {
  const result = await pool.query(
    "SELECT id, name, slug, description, is_active, created_at, updated_at FROM categories WHERE slug = $1",
    [slug]
  );
  return result.rows[0];
};

export const createCategory = async ({ name, slug, description }) => {
  const result = await pool.query(
    "INSERT INTO categories (name, slug, description) VALUES ($1, $2, $3) RETURNING *",
    [name, slug, description || null]
  );
  return result.rows[0];
};

export const updateCategory = async (id, { name, slug, description, is_active }) => {
  const result = await pool.query(
    `UPDATE categories
     SET name = COALESCE($1, name),
         slug = COALESCE($2, slug),
         description = COALESCE($3, description),
         is_active = COALESCE($4, is_active),
         updated_at = NOW()
     WHERE id = $5
     RETURNING *`,
    [name, slug, description, is_active, id]
  );
  return result.rows[0];
};

export const deleteCategory = async (id) => {
  const result = await pool.query(
    "DELETE FROM categories WHERE id = $1 RETURNING id",
    [id]
  );
  return result.rows[0];
};

export const categoryHasAppliances = async (id) => {
  const result = await pool.query(
    "SELECT COUNT(*) FROM appliances WHERE category_id = $1",
    [id]
  );
  return parseInt(result.rows[0].count) > 0;
};