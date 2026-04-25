import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import { createClient } from "pg";
import readline from "readline";

dotenv.config();

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

const ask = (question) => new Promise((resolve) => rl.question(question, resolve));

const run = async () => {
  const client = new createClient({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });
  await client.connect();

  const username = await ask("Enter admin username: ");
  const password = await ask("Enter admin password: ");

  if (!username.trim() || !password.trim()) {
    console.log("Username and password cannot be empty.");
    rl.close();
    await client.end();
    process.exit(1);
  }

  const existing = await client.query("SELECT id FROM admins WHERE username = $1", [username.trim()]);
  if (existing.rows.length > 0) {
    console.log("An admin with this username already exists.");
    rl.close();
    await client.end();
    process.exit(1);
  }

  const hash = await bcrypt.hash(password, 12);
  const result = await client.query(
    "INSERT INTO admins (username, password_hash) VALUES ($1, $2) RETURNING id, username, created_at",
    [username.trim(), hash]
  );

  console.log("Admin created successfully:");
  console.log(result.rows[0]);

  rl.close();
  await client.end();
};

run().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});