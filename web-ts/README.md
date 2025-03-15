# Календар задач

![GitHub](https://img.shields.io/github/license/XaMcTeRzz/workcalendar2025)
![React](https://img.shields.io/badge/React-18.2.0-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.2.2-blue)
![Vite](https://img.shields.io/badge/Vite-4.4.9-blueviolet)

Веб-додаток "Календар задач" з підтримкою Telegram для створення, керування задачами та отримання сповіщень. Розроблений на React з використанням TypeScript і Vite.

## 🚀 Особливості

- ✅ Управління задачами (створення, редагування, видалення)
- ✅ Пріоритезація задач (високий, середній, низький)
- ✅ Перегляд поточних задач
- ✅ Налаштування Telegram-бота для отримання сповіщень
- ✅ Адаптивний дизайн для мобільних пристроїв

## 🛠️ Технології

- **Frontend**: React 18, TypeScript, React Router
- **Стилі**: Чистий CSS (без зовнішніх бібліотек)
- **HTTP-запити**: Axios
- **Збірка**: Vite

## 📖 Початок роботи

### Передумови

- Node.js 16.0 або новіше
- npm або yarn

### Встановлення

1. Клонуйте репозиторій
   ```
   git clone https://github.com/XaMcTeRzz/workcalendar2025.git
   cd workcalendar2025/web-ts
   ```

2. Встановіть залежності
   ```
   npm install
   ```

3. Запустіть проект в режимі розробки
   ```
   npm run dev
   ```

Додаток буде доступний за адресою [http://localhost:3000](http://localhost:3000).

### Збірка для продакшену

```
npm run build
```

Збірка буде створена в директорії `dist`.

## 📁 Структура проекту

```
web-ts/
├── public/               # Статичні файли
├── src/
│   ├── components/       # React компоненти
│   │   ├── Navbar.tsx    # Компонент навігації
│   │   ├── TaskForm.tsx  # Форма для задач
│   │   └── ...
│   ├── pages/            # Сторінки додатку
│   │   ├── HomePage.tsx  # Головна сторінка
│   │   └── ...
│   ├── services/         # Сервіси
│   │   └── api.ts        # Функції для роботи з API
│   ├── styles/           # CSS стилі
│   ├── types/            # TypeScript типи
│   ├── App.tsx           # Головний компонент
│   └── main.tsx          # Вхідна точка додатку
├── .env.development      # Змінні середовища для розробки
├── .env.production       # Змінні середовища для продакшену
├── index.html            # Головний HTML файл
├── package.json          # Залежності та скрипти
├── tsconfig.json         # Налаштування TypeScript
└── vite.config.ts        # Налаштування Vite
```

## 🌐 API сервер

Для повноцінної роботи додатку потрібен запущений API сервер. За замовчуванням додаток намагається підключитися до `http://localhost:5000/api`.

Ви можете змінити URL API в файлі `.env.development` для розробки або в `.env.production` для продакшену.

## 🚀 Деплой

### Автоматический деплой

Проект настроен для автоматического деплоя на Vercel при каждом пуше в ветки `master` или `main`. 

Подробные инструкции по настройке автоматического деплоя можно найти в файле [DEPLOYMENT.md](./DEPLOYMENT.md).

### Ручной деплой на Vercel

1. Создайте аккаунт на [Vercel](https://vercel.com)
2. Установите Vercel CLI: `npm i -g vercel`
3. Выполните команду `vercel` в корневой директории проекта
4. Следуйте инструкциям CLI для настройки проекта

**Обязательно** добавьте переменную окружения `VITE_APP_API_URL` с URL вашего API.

## 🔗 Посилання

- [Демо додатку](https://workcalendar2025.vercel.app)
- [API документація](https://github.com/XaMcTeRzz/workcalendar2025)

## 📄 Ліцензія

[MIT](LICENSE) 