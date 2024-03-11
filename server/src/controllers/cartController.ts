import { Request, Response } from "express";
import { readJson, writeJson } from "../utils/fileStore";
import { User, AddToCartBody } from "../types";

type AuthReq = Request & { userId?: string };

export function getCart(req: AuthReq, res: Response): void {
  const users = readJson<User[]>("users.json");
  const user = users.find((u) => u.id === req.userId);
  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }
  res.json({ cart: user.cart });
}

export function addToCart(req: AuthReq, res: Response): void {
  const { productId, quantity } = req.body as AddToCartBody;
  if (!productId || !quantity || quantity < 1) {
    res.status(400).json({ error: "Invalid product or quantity" });
    return;
  }

  const users = readJson<User[]>("users.json");
  const userIndex = users.findIndex((u) => u.id === req.userId);
  if (userIndex === -1) {
    res.status(404).json({ error: "User not found" });
    return;
  }

  const existing = users[userIndex].cart.find(
    (item) => item.productId === productId
  );
  if (existing) {
    existing.quantity += quantity;
  } else {
    users[userIndex].cart.push({ productId, quantity });
  }

  writeJson("users.json", users);
  res.json({ cart: users[userIndex].cart });
}

export function updateCartItem(req: AuthReq, res: Response): void {
  const { productId } = req.params;
  const { quantity } = req.body as { quantity: number };

  if (!quantity || quantity < 1) {
    res.status(400).json({ error: "Quantity must be at least 1" });
    return;
  }

  const users = readJson<User[]>("users.json");
  const userIndex = users.findIndex((u) => u.id === req.userId);
  if (userIndex === -1) {
    res.status(404).json({ error: "User not found" });
    return;
  }

  const item = users[userIndex].cart.find((i) => i.productId === productId);
  if (!item) {
    res.status(404).json({ error: "Item not in cart" });
    return;
  }

  item.quantity = quantity;
  writeJson("users.json", users);
  res.json({ cart: users[userIndex].cart });
}

export function removeFromCart(req: AuthReq, res: Response): void {
  const { productId } = req.params;

  const users = readJson<User[]>("users.json");
  const userIndex = users.findIndex((u) => u.id === req.userId);
  if (userIndex === -1) {
    res.status(404).json({ error: "User not found" });
    return;
  }

  users[userIndex].cart = users[userIndex].cart.filter(
    (i) => i.productId !== productId
  );
  writeJson("users.json", users);
  res.json({ cart: users[userIndex].cart });
}
