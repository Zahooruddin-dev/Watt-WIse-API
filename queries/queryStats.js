import pool from "../db/pool.js";

export const getOverviewStats = async () => {
  const result = await pool.query(`
    SELECT
      (SELECT COUNT(*) FROM appliances WHERE is_active = TRUE) AS total_appliances,
      (SELECT COUNT(*) FROM brands WHERE is_active = TRUE) AS total_brands,
      (SELECT COUNT(*) FROM categories WHERE is_active = TRUE) AS total_categories,
      (SELECT ROUND(AVG(watts), 2) FROM appliances WHERE is_active = TRUE) AS avg_watts,
      (SELECT MIN(watts) FROM appliances WHERE is_active = TRUE) AS min_watts,
      (SELECT MAX(watts) FROM appliances WHERE is_active = TRUE) AS max_watts,
      (SELECT ROUND(AVG(price_pkr), 2) FROM appliances WHERE is_active = TRUE AND price_pkr IS NOT NULL) AS avg_price_pkr
  `);
  return result.rows[0];
};

export const getStatsByCategory = async () => {
  const result = await pool.query(`
    SELECT
      c.id,
      c.name,
      c.slug,
      COUNT(a.id) AS total_appliances,
      ROUND(AVG(a.watts), 2) AS avg_watts,
      MIN(a.watts) AS min_watts,
      MAX(a.watts) AS max_watts,
      ROUND(AVG(a.price_pkr), 2) AS avg_price_pkr
    FROM categories c
    LEFT JOIN appliances a ON c.id = a.category_id AND a.is_active = TRUE
    WHERE c.is_active = TRUE
    GROUP BY c.id, c.name, c.slug
    ORDER BY total_appliances DESC
  `);
  return result.rows;
};

export const getStatsByBrand = async () => {
  const result = await pool.query(`
    SELECT
      b.id,
      b.name,
      b.slug,
      COUNT(a.id) AS total_appliances,
      ROUND(AVG(a.watts), 2) AS avg_watts,
      MIN(a.watts) AS min_watts,
      MAX(a.watts) AS max_watts,
      ROUND(AVG(a.price_pkr), 2) AS avg_price_pkr
    FROM brands b
    LEFT JOIN appliances a ON b.id = a.brand_id AND a.is_active = TRUE
    WHERE b.is_active = TRUE
    GROUP BY b.id, b.name, b.slug
    ORDER BY total_appliances DESC
  `);
  return result.rows;
};

export const getMostEfficientAppliances = async (limit = 10) => {
  const result = await pool.query(`
    SELECT
      a.id,
      a.name,
      a.slug,
      a.watts,
      a.price_pkr,
      b.name AS brand_name,
      c.name AS category_name
    FROM appliances a
    JOIN brands b ON a.brand_id = b.id
    JOIN categories c ON a.category_id = c.id
    WHERE a.is_active = TRUE
    ORDER BY a.watts ASC
    LIMIT $1
  `, [limit]);
  return result.rows;
};