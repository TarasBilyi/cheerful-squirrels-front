<h1 align="center">Harmoniq</h1>

<p align="center">
  <strong>Find your harmony in community.</strong>
</p>

<p align="center">
  Платформа для читання та публікації статей, побудована на Next.js — з авторами, підписками та особистим профілем.
</p>

<p align="center">
  <a href="#-quick-start"><strong>Швидкий старт</strong></a> ·
  <a href="#-features"><strong>Функціонал</strong></a> ·
  <a href="#-project-structure"><strong>Структура</strong></a> ·
  <a href="#-deployment"><strong>Деплой</strong></a>
</p>

---

## ✨ Чому Harmoniq

Більшість блог-платформ або:

* перевантажені зайвим функціоналом,
* не мають нормальної роботи з авторами й підписками,
* погано працюють з кешуванням серверних даних.

**Harmoniq вирішує це.**

Поєднує:

* ⚡ App Router Next.js 16 + React Compiler
* 🔄 TanStack Query для кешування та синхронізації даних
* 🧘 Чисті приватні маршрути профілю (паралельні роути)
* 🌗 Світлу/темну тему без "блимання" при завантаженні

---

## ⚡ Quick Start

```bash
npm install
npm run dev
```

Відкрити → [http://localhost:3000](http://localhost:3000)

---

## 🧱 Requirements

* Node.js 18+
* npm

---

## 🚀 Features

### Автентифікація

* Реєстрація, вхід, вихід
* Оновлення сесії через `/auth/refresh`
* Приватні та гостьові маршрути (`RequireAuth`, `RequireGuest`)

### Статті

* Стрічка статей із пагінацією
* Популярні та рекомендовані статті
* Створення, редагування, видалення власних статей
* Завантаження фото до статті

### Автори та спільнота

* Сторінки авторів зі списком їхніх статей
* Підписка / відписка від авторів
* Список підписок у профілі

### Особистий кабінет

* Мої статті / збережені статті / підписки (паралельні роути профілю)
* Збереження статей у "закладки"
* Завантаження та зміна аватара

### UX

* Перемикач світлої/темної теми (`localStorage`, без flash of wrong theme)
* Toast-сповіщення, глобальний лоадер, модальні вікна

---

## 🔐 Environment Setup

Створіть файл:

```bash
.env.local
```

### Шаблон

```bash
NEXT_PUBLIC_API_URL=https://your-backend-api-url
```

`NEXT_PUBLIC_API_URL` — базова адреса бекенд-API, до якої звертається клієнт (`lib/api/api.ts`, `withCredentials: true`).

---

## 🗂 Project Structure

```
app/                     маршрути Next.js App Router
  (auth rotes)/          логін, реєстрація, фото
  (private routes)/      приватні сторінки профілю (@myArticles, @savedArticles, @subscriptions)
  articles/               список статей, сторінка статті, створення/редагування
  authors/                список авторів та сторінка автора
components/               UI-компоненти (кожен у власній папці з *.module.css)
hooks/                    кастомні React-хуки
lib/
  api/                    звернення до бекенду (axios)
  store/                  Zustand-стори
  utils/                  допоміжні утиліти
  seo.ts                  SEO-константи
services/                 сервісний шар роботи зі статтями
types/                    спільні TypeScript-типи (Article, Author, User, ApiResponse)
public/                   статичні файли (іконки, зображення)
```

---

## 🖼 Зображення

Для оптимізації `next/image` дозволені такі зовнішні джерела (`next.config.ts`):

* `res.cloudinary.com`
* `ftp.goit.study`

Якщо бекенд повертає зображення з іншого хосту — додайте його до `images.remotePatterns`.

---

## 🚢 Deployment

```bash
npm run build
npm start
```

Проєкт розгорнутий на [Vercel](https://vercel.com). Не забудьте додати `NEXT_PUBLIC_API_URL` у змінні середовища проєкту на хостингу. Детальніше — у [документації Next.js щодо деплою](https://nextjs.org/docs/app/building-your-application/deploying).

---

## 🏗 Tech Stack

| Layer      | Technology                  |
| ---------- | ---------------------------- |
| Framework  | Next.js 16 (App Router)      |
| UI         | React 19, CSS Modules        |
| Data       | TanStack Query, Axios        |
| State      | Zustand                      |
| Forms      | Formik + Yup                 |
| Feedback   | React Hot Toast              |
| Language   | TypeScript                   |

---

## 📦 Scripts

```bash
npm run dev      # старт дев-сервера
npm run build    # продакшн-збірка
npm run start    # запуск продакшн-збірки
npm run lint     # ESLint
```

---

## 🧭 Philosophy

Harmoniq побудований навколо простої ідеї:

> Читання та публікація статей мають бути легкими.

Нічого зайвого. Просто спільнота й контент.

---

## 🤝 Contributing

PR вітаються. Для суттєвих змін спочатку відкрийте issue.
