import { state, setState } from "../state";
import { api } from "../api";
import { renderProductCard } from "../components/ProductCard";

export async function renderHomePage(): Promise<HTMLElement> {
  const page = document.createElement("div");
  page.className = "page home-page";

  // Filters
  const filters = document.createElement("aside");
  filters.className = "filters";

  const searchInput = document.createElement("input");
  searchInput.type = "text";
  searchInput.placeholder = "Поиск товаров...";
  searchInput.className = "input";
  searchInput.value = "";

  const sortSelect = document.createElement("select");
  sortSelect.className = "select";
  [
    { value: "", label: "Сортировка" },
    { value: "price_asc", label: "Цена: по возрастанию" },
    { value: "price_desc", label: "Цена: по убыванию" },
  ].forEach(({ value, label }) => {
    const opt = document.createElement("option");
    opt.value = value;
    opt.textContent = label;
    sortSelect.append(opt);
  });

  const categorySelect = document.createElement("select");
  categorySelect.className = "select";
  const defaultOpt = document.createElement("option");
  defaultOpt.value = "";
  defaultOpt.textContent = "Все категории";
  categorySelect.append(defaultOpt);

  const { categories } = await api.products.getCategories();
  categories.forEach((cat) => {
    const opt = document.createElement("option");
    opt.value = cat;
    opt.textContent = cat;
    categorySelect.append(opt);
  });

  const availableCheck = document.createElement("label");
  availableCheck.className = "checkbox-label";
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  availableCheck.append(checkbox, " Только в наличии");

  filters.append(searchInput, sortSelect, categorySelect, availableCheck);

  // Products grid
  const grid = document.createElement("div");
  grid.className = "products-grid";

  async function loadProducts(): Promise<void> {
    const params: Record<string, string> = {};
    if (searchInput.value) params.search = searchInput.value;
    if (sortSelect.value) params.sortBy = sortSelect.value;
    if (categorySelect.value) params.category = categorySelect.value;
    if (checkbox.checked) params.available = "true";

    const { products } = await api.products.getAll(params);
    setState({ products });

    grid.innerHTML = "";
    if (products.length === 0) {
      grid.innerHTML = '<p class="empty">Товары не найдены</p>';
      return;
    }
    products.forEach((p) => grid.append(renderProductCard(p)));
  }

  let debounceTimer: ReturnType<typeof setTimeout>;
  searchInput.addEventListener("input", () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(loadProducts, 300);
  });
  sortSelect.addEventListener("change", loadProducts);
  categorySelect.addEventListener("change", loadProducts);
  checkbox.addEventListener("change", loadProducts);

  await loadProducts();

  const content = document.createElement("div");
  content.className = "home-content";
  content.append(filters, grid);
  page.append(content);
  return page;
}
