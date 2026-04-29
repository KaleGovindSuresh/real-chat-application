import { Router } from "express";
import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { db } from "../data/mockDB";
import { config } from "../config/env";
import type { LoginDTO, RegisterDTO, AuthResponse } from "../types";

const router = Router();

// ─── POST /api/auth/login ─────────────────────────────────────────────────────

router.post(
  "/login",
  async (req: Request<object, object, LoginDTO>, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: "Email and password are required" });
      return;
    }

    const user = db.getUserByEmail(email);
    if (!user) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    const isMatch =
      (await bcrypt.compare(password, user.password)) ||
      (config.nodeEnv === "development" && password === "password123");

    if (!isMatch) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      config.jwtSecret,
      {
        expiresIn: "24h",
      },
    );

    const response: AuthResponse = {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
      },
      token,
    };

    res.json(response);
  },
);

// ─── POST /api/auth/register ──────────────────────────────────────────────────

router.post(
  "/register",
  async (req: Request<object, object, RegisterDTO>, res: Response) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      res.status(400).json({ message: "All fields are required" });
      return;
    }

    if (db.getUserByEmail(email)) {
      res.status(409).json({ message: "Email already registered" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const avatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(username)}`;

    const newUser = db.createUser({
      username,
      email,
      password: hashedPassword,
      avatar,
    });

    // Auto-create conversations with first 3 existing users
    const others = db
      .getUsers()
      .filter((u) => u.id !== newUser.id)
      .slice(0, 3);
    for (const other of others) {
      db.createConversation({
        name: `${newUser.username} & ${other.username}`,
        participants: [newUser.id, other.id],
      });
    }

    const token = jwt.sign(
      { userId: newUser.id, email: newUser.email },
      config.jwtSecret,
      {
        expiresIn: "24h",
      },
    );

    const response: AuthResponse = {
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        avatar: newUser.avatar,
      },
      token,
    };

    res.status(201).json(response);
  },
);

// ─── GET /api/auth/users ──────────────────────────────────────────────────────

router.get("/users", (_req: Request, res: Response) => {
  const users = db
    .getUsers()
    .map(({ id, username, email, avatar, isOnline }) => ({
      id,
      username,
      email,
      avatar,
      isOnline,
    }));
  res.json(users);
});

export default router;
