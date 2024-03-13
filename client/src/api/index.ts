const BASE = "/api";

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    credentials: "include",
    headers: { "Content-Type": "application/json", ...options.headers },
    ...options,
  });
  const data = (await res.json()) as T & { error?: string };
  if (!res.ok) throw new Error((data as { error?: string }).error ?? "Error");
  return data;
}

export const api = {
  auth: {
    register: (body: {
      name: string;
      email: string;
      login: string;
      phone: string;
      password: string;
    }) =>
      request<{ user: import("../types").User }>("/auth/register", {
        method: "POST",
        body: JSON.stringify(body),
      }),
    login: (body: { identifier: string; password: string }) =>
      request<{ user: import("../types").User }>("/auth/login", {
        method: "POST",
        body: JSON.stringify(body),
      }),
    logout: () => request<{ message: string }>("/auth/logout", { method: "POST" }),
    me: () => request<{ user: import("../types").User }>("/auth/me"),
  },
  products: {
    getAll: (params?: {
      search?: string;
      sortBy?: string;
      category?: string;
      available?: string;
    }) => {
      const qs = params
        ? "?" + new URLSearchParams(params as Record<string, string>).toString()
        : "";
      return request<{ products: import("../types").Product[] }>(
        `/products${qs}`
      );
    },
    getCategories: () =>
      request<{ categories: string[] }>("/products/categories"),
  },
  cart: {
    get: () =>
      request<{ cart: import("../types").CartItem[] }>("/cart"),
    add: (productId: string, quantity: number) =>
      request<{ cart: import("../types").CartItem[] }>("/cart", {
        method: "POST",
        body: JSON.stringify({ productId, quantity }),
      }),
    update: (productId: string, quantity: number) =>
      request<{ cart: import("../types").CartItem[] }>(`/cart/${productId}`, {
        method: "PATCH",
        body: JSON.stringify({ quantity }),
      }),
    remove: (productId: string) =>
      request<{ cart: import("../types").CartItem[] }>(`/cart/${productId}`, {
        method: "DELETE",
      }),
  },
  delivery: {
    get: () =>
      request<{ deliveries: import("../types").Delivery[] }>("/delivery"),
    create: (body: { address: string; city: string; phone: string }) =>
      request<{ delivery: import("../types").Delivery }>("/delivery", {
        method: "POST",
        body: JSON.stringify(body),
      }),
  },
  favorites: {
    get: () => request<{ favorites: string[] }>("/favorites"),
    toggle: (productId: string) =>
      request<{ favorites: string[] }>(`/favorites/${productId}`, {
        method: "POST",
      }),
  },
};
