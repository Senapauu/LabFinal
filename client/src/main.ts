import { state, setState, subscribe } from "./state";
import { initRouter, navigate } from "./router";
import { api } from "./api";
import { renderHeader } from "./components/Header";
import { renderHomePage } from "./pages/HomePage";
import { renderAuthPage } from "./pages/AuthPage";
import { renderCartPage } from "./pages/CartPage";
import { renderDeliveryPage } from "./pages/DeliveryPage";

const app = document.getElementById("app") as HTMLElement;

async function render(): Promise<void> {
  app.innerHTML = "";

  const header = renderHeader();
  app.append(header);

  const main = document.createElement("main");
  main.className = "main";

  switch (state.currentPage) {
    case "home":
      main.append(await renderHomePage());
      break;
    case "auth":
      if (state.user) { navigate("home"); return; }
      main.append(renderAuthPage());
      break;
    case "cart":
      if (!state.user) { navigate("auth"); return; }
      main.append(await renderCartPage());
      break;
    case "delivery":
      if (!state.user) { navigate("auth"); return; }
      main.append(await renderDeliveryPage());
      break;
  }

  app.append(main);
}

async function init(): Promise<void> {
  initRouter();
  subscribe(() => { render(); });

  // Try to restore session
  try {
    const res = await api.auth.me();
    const [cartRes, favRes, delRes] = await Promise.all([
      api.cart.get(),
      api.favorites.get(),
      api.delivery.get(),
    ]);
    setState({
      user: res.user,
      cart: cartRes.cart,
      favorites: favRes.favorites,
      deliveries: delRes.deliveries,
    });
  } catch {
    // Not logged in, that's fine
    await render();
  }
}

init();
