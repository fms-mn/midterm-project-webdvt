# 💰 BroTrack — Personal Budget Tracker

A multi-page Personal Budget Tracker built with **React + Vite**. Log income and expense transactions, categorize them, view spending summaries with visual charts, and switch between light and dark themes — all with a premium, animated UI.

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)
![React Router](https://img.shields.io/badge/React_Router-7-CA4245?logo=reactrouter&logoColor=white)

## 🌐 Live Demo

- **Vercel**: [Your Vercel URL here]
- **GitHub**: [Your GitHub Repo URL here]

---

## 🚀 Tech Stack

| Technology | Purpose |
|-----------|---------|
| **React 19** | UI library with hooks & Context API |
| **Vite 8** | Lightning-fast build tool & dev server |
| **React Router v7** | Client-side routing with 4 real routes |
| **Vanilla CSS** | Custom design system with CSS custom properties |
| **localStorage** | Persistent data storage via custom hook |

---

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

### Build for Production

```bash
npm run build
```

Output goes to the `dist/` folder, ready for deployment on Vercel.

---

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Layout.jsx       # Shared layout with Navbar + Outlet
│   ├── Navbar.jsx       # Navigation bar with active links & theme toggle
│   └── Navbar.css       # Navbar styling
├── context/             # React Context providers
│   ├── ThemeContext.jsx  # Light/dark theme management (Context API)
│   └── TransactionContext.jsx  # App-wide transaction state
├── hooks/               # Custom hooks
│   └── useTransactions.js      # Reusable localStorage persistence hook
├── pages/               # Page components (one per route)
│   ├── Dashboard.jsx    # Home — transaction list + balance + filters
│   ├── Dashboard.css
│   ├── AddTransaction.jsx  # Form to add new transactions
│   ├── AddTransaction.css
│   ├── TransactionDetail.jsx  # View/edit/delete individual transaction
│   ├── TransactionDetail.css
│   ├── Summary.jsx      # Spending analytics + category breakdown
│   └── Summary.css
├── styles/
│   └── index.css        # Global design system (theme tokens, utilities)
├── App.jsx              # Root component with routing
└── main.jsx             # Entry point
```

---

## ✨ Features

### 📊 Dashboard (Home Page — `/`)
- View all transactions in a beautiful card list
- **Balance summary cards**: Total Income, Total Expenses, Net Balance
- **Filter** by category (dropdown) and type (Income/Expense/All)
- Each transaction card **links to its detail page**
- Empty state with call-to-action when no transactions exist
- Staggered entry animations

### ➕ Add Transaction (`/add`)
- Multi-field form: title, amount, type, category, date, notes
- **Client-side validation** with inline error messages
- Income/Expense **type selector buttons** with visual feedback
- **Category icon pills** for quick selection
- Auto-navigates to Dashboard on successful submission

### 🔍 Transaction Detail (`/transaction/:id`)
- Full transaction details in a premium card
- **Edit mode** with inline form editing
- **Delete** with animated confirmation modal
- Back navigation to Dashboard
- 404 handling for invalid transaction IDs

### 📈 Summary (`/summary`)
- **Spending by category** with animated percentage bars
- **Income vs Expense** comparison chart
- **Stats overview**: total transactions, income/expense counts, net balance
- **Income by source** breakdown
- Theme toggle button

### 🌗 Theme System
- Light and dark themes with smooth transitions
- Theme persists across page reloads (localStorage)
- Toggle accessible from Navbar (all pages) and Summary page
- Applied via CSS custom properties — no prop drilling

---

## 🧠 Required React Concepts

### 1. React Router
All four pages use **real routes with distinct URLs** via `BrowserRouter`:
- `/` → Dashboard
- `/add` → Add Transaction
- `/transaction/:id` → Transaction Detail (dynamic route)
- `/summary` → Summary

**Implementation**: [`App.jsx`](src/App.jsx) — Uses `<Routes>` with nested `<Route>` inside a shared `<Layout>`.

### 2. Context API
Theme is managed via **Context**, not passed down through props:
- `ThemeContext` provides `{ theme, toggleTheme }` to any component
- Theme choice applies across the **entire app**, not just one page
- **No prop drilling** — any component calls `useTheme()` directly

**Implementation**: [`ThemeContext.jsx`](src/context/ThemeContext.jsx)

### 3. Custom Hook
`useTransactions` is a **reusable custom hook** for localStorage persistence:
- Handles reading/writing transactions to `localStorage`
- Provides CRUD operations: `addTransaction`, `updateTransaction`, `deleteTransaction`, `getTransaction`
- Manages serialization/deserialization with error fallbacks
- Used by `TransactionContext` — **not copy-pasted** into individual components

**Implementation**: [`useTransactions.js`](src/hooks/useTransactions.js)

### 4. Performance Optimization
Multiple optimizations to prevent unnecessary re-renders:

1. **`React.memo`** on `CategoryBar` component ([`Summary.jsx`](src/pages/Summary.jsx)):
   - Without memo: every category bar re-renders on theme toggle
   - With memo: only bars whose props changed re-render
   - **Documented in code comments** explaining the why

2. **`useMemo`** for computed data:
   - Filtered transactions list (Dashboard)
   - Balance calculations (Dashboard)
   - Analytics data: category totals, percentages, sorted arrays (Summary)

3. **`useCallback`** for event handlers:
   - Filter change handlers (Dashboard)
   - Form field handlers (AddTransaction, TransactionDetail)
   - Theme toggle handler (Summary)

---

## 🎨 Design System

The app uses a comprehensive CSS design system (`src/styles/index.css`) featuring:

- **CSS Custom Properties** for all colors, spacing, typography, and shadows
- **Light & Dark theme tokens** with smooth transitions
- **Google Fonts**: Inter (body) + Outfit (display headings)
- **Glassmorphism** navbar with backdrop blur
- **Micro-animations**: fadeInUp, scaleIn, shimmer, float, staggered children
- **Responsive design** with mobile-first breakpoints
- **Component utilities**: cards, buttons, badges, inputs, modals, toasts

---

## 🏗️ Development History (Git Commits)

| Stage | Commit Message | What Changed |
|-------|---------------|--------------|
| 1 | `feat: scaffold React app with Vite and design system` | Project setup, CSS design system, folder structure |
| 2 | `feat: add ThemeContext and TransactionContext with custom hook` | Context API, useTransactions hook, localStorage |
| 3 | `feat: configure React Router with 4 pages and Navbar` | BrowserRouter, Navbar, Layout, page shells |
| 4 | `feat: implement Dashboard with filtering and balance display` | Balance cards, transaction list, filters |
| 5 | `feat: implement Add Transaction form with validation` | Form, validation, category pills |
| 6 | `feat: implement Transaction Detail with edit and delete` | View/edit/delete, confirmation modal |
| 7 | `feat: implement Summary page with charts and performance optimization` | Analytics, category bars, React.memo |
| 8 | `docs: final README, code comments, and polish` | Documentation, final polish |

---

## 📝 License

MIT
