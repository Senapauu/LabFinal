import { Product } from "../types";
import { state } from "../state";
import { api } from "../api";
import { setState } from "../state";
import { navigate } from "../router";

export function renderProductCard(product: Product): HTMLElement {
  const card = document.createElement("div");
  card.className = `product-card${!product.available ? " unavailable" : ""}`;

  const img = document.createElement("img");
  img.src = product.imageUrl;
  img.alt = product.name;
  img.className = "product-img";

  const body = document.createElement("div");
  body.className = "product-body";

  const name = document.createElement("h3");
  name.className = "product-name";
  name.setAttribute("data-title", "");
  name.textContent = product.name;

  const desc = document.createElement("p");
  desc.className = "product-desc";
  desc.textContent = product.description;

  const price = document.createElement("span");
  price.className = "product-price";
  price.setAttribute("data-price", "");
  price.textContent = `$${product.price}`;

  const category = document.createElement("span");
  category.className = "product-category";
  category.textContent = product.category;

  const status = document.createElement("span");
  status.className = `product-status ${product.available ? "in-stock" : "out-of-stock"}`;
  status.textContent = product.available ? "В наличии" : "Нет в наличии";

  const actions = document.createElement("div");
  actions.className = "product-actions";

  // Favorite button
  const favBtn = document.createElement("button");
  favBtn.className = "btn-icon";
  const isFav = state.favorites.includes(product.id);
  favBtn.textContent = isFav ? "❤️" : "🤍";
  favBtn.title = "В избранное";
  favBtn.addEventListener("click", async () => {
    if (!state.user) { navigate("auth"); return; }
    const res = await api.favorites.toggle(product.id);
    setState({ favorites: res.favorites });
  });

  // Quantity + Add to cart
  const qtyWrapper = document.createElement("div");
  qtyWrapper.className = "qty-wrapper";

  const qtyInput = document.createElement("input");
  qtyInput.type = "number";
  qtyInput.min = "1";
  qtyInput.value = "1";
  qtyInput.className = "qty-input";

  const addBtn = document.createElement("button");
  addBtn.className = "btn btn-primary";
  addBtn.textContent = "В корзину";
  addBtn.disabled = !product.available;
  addBtn.addEventListener("click", async () => {
    if (!state.user) { navigate("auth"); return; }
    const qty = parseInt(qtyInput.value, 10) || 1;
    const res = await api.cart.add(product.id, qty);
    setState({ cart: res.cart });
  });

  qtyWrapper.append(qtyInput, addBtn);
  actions.append(favBtn, qtyWrapper);
  body.append(name, desc, price, category, status, actions);
  card.append(img, body);
  return card;
}
