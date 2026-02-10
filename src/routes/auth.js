import express from "express";
import jwt from "jsonwebtoken";
import * as usersService from "../repository/users.js";

const router = express.Router();

router.post("/register", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || typeof email !== "string" || !email.trim()) {
      return res.status(400).json({ error: "email is required" });
    }
    if (!password || typeof password !== "string" || password.length < 6) {
      return res
        .status(400)
        .json({ error: "password must be at least 6 characters" });
    }

    const existing = await usersService.findByEmail(email.trim());
    if (existing) {
      return res.status(409).json({ error: "Email already registered" });
    }

    const user = await usersService.create(email.trim(), password);
    const token = jwt.sign(
      { sub: user.id },
      process.env.JWT_SECRET || "default-secret",
      { expiresIn: "7d" },
    );
    res.status(201).json({ user: { id: user.id, email: user.email }, token });
  } catch (err) {
    next(err);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "email and password are required" });
    }

    const user = await usersService.findByEmail(email.trim());
    if (!user || !(await usersService.verifyPassword(user, password))) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = jwt.sign(
      { sub: user.id },
      process.env.JWT_SECRET || "default-secret",
      { expiresIn: "7d" },
    );
    res.json({ user: { id: user.id, email: user.email }, token });
  } catch (err) {
    next(err);
  }
});

export default router;
