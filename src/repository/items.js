import { pool } from "../db/connection.js";

// const COLUMNS = "id, name, description, created_at";

export const list = async () => {
  const result = await pool.query(`SELECT * FROM skins ORDER BY id DESC`);
  return result.rows;
};

export async function getById(id) {
  const result = await pool.query(`SELECT * FROM skins WHERE id = $1`, [id]);
  return result.rows[0] ?? null;
}

// export async function create(name, description) {
//   const result = await pool.query(
//     `INSERT INTO items (name, description) VALUES ($1, $2) RETURNING id`,
//     [name, description],
//   );
//   return result.rows[0];
// }

// export async function update(id, name, description) {
//   const result = await pool.query(
//     `UPDATE items SET name = $1, description = $2 WHERE id = $3 RETURNING ${COLUMNS}`,
//     [name, description, id],
//   );
//   return result.rows[0] ?? null;
// }

// export async function remove(id) {
//   const result = await pool.query(
//     "DELETE FROM items WHERE id = $1 RETURNING id",
//     [id],
//   );
//   return result.rowCount > 0;
// }
