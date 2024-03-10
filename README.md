# L_Shop

Интернет-магазин на Express + TypeScript (бэк) и Vanilla TS + Vite (фронт).

## Запуск

### Сервер
```bash
cd server
npm install
npm run dev
```

### Клиент
```bash
cd client
npm install
npm run dev
```

Сервер: http://localhost:3001  
Клиент: http://localhost:5173

## API

| Метод | Путь | Описание |
|-------|------|----------|
| POST | /api/auth/register | Регистрация |
| POST | /api/auth/login | Вход |
| POST | /api/auth/logout | Выход |
| GET | /api/auth/me | Текущий пользователь |
| GET | /api/products | Список товаров (search, sortBy, category, available) |
| GET | /api/products/categories | Категории |
| GET | /api/cart | Корзина |
| POST | /api/cart | Добавить в корзину |
| PATCH | /api/cart/:productId | Изменить количество |
| DELETE | /api/cart/:productId | Удалить из корзины |
| GET | /api/delivery | Доставки |
| POST | /api/delivery | Оформить доставку |
| GET | /api/favorites | Избранное |
| POST | /api/favorites/:productId | Добавить/убрать из избранного |
