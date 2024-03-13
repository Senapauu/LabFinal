import { state, setState } from "../state";
import { navigate } from "../router";
import { api } from "../api";

export function renderHeader(): HTMLElement {
  const header = document.createElement("header");
  header.className = "header";

  const logo = document.createElement("div");
  logo.className = "logo";
  logo.textContent = "L_Shop";
  logo.addEventListener("click", () => navigate("home"));

  const nav = document.createElement("nav");
  nav.className = "nav";

  if (state.user) {
    const cartBtn = document.createElement("button");
    cartBtn.className = "btn btn-outline";
    const cartCount = state.cart.reduce((s, i) => s + i.quantity, 0);
    cartBtn.innerHTML = `🛒 Корзина${cartCount > 0 ? ` <span class="badge">${cartCount}</span>` : ""}`;
    cartBtn.addEventListener("click", () => navigate("cart"));

    const deliveryBtn = document.createElement("button");
    deliveryBtn.className = "btn btn-outline";
    deliveryBtn.textContent = "📦 Доставки";
    deliveryBtn.addEventListener("click", () => navigate("delivery"));

    const userSpan = document.createElement("span");
    userSpan.className = "user-name";
    userSpan.textContent = state.user.name;

    const logoutBtn = document.createElement("button");
    logoutBtn.className = "btn btn-ghost";
    logoutBtn.textContent = "Выйти";
    logoutBtn.addEventListener("click", async () => {
      await api.auth.logout();
      setState({ user: null, cart: [], favorites: [], deliveries: [] });
      navigate("home");
    });

    nav.append(cartBtn, deliveryBtn, userSpan, logoutBtn);
  } else {
    const loginBtn = document.createElement("button");
    loginBtn.className = "btn btn-primary";
    loginBtn.textContent = "Войти / Регистрация";
    loginBtn.addEventListener("click", () => navigate("auth"));
    nav.append(loginBtn);
  }

  header.append(logo, nav);
  return header;
}
