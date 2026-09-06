/**
 * App.jsx — Root component for BroTrack
 * 
 * Stage 3: Full React Router setup with 4 distinct routes.
 * 
 * Routes:
 *   /              → Dashboard (Home) — lists all transactions
 *   /add           → AddTransaction — form to log new transactions
 *   /transaction/:id → TransactionDetail — view/edit/delete one transaction
 *   /summary       → Summary — spending breakdown and analytics
 * 
 * All routes use real URLs via BrowserRouter (not hash router).
 * Theme and Transaction contexts wrap the entire router.
 */
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import { TransactionProvider } from './context/TransactionContext'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import AddTransaction from './pages/AddTransaction'
import TransactionDetail from './pages/TransactionDetail'
import Summary from './pages/Summary'

function App() {
  return (
    <ThemeProvider>
      <TransactionProvider>
        <BrowserRouter>
          <Routes>
            {/* Layout wraps all routes with Navbar + container */}
            <Route element={<Layout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/add" element={<AddTransaction />} />
              <Route path="/transaction/:id" element={<TransactionDetail />} />
              <Route path="/summary" element={<Summary />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </TransactionProvider>
    </ThemeProvider>
  )
}

export default App
