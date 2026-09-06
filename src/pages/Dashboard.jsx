/**
 * Dashboard.jsx — Home page (Route: /)
 * 
 * Features:
 * - Balance summary cards (Total Income, Total Expenses, Net Balance)
 * - Filter transactions by category (dropdown) and type (Income/Expense/All)
 * - Transaction list with beautiful cards
 * - Each transaction card links to /transaction/:id
 * - Empty state with illustration when no transactions exist
 * - Staggered entry animations
 * 
 * Performance: Uses useMemo for filtered transactions and balance calculations
 * to avoid recomputing on every render.
 */
import { useState, useMemo, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { useTransactionContext } from '../context/TransactionContext'
import './Dashboard.css'

/** Predefined categories used across the app */
const CATEGORIES = [
  'All', 'Food', 'Transport', 'Entertainment', 'Bills',
  'Shopping', 'Health', 'Education', 'Salary', 'Freelance', 'Other'
]

/** Category emoji icons for visual flair */
const CATEGORY_ICONS = {
  Food: '🍔',
  Transport: '🚗',
  Entertainment: '🎮',
  Bills: '📄',
  Shopping: '🛍️',
  Health: '💊',
  Education: '📚',
  Salary: '💼',
  Freelance: '💻',
  Other: '📦',
}

/**
 * Format a number as currency (PHP/USD).
 */
function formatCurrency(amount) {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    minimumFractionDigits: 2,
  }).format(amount)
}

/**
 * Format a date string to a readable format.
 */
function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function Dashboard() {
  const { transactions } = useTransactionContext()
  const [filterType, setFilterType] = useState('All')
  const [filterCategory, setFilterCategory] = useState('All')

  /**
   * PERFORMANCE OPTIMIZATION: useMemo
   * Filtered transactions are recalculated ONLY when
   * transactions, filterType, or filterCategory change —
   * not on every render.
   */
  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      const matchesType = filterType === 'All' || t.type === filterType.toLowerCase()
      const matchesCategory = filterCategory === 'All' || t.category === filterCategory
      return matchesType && matchesCategory
    })
  }, [transactions, filterType, filterCategory])

  /**
   * PERFORMANCE OPTIMIZATION: useMemo
   * Balance totals are computed from the full transaction list,
   * memoized to avoid re-summing on every render.
   */
  const { totalIncome, totalExpense, netBalance } = useMemo(() => {
    const income = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0)
    const expense = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0)
    return {
      totalIncome: income,
      totalExpense: expense,
      netBalance: income - expense,
    }
  }, [transactions])

  // useCallback to prevent re-creating handlers on each render
  const handleTypeChange = useCallback((e) => setFilterType(e.target.value), [])
  const handleCategoryChange = useCallback((e) => setFilterCategory(e.target.value), [])

  return (
    <div className="dashboard animate-fadeInUp">
      {/* Page Header */}
      <div className="dashboard-header">
        <div>
          <h1 className="heading-xl">Dashboard</h1>
          <p className="text-body">Overview of your financial activity</p>
        </div>
        <Link to="/add" className="btn btn-primary btn-lg" id="add-transaction-btn">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"/>
            <line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Add Transaction
        </Link>
      </div>

      {/* Balance Summary Cards */}
      <div className="balance-cards">
        <div className="balance-card balance-card--net animate-fadeInUp" id="net-balance-card">
          <div className="balance-card__label">Net Balance</div>
          <div className={`balance-card__amount ${netBalance >= 0 ? 'positive' : 'negative'}`}>
            {formatCurrency(netBalance)}
          </div>
          <div className="balance-card__subtitle">
            {netBalance >= 0 ? '📈 Looking good!' : '📉 Spending more than earning'}
          </div>
        </div>

        <div className="balance-card balance-card--income animate-fadeInUp" style={{ animationDelay: '100ms' }} id="income-card">
          <div className="balance-card__icon">📥</div>
          <div className="balance-card__label">Total Income</div>
          <div className="balance-card__amount income">{formatCurrency(totalIncome)}</div>
        </div>

        <div className="balance-card balance-card--expense animate-fadeInUp" style={{ animationDelay: '200ms' }} id="expense-card">
          <div className="balance-card__icon">📤</div>
          <div className="balance-card__label">Total Expenses</div>
          <div className="balance-card__amount expense">{formatCurrency(totalExpense)}</div>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-bar" id="filters-bar">
        <div className="filters-left">
          <h2 className="heading-md">Transactions</h2>
          <span className="text-small">({filteredTransactions.length} results)</span>
        </div>
        <div className="filters-right">
          <select
            className="form-select filter-select"
            value={filterType}
            onChange={handleTypeChange}
            id="filter-type"
          >
            <option value="All">All Types</option>
            <option value="Income">Income</option>
            <option value="Expense">Expense</option>
          </select>

          <select
            className="form-select filter-select"
            value={filterCategory}
            onChange={handleCategoryChange}
            id="filter-category"
          >
            {CATEGORIES.map(cat => (
              <option key={cat} value={cat}>
                {cat === 'All' ? 'All Categories' : `${CATEGORY_ICONS[cat] || ''} ${cat}`}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Transaction List */}
      {filteredTransactions.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">
            {transactions.length === 0 ? '💸' : '🔍'}
          </div>
          <h2 className="empty-state-title">
            {transactions.length === 0 ? 'No transactions yet' : 'No matching transactions'}
          </h2>
          <p className="empty-state-text">
            {transactions.length === 0
              ? 'Start tracking your finances by adding your first transaction!'
              : 'Try adjusting your filters to see more results.'}
          </p>
          {transactions.length === 0 && (
            <Link to="/add" className="btn btn-primary btn-lg">
              ➕ Add Your First Transaction
            </Link>
          )}
        </div>
      ) : (
        <div className="transaction-list stagger-children" id="transaction-list">
          {filteredTransactions.map((transaction) => (
            <Link
              to={`/transaction/${transaction.id}`}
              key={transaction.id}
              className="transaction-card animate-fadeInUp"
              id={`transaction-${transaction.id}`}
            >
              <div className="transaction-card__icon" data-category={transaction.category.toLowerCase()}>
                {CATEGORY_ICONS[transaction.category] || '📦'}
              </div>
              <div className="transaction-card__info">
                <div className="transaction-card__title">{transaction.title}</div>
                <div className="transaction-card__meta">
                  <span className={`badge badge-${transaction.type}`}>
                    {transaction.type === 'income' ? '↗' : '↙'} {transaction.type}
                  </span>
                  <span className="transaction-card__category">{transaction.category}</span>
                  <span className="transaction-card__date">{formatDate(transaction.date)}</span>
                </div>
              </div>
              <div className={`transaction-card__amount ${transaction.type}`}>
                {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
              </div>
              <div className="transaction-card__arrow">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6"/>
                </svg>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

export default Dashboard
