export interface User {
  id: string;
  name: string;
  email: string;
  login: string;
  phone: string;
  passwordHash: string;
  createdAt: string;
  cart: CartItem[];
  deliveries: Delivery[];
  favorites: string[];
}

export interface CartItem {
  productId: string;
  quantity: number;
}

export interface Delivery {
  id: string;
  address: string;
  city: string;
  phone: string;
  items: CartItem[];
  status: "pending" | "shipped" | "delivered";
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  available: boolean;
  imageUrl: string;
  stock: number;
  createdAt: string;
}

export interface SessionPayload {
  userId: string;
  expiresAt: number;
}

export interface RegisterBody {
  name: string;
  email: string;
  login: string;
  phone: string;
  password: string;
}

export interface LoginBody {
  identifier: string; // email | login | phone | name
  password: string;
}

export interface AddToCartBody {
  productId: string;
  quantity: number;
}

export interface DeliveryBody {
  address: string;
  city: string;
  phone: string;
}
