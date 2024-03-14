import { state, setState } from "../state";
import { api } from "../api";
import { navigate } from "../router";

export async function renderDeliveryPage(): Promise<HTMLElement> {
  const page = document.createElement("div");
  page.className = "page delivery-page";

  const title = document.createElement("h2");
  title.textContent = "Доставка";

  // Delivery form
  const form = document.createElement("form");
  form.setAttribute("data-delivery", "");
  form.className = "delivery-form";

  const formTitle = document.createElement("h3");
  formTitle.textContent = "Оформить доставку";

  const cityInput = createInput("text", "Город");
  const addressInput = createInput("text", "Адрес");
  const phoneInput = createInput("tel", "Телефон");

  const errorMsg = document.createElement("p");
  errorMsg.className = "error-msg";

  const submitBtn = document.createElement("button");
  submitBtn.type = "submit";
  submitBtn.className = "btn btn-primary";
  submitBtn.textContent = "Оформить";
  submitBtn.disabled = state.cart.length === 0;

  if (state.cart.length === 0) {
    const emptyNote = document.createElement("p");
    emptyNote.className = "empty";
    emptyNote.textContent = "Корзина пуста. Добавьте товары перед оформлением.";
    form.append(formTitle, emptyNote);
  } else {
    form.append(formTitle, cityInput, addressInput, phoneInput, errorMsg, submitBtn);
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    errorMsg.textContent = "";
    try {
      const res = await api.delivery.create({
        city: (cityInput as HTMLInputElement).value,
        address: (addressInput as HTMLInputElement).value,
        phone: (phoneInput as HTMLInputElement).value,
      });
      setState({ cart: [], deliveries: [...state.deliveries, res.delivery] });
      await renderHistory();
      navigate("home");
    } catch (err) {
      errorMsg.textContent = (err as Error).message;
    }
  });

  // Delivery history
  const historySection = document.createElement("div");
  historySection.className = "delivery-history";

  async function renderHistory(): Promise<void> {
    historySection.innerHTML = "";
    const histTitle = document.createElement("h3");
    histTitle.textContent = "История доставок";
    historySection.append(histTitle);

    const { deliveries } = await api.delivery.get();
    setState({ deliveries });

    if (deliveries.length === 0) {
      const empty = document.createElement("p");
      empty.className = "empty";
      empty.textContent = "Доставок пока нет";
      historySection.append(empty);
      return;
    }

    deliveries.forEach((d) => {
      const card = document.createElement("div");
      card.className = "delivery-card";
      card.innerHTML = `
        <div><strong>${d.city}, ${d.address}</strong></div>
        <div>Телефон: ${d.phone}</div>
        <div>Статус: <span class="status-${d.status}">${statusLabel(d.status)}</span></div>
        <div>Товаров: ${d.items.reduce((s, i) => s + i.quantity, 0)} шт.</div>
        <div class="delivery-date">${new Date(d.createdAt).toLocaleDateString("ru-RU")}</div>
      `;
      historySection.append(card);
    });
  }

  await renderHistory();
  page.append(title, form, historySection);
  return page;
}

function createInput(type: string, placeholder: string): HTMLInputElement {
  const input = document.createElement("input");
  input.type = type;
  input.placeholder = placeholder;
  input.className = "input";
  input.required = true;
  return input;
}

function statusLabel(status: string): string {
  const map: Record<string, string> = {
    pending: "Ожидает",
    shipped: "В пути",
    delivered: "Доставлено",
  };
  return map[status] ?? status;
}
