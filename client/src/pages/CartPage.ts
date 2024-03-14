import { state, setState } from "../state";
import { api } from "../api";
import { navigate } from "../router";

export async function renderCartPage(): Promise<HTMLElement> {
  const page = document.createElement("div");
  page.className = "page cart-page";

  const title = document.createElement("h2");
  title.textContent = "Корзина";

  const container = document.createElement("div");
  container.className = "cart-container";

  async function renderItems(): Promise<void> {
    container.innerHTML = "";

    if (state.cart.length === 0) {
      container.innerHTML = '<p class="empty">Корзина пуста</p>';
      return;
    }

    const productMap = new Map(state.products.map((p) => [p.id, p]));

    let total = 0;

    state.cart.forEach((item) => {
      const product = productMap.get(item.productId);
      if (!product) return;

      const row = document.createElement("div");
      row.className = "cart-item";

      const img = document.createElement("img");
      img.src = product.imageUrl;
      img.alt = product.name;
      img.className = "cart-item-img";

      const info = document.createElement("div");
      info.className = "cart-item-info";

      const name = document.createElement("span");
      name.setAttribute("data-title", "basket");
      name.className = "cart-item-name";
      name.textContent = product.name;

      const price = document.createElement("span");
      price.setAttribute("data-price", "basket");
      price.className = "cart-item-price";
      price.textContent = `$${product.price}`;

      info.append(name, price);

      const controls = document.createElement("div");
      controls.className = "cart-item-controls";

      const decBtn = document.createElement("button");
      decBtn.className = "btn-icon";
      decBtn.textContent = "−";
      decBtn.addEventListener("click", async () => {
        if (item.quantity <= 1) {
          const res = await api.cart.remove(item.productId);
          setState({ cart: res.cart });
        } else {
          const res = await api.cart.update(item.productId, item.quantity - 1);
          setState({ cart: res.cart });
        }
        await renderItems();
      });

      const qtySpan = document.createElement("span");
      qtySpan.className = "cart-qty";
      qtySpan.textContent = String(item.quantity);

      const incBtn = document.createElement("button");
      incBtn.className = "btn-icon";
      incBtn.textContent = "+";
      incBtn.addEventListener("click", async () => {
        const res = await api.cart.update(item.productId, item.quantity + 1);
        setState({ cart: res.cart });
        await renderItems();
      });

      const removeBtn = document.createElement("button");
      removeBtn.className = "btn btn-ghost";
      removeBtn.textContent = "Удалить";
      removeBtn.addEventListener("click", async () => {
        const res = await api.cart.remove(item.productId);
        setState({ cart: res.cart });
        await renderItems();
      });

      controls.append(decBtn, qtySpan, incBtn, removeBtn);
      row.append(img, info, controls);
      container.append(row);

      total += product.price * item.quantity;
    });

    const totalRow = document.createElement("div");
    totalRow.className = "cart-total";
    totalRow.textContent = `Итого: $${total.toFixed(2)}`;

    const checkoutBtn = document.createElement("button");
    checkoutBtn.className = "btn btn-primary";
    checkoutBtn.textContent = "Оформить доставку";
    checkoutBtn.addEventListener("click", () => navigate("delivery"));

    container.append(totalRow, checkoutBtn);
  }

  await renderItems();
  page.append(title, container);
  return page;
}
