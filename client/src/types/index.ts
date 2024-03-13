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

export interface User {
  id: string;
  name: string;
  email: string;
  login: string;
  phone: string;
  createdAt: string;
  cart: CartItem[];
  deliveries: Delivery[];
  favorites: string[];
}

export interface AppState {
  user: User | null;
  products: Product[];
  cart: CartItem[];
  favorites: string[];
  deliveries: Delivery[];
  currentPage: "home" | "cart" | "delivery" | "auth";
}
