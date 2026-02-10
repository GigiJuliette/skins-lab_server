import express from "express";
import { pool } from "../db/connection.js";

const router = express.Router();

router.get("/", async (_req, res) => {
  let databaseStatus = "disconnected";
  try {
    await pool.query("SELECT 1");
    databaseStatus = "connected";
  } catch (_err) {
    databaseStatus = "error";
  }

  res.json({
    status: "ok",
    database: databaseStatus,
    timestamp: new Date().toISOString(),
  });
});

export default router;
