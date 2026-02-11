import bcrypt from "bcrypt";
import { pool } from "../db/connection.js";

export async function create(email, password) {
  const passwordHash = await bcrypt.hash(password, 10);
  const result = await pool.query(
    "INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email, created_at",
    [email, passwordHash],
  );
  return result.rows[0];
}

export async function findByEmail(email) {
  const result = await pool.query(
    "SELECT id, email, password_hash, created_at FROM users WHERE email = $1",
    [email],
  );
  return result.rows[0] ?? null;
}

export async function verifyPassword(user, password) {
  return bcrypt.compare(password, user.password_hash);
}
