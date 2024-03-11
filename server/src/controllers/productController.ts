import { Request, Response } from "express";
import { readJson } from "../utils/fileStore";
import { Product } from "../types";

export function getProducts(req: Request, res: Response): void {
  const { search, sortBy, category, available } = req.query as {
    search?: string;
    sortBy?: string;
    category?: string;
    available?: string;
  };

  let products = readJson<Product[]>("products.json");

  if (search) {
    const q = search.toLowerCase();
    products = products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
    );
  }

  if (category) {
    products = products.filter((p) => p.category === category);
  }

  if (available !== undefined) {
    const isAvailable = available === "true";
    products = products.filter((p) => p.available === isAvailable);
  }

  if (sortBy === "price_asc") {
    products.sort((a, b) => a.price - b.price);
  } else if (sortBy === "price_desc") {
    products.sort((a, b) => b.price - a.price);
  }

  res.json({ products });
}

export function getProductById(req: Request, res: Response): void {
  const { id } = req.params;
  const products = readJson<Product[]>("products.json");
  const product = products.find((p) => p.id === id);
  if (!product) {
    res.status(404).json({ error: "Product not found" });
    return;
  }
  res.json({ product });
}

export function getCategories(req: Request, res: Response): void {
  const products = readJson<Product[]>("products.json");
  const categories = [...new Set(products.map((p) => p.category))];
  res.json({ categories });
}
