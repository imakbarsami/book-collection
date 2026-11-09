# 📚 Muhammad Sami's Book Collection

A personal digital library to organize, explore, and keep track of my book collection.

**Muhammad Sami's Book Collection** is a simple and responsive web application built to maintain a digital record of my personal book collection. It provides an organized way to browse books, explore collection statistics, search for titles, and sort or filter books.

## ✨ Features

- **Collection Overview** – View total books, total collection price, and total pages.
- **Book Collection** – Browse books with their covers, names, categories, authors, prices, and page counts.
- **Live Search** – Search books by name, category, or author with debounced input.
- **Price Filtering** – Filter books using minimum and maximum price ranges.
- **Sorting** – Sort books by price and page count in ascending or descending order.
- **Pagination** – Navigate through the collection with responsive pagination.
- **Responsive Design** – Optimized for desktop, tablet, and mobile devices.

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| HTML5 | Application structure |
| TypeScript | Application logic and type safety |
| Tailwind CSS v4 | Styling and responsive design |
| Vite | Development server and build tool |
| Lucide | Interface icons |

## 📂 Project Structure

```text
book-collection/
├── public/
│   └── favicon.svg
│
├── src/
│   ├── data/
│   │   └── books.ts
│   │
│   ├── scripts/
│   │   ├── main.ts
│   │   ├── renderBooks.ts
│   │   ├── filters.ts
│   │   ├── pagination.ts
│   │   └── utils.ts
│   │
│   ├── styles/
│   │   └── style.css
│   │
│   └── types/
│       └── book.ts
│
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── .gitignore
```

## 📖 Book Data Structure

Books are maintained in a TypeScript dataset.

Each book follows this structure:

```typescript
interface Book {
    id: number;
    name: string;
    category: string;
    author: string;
    price: number;
    page: number;
    image: string;
}
```

## 🎯 Project Purpose

This project was built for personal use to maintain a digital record of my book collection.

It is also an opportunity to practice TypeScript, frontend development, responsive UI design, and data handling without relying on a frontend framework.
