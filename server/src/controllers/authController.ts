import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { readJson, writeJson } from "../utils/fileStore";
import { hashPassword, comparePassword } from "../utils/hash";
import {
  createSessionToken,
  COOKIE_NAME,
  SESSION_TTL_MS,
} from "../utils/session";
import { User, RegisterBody, LoginBody } from "../types";

export function register(req: Request, res: Response): void {
  const { name, email, login, phone, password } = req.body as RegisterBody;

  if (!name || !email || !login || !phone || !password) {
    res.status(400).json({ error: "All fields are required" });
    return;
  }

  const users = readJson<User[]>("users.json");

  const exists = users.find(
    (u) => u.email === email || u.login === login || u.phone === phone
  );
  if (exists) {
    res.status(409).json({ error: "User already exists" });
    return;
  }

  const newUser: User = {
    id: uuidv4(),
    name,
    email,
    login,
    phone,
    passwordHash: hashPassword(password),
    createdAt: new Date().toISOString(),
    cart: [],
    deliveries: [],
    favorites: [],
  };

  users.push(newUser);
  writeJson("users.json", users);

  const token = createSessionToken(newUser.id);
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "strict",
    maxAge: SESSION_TTL_MS,
  });

  const { passwordHash: _, ...safeUser } = newUser;
  res.status(201).json({ user: safeUser });
}

export function login(req: Request, res: Response): void {
  const { identifier, password } = req.body as LoginBody;

  if (!identifier || !password) {
    res.status(400).json({ error: "Identifier and password are required" });
    return;
  }

  const users = readJson<User[]>("users.json");
  const user = users.find(
    (u) =>
      u.email === identifier ||
      u.login === identifier ||
      u.phone === identifier ||
      u.name === identifier
  );

  if (!user || !comparePassword(password, user.passwordHash)) {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }

  const token = createSessionToken(user.id);
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "strict",
    maxAge: SESSION_TTL_MS,
  });

  const { passwordHash: _, ...safeUser } = user;
  res.json({ user: safeUser });
}

export function logout(req: Request, res: Response): void {
  res.clearCookie(COOKIE_NAME);
  res.json({ message: "Logged out" });
}

export function me(req: Request, res: Response): void {
  const userId = (req as Request & { userId?: string }).userId;
  const users = readJson<User[]>("users.json");
  const user = users.find((u) => u.id === userId);
  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }
  const { passwordHash: _, ...safeUser } = user;
  res.json({ user: safeUser });
}
