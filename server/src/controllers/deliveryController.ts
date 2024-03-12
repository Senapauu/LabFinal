import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { readJson, writeJson } from "../utils/fileStore";
import { User, Delivery, DeliveryBody } from "../types";

type AuthReq = Request & { userId?: string };

export function getDeliveries(req: AuthReq, res: Response): void {
  const users = readJson<User[]>("users.json");
  const user = users.find((u) => u.id === req.userId);
  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }
  res.json({ deliveries: user.deliveries });
}

export function createDelivery(req: AuthReq, res: Response): void {
  const { address, city, phone } = req.body as DeliveryBody;

  if (!address || !city || !phone) {
    res.status(400).json({ error: "Address, city and phone are required" });
    return;
  }

  const users = readJson<User[]>("users.json");
  const userIndex = users.findIndex((u) => u.id === req.userId);
  if (userIndex === -1) {
    res.status(404).json({ error: "User not found" });
    return;
  }

  const user = users[userIndex];
  if (user.cart.length === 0) {
    res.status(400).json({ error: "Cart is empty" });
    return;
  }

  const delivery: Delivery = {
    id: uuidv4(),
    address,
    city,
    phone,
    items: [...user.cart],
    status: "pending",
    createdAt: new Date().toISOString(),
  };

  users[userIndex].deliveries.push(delivery);
  users[userIndex].cart = [];
  writeJson("users.json", users);

  res.status(201).json({ delivery });
}
