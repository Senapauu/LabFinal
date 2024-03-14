import { setState } from "../state";
import { api } from "../api";
import { navigate } from "../router";

export function renderAuthPage(): HTMLElement {
  const page = document.createElement("div");
  page.className = "page auth-page";

  const card = document.createElement("div");
  card.className = "auth-card";

  const tabs = document.createElement("div");
  tabs.className = "tabs";

  const loginTab = document.createElement("button");
  loginTab.className = "tab active";
  loginTab.textContent = "Войти";

  const registerTab = document.createElement("button");
  registerTab.className = "tab";
  registerTab.textContent = "Регистрация";

  tabs.append(loginTab, registerTab);

  // Login form
  const loginForm = document.createElement("form");
  loginForm.setAttribute("data-registration", "login");
  loginForm.className = "auth-form";

  const identifierInput = createInput("text", "Email, логин, телефон или имя");
  const loginPassInput = createInput("password", "Пароль");
  const loginError = document.createElement("p");
  loginError.className = "error-msg";
  const loginBtn = document.createElement("button");
  loginBtn.type = "submit";
  loginBtn.className = "btn btn-primary full-width";
  loginBtn.textContent = "Войти";

  loginForm.append(identifierInput, loginPassInput, loginError, loginBtn);
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    loginError.textContent = "";
    try {
      const res = await api.auth.login({
        identifier: (identifierInput as HTMLInputElement).value,
        password: (loginPassInput as HTMLInputElement).value,
      });
      const cartRes = await api.cart.get();
      const favRes = await api.favorites.get();
      const delRes = await api.delivery.get();
      setState({
        user: res.user,
        cart: cartRes.cart,
        favorites: favRes.favorites,
        deliveries: delRes.deliveries,
      });
      navigate("home");
    } catch (err) {
      loginError.textContent = (err as Error).message;
    }
  });

  // Register form
  const registerForm = document.createElement("form");
  registerForm.setAttribute("data-registration", "register");
  registerForm.className = "auth-form hidden";

  const nameInput = createInput("text", "Имя");
  const emailInput = createInput("email", "Email");
  const loginInput = createInput("text", "Логин");
  const phoneInput = createInput("tel", "Телефон");
  const passInput = createInput("password", "Пароль");
  const regError = document.createElement("p");
  regError.className = "error-msg";
  const regBtn = document.createElement("button");
  regBtn.type = "submit";
  regBtn.className = "btn btn-primary full-width";
  regBtn.textContent = "Зарегистрироваться";

  registerForm.append(nameInput, emailInput, loginInput, phoneInput, passInput, regError, regBtn);
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    regError.textContent = "";
    try {
      const res = await api.auth.register({
        name: (nameInput as HTMLInputElement).value,
        email: (emailInput as HTMLInputElement).value,
        login: (loginInput as HTMLInputElement).value,
        phone: (phoneInput as HTMLInputElement).value,
        password: (passInput as HTMLInputElement).value,
      });
      setState({ user: res.user, cart: [], favorites: [], deliveries: [] });
      navigate("home");
    } catch (err) {
      regError.textContent = (err as Error).message;
    }
  });

  loginTab.addEventListener("click", () => {
    loginTab.classList.add("active");
    registerTab.classList.remove("active");
    loginForm.classList.remove("hidden");
    registerForm.classList.add("hidden");
  });

  registerTab.addEventListener("click", () => {
    registerTab.classList.add("active");
    loginTab.classList.remove("active");
    registerForm.classList.remove("hidden");
    loginForm.classList.add("hidden");
  });

  card.append(tabs, loginForm, registerForm);
  page.append(card);
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
