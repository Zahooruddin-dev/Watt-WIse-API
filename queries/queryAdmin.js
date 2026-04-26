import pool from "../db/pool.js";

export const findAdminByUsername = async (username) => {
  const result = await pool.query(
    "SELECT * FROM admins WHERE username = $1",
    [username]
  );
  return result.rows[0];
};

export const createAdmin = async (username, passwordHash) => {
  const result = await pool.query(
    "INSERT INTO admins (username, password_hash) VALUES ($1, $2) RETURNING id, username, created_at",
    [username, passwordHash]
  );
  return result.rows[0];
};