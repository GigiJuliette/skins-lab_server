import express from "express";
import authRoutes from "./auth.js";
// import { requireAuth } from "../middleware/requireAuth.js";
import healthRoutes from "./health.js";
import itemsRoutes from "./items.js";

const router = express.Router();

router.use("/health", healthRoutes);
router.use("/api/auth", authRoutes);
router.use("/api/items", itemsRoutes);

export default router;
