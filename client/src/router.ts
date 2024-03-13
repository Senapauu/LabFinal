import { state, setState } from "./state";
import { AppState } from "./types";

type Page = AppState["currentPage"];

const routes: Record<string, Page> = {
  "/": "home",
  "/cart": "cart",
  "/delivery": "delivery",
  "/auth": "auth",
};

export function navigate(page: Page): void {
  const path = Object.keys(routes).find((k) => routes[k] === page) ?? "/";
  history.pushState({}, "", path);
  setState({ currentPage: page });
}

export function initRouter(): void {
  const path = location.pathname;
  const page = routes[path] ?? "home";
  setState({ currentPage: page });

  window.addEventListener("popstate", () => {
    const p = routes[location.pathname] ?? "home";
    setState({ currentPage: p });
  });
}

export function requireAuth(redirectPage: Page = "auth"): boolean {
  if (!state.user) {
    navigate(redirectPage);
    return false;
  }
  return true;
}
