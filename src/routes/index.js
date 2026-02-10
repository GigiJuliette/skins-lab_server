import express from "express";
import { requireAuth } from "../middleware/requireAuth.js";
import healthRoutes from "./health.js";
import authRoutes from "./auth.js";
import itemsRoutes from "./items.js";

const router = express.Router();

router.use("/health", healthRoutes);
router.use("/api/auth", authRoutes);
router.use("/api/items", requireAuth, itemsRoutes);

export default router;
