import { Request, Response, NextFunction } from "express";
import { verifySessionToken, COOKIE_NAME } from "../utils/session";
import { readJson } from "../utils/fileStore";
import { User } from "../types";

export interface AuthRequest extends Request {
  userId?: string;
}

export function requireAuth(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void {
  const token = req.cookies?.[COOKIE_NAME] as string | undefined;
  if (!token) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const payload = verifySessionToken(token);
  if (!payload) {
    res.clearCookie(COOKIE_NAME);
    res.status(401).json({ error: "Session expired" });
    return;
  }
  const users = readJson<User[]>("users.json");
  const user = users.find((u) => u.id === payload.userId);
  if (!user) {
    res.status(401).json({ error: "User not found" });
    return;
  }
  req.userId = payload.userId;
  next();
}
