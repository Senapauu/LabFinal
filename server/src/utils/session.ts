import crypto from "crypto";
import { SessionPayload } from "../types";

const SESSION_SECRET = "l_shop_secret_key_2024";
const COOKIE_NAME = "session_token";
const SESSION_TTL_MS = 10 * 60 * 1000; // 10 minutes

export { COOKIE_NAME, SESSION_TTL_MS };

export function createSessionToken(userId: string): string {
  const payload: SessionPayload = {
    userId,
    expiresAt: Date.now() + SESSION_TTL_MS,
  };
  const data = Buffer.from(JSON.stringify(payload)).toString("base64");
  const sig = crypto
    .createHmac("sha256", SESSION_SECRET)
    .update(data)
    .digest("hex");
  return `${data}.${sig}`;
}

export function verifySessionToken(token: string): SessionPayload | null {
  const parts = token.split(".");
  if (parts.length !== 2) return null;
  const [data, sig] = parts;
  const expectedSig = crypto
    .createHmac("sha256", SESSION_SECRET)
    .update(data)
    .digest("hex");
  if (sig !== expectedSig) return null;
  const payload = JSON.parse(
    Buffer.from(data, "base64").toString("utf-8")
  ) as SessionPayload;
  if (Date.now() > payload.expiresAt) return null;
  return payload;
}
