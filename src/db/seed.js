import bcrypt from "bcrypt";
import dotenv from "dotenv";

import { pool } from "./connection.js";
import data from "./skins.json" with { type: "json" };

dotenv.config();

async function seed() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    // demo user
    const passwordHash = await bcrypt.hash("dev123", 10);
    await pool.query(
      "INSERT INTO users (email, password_hash) VALUES ($1, $2) ON CONFLICT (email) DO NOTHING",
      ["dev@dev.com", passwordHash],
    );
    console.log("Seeded demo user: dev@dev.com / dev123");

    await pool.query(`
      DROP TABLE IF EXISTS skins;

      CREATE TABLE IF NOT EXISTS skins (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        weapon_category VARCHAR(100) NOT NULL,
        weapon_name VARCHAR(255) NOT NULL,
        image TEXT NOT NULL,
        tags JSONB
      );
    `);
    console.log('Table "skins" ensured.');

    await pool.query(`
      CREATE TABLE IF NOT EXISTS loadouts (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        content JSONB
      );
    `);

    for (const skin of data.skins) {
      await pool.query(
        "INSERT INTO skins (name, weapon_category, weapon_name, tags, image) VALUES ($1, $2, $3, $4, $5)",
        [
          skin.name,
          skin.weapon_category,
          skin.weapon_name,
          skin.tags ? JSON.stringify(skin.tags) : null,
          skin.image,
        ],
      );
    }
    console.log(`Seeded ${data.skins.length} skins.`);
  } catch (err) {
    console.error("Seed failed:", err.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

seed();
