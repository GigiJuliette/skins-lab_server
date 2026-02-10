import dotenv from "dotenv";
dotenv.config();
import bcrypt from "bcrypt";
import { pool } from "../db/connection.js";

const SAMPLE_ITEMS = [
  { name: "Sample Item One", description: "First example item for the API" },
  { name: "Sample Item Two", description: "Second example item" },
  {
    name: "Sample Item Three",
    description: "Third example item with more text",
  },
  { name: "Sample Item Four", description: null },
  { name: "Sample Item Five", description: "Fifth and last seed item" },
];

async function seed() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW()
      )
    `);
    console.log('Table "users" ensured.');

    //demo user
    const passwordHash = await bcrypt.hash("password123", 10);
    await pool.query(
      "INSERT INTO users (email, password_hash) VALUES ($1, $2) ON CONFLICT (email) DO NOTHING",
      ["demo@example.com", passwordHash],
    );
    console.log("Seeded demo user: demo@example.com / password123");

    await pool.query(`
      CREATE TABLE IF NOT EXISTS items (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW()
      )
    `);
    console.log('Table "items" ensured.');

    for (const item of SAMPLE_ITEMS) {
      await pool.query(
        "INSERT INTO items (name, description) VALUES ($1, $2)",
        [item.name, item.description],
      );
    }
    console.log(`Seeded ${SAMPLE_ITEMS.length} sample items.`);
  } catch (err) {
    console.error("Seed failed:", err.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

seed();
