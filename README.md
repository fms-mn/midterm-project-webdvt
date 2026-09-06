# 💰 BroTrack — Personal Budget Tracker

A multi-page Personal Budget Tracker built with **React + Vite**. Log income and expense transactions, categorize them, view spending summaries, and switch between light and dark themes.

## 🚀 Tech Stack

- **React 19** — UI library
- **Vite** — Build tool & dev server
- **React Router v7** — Client-side routing
- **Vanilla CSS** — Custom design system with CSS custom properties
- **localStorage** — Persistent data storage

## 📦 Getting Started

### Prerequisites
- Node.js 18+ and npm

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/midterm-project-webdvt.git
cd midterm-project-webdvt

# Install dependencies
npm install

# Start the dev server
npm run dev
```

The app will be running at `http://localhost:5173`.

## 📁 Project Structure

```
src/
├── components/     # Reusable UI components
├── context/        # React Context providers (Theme, Transactions)
├── hooks/          # Custom hooks (useTransactions)
├── pages/          # Page components (Dashboard, AddTransaction, etc.)
├── styles/         # CSS design system
├── App.jsx         # Root component with routing
└── main.jsx        # Entry point
```

## ✨ Features

- 📊 **Dashboard** — View all transactions with filtering by category and type
- ➕ **Add Transaction** — Log income or expenses with validation
- 🔍 **Transaction Detail** — View, edit, and delete individual transactions
- 📈 **Summary** — Visual breakdown of spending by category
- 🌗 **Dark/Light Theme** — Toggle themes via Context API (persisted)
- 💾 **Persistent Storage** — All data saved to localStorage via custom hook

## 🧠 React Concepts Used

| Concept | Implementation |
|---------|---------------|
| **React Router** | 4 routes: `/`, `/add`, `/transaction/:id`, `/summary` |
| **Context API** | `ThemeContext` for theme management (no prop drilling) |
| **Custom Hook** | `useTransactions` — reusable localStorage persistence hook |
| **Performance** | `React.memo`, `useMemo`, `useCallback` optimizations |

## 🏗️ Build for Production

```bash
npm run build
```

Output goes to the `dist/` folder, ready for deployment on Vercel.

## 📝 License

MIT
