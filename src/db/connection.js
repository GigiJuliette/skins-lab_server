import { Pool } from "pg";
import "dotenv/config";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.warn("DATABASE_URL is not set. Database features will fail.");
}

export const pool = new Pool({
  connectionString,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

pool.on("error", (err) => {
  console.error("Unexpected database pool error:", err.message);
});

/**
 * Get a client from the pool for transactions.
 * @returns {Promise<import('pg').PoolClient>}
 **/
export function getClient() {
  return pool.connect();
}
