import { Request, Response } from "express";
import { readJson, writeJson } from "../utils/fileStore";
import { User } from "../types";

type AuthReq = Request & { userId?: string };

export function getFavorites(req: AuthReq, res: Response): void {
  const users = readJson<User[]>("users.json");
  const user = users.find((u) => u.id === req.userId);
  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }
  res.json({ favorites: user.favorites });
}

export function toggleFavorite(req: AuthReq, res: Response): void {
  const { productId } = req.params;

  const users = readJson<User[]>("users.json");
  const userIndex = users.findIndex((u) => u.id === req.userId);
  if (userIndex === -1) {
    res.status(404).json({ error: "User not found" });
    return;
  }

  const favs = users[userIndex].favorites;
  const idx = favs.indexOf(productId);
  if (idx === -1) {
    favs.push(productId);
  } else {
    favs.splice(idx, 1);
  }

  writeJson("users.json", users);
  res.json({ favorites: users[userIndex].favorites });
}
