import express from "express";
import * as itemsService from "../repository/items.js";

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const limit = Math.min(parseInt(req.query.limit, 10) || 50, 100);
    const offset = parseInt(req.query.offset, 10) || 0;
    const items = await itemsService.list(limit, offset);
    res.json({ items });
  } catch (err) {
    next(err);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { name, description } = req.body;
    if (!name || typeof name !== "string" || name.trim() === "") {
      return res
        .status(400)
        .json({ error: "name is required and must be a non-empty string" });
    }
    const item = await itemsService.create(
      name.trim(),
      description != null ? String(description) : null,
    );
    res.status(201).json(item);
  } catch (err) {
    next(err);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id))
      return res.status(400).json({ error: "Invalid item id" });
    const item = await itemsService.getById(id);
    if (!item) return res.status(404).json({ error: "Item not found" });
    res.json(item);
  } catch (err) {
    next(err);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id))
      return res.status(400).json({ error: "Invalid item id" });
    const { name, description } = req.body;
    if (!name || typeof name !== "string" || name.trim() === "") {
      return res
        .status(400)
        .json({ error: "name is required and must be a non-empty string" });
    }
    const item = await itemsService.update(
      id,
      name.trim(),
      description != null ? String(description) : null,
    );
    if (!item) return res.status(404).json({ error: "Item not found" });
    res.json(item);
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id))
      return res.status(400).json({ error: "Invalid item id" });
    const deleted = await itemsService.remove(id);
    if (!deleted) return res.status(404).json({ error: "Item not found" });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

export default router;
