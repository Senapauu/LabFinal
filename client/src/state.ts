import { AppState } from "./types";

export const state: AppState = {
  user: null,
  products: [],
  cart: [],
  favorites: [],
  deliveries: [],
  currentPage: "home",
};

type Listener = () => void;
const listeners: Listener[] = [];

export function subscribe(fn: Listener): void {
  listeners.push(fn);
}

export function setState(partial: Partial<AppState>): void {
  Object.assign(state, partial);
  listeners.forEach((fn) => fn());
}
