import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTransactionContext } from '../context/TransactionContext'
import './Dashboard.css'

const CATEGORIES = ['All', 'Food', 'Transport', 'Entertainment', 'Bills', 'Shopping', 'Health', 'Education', 'Salary', 'Freelance', 'Other']
const CATEGORY_ICONS = { Food: '🍔', Transport: '🚗', Entertainment: '🎮', Bills: '📄', Shopping: '🛍️', Health: '💊', Education: '📚', Salary: '💼', Freelance: '💻', Other: '📦' }
const BUDGET_KEY = 'brotrack-monthly-budget'

function getInitialBudget() {
  try {
    return Number(localStorage.getItem(BUDGET_KEY)) || 30000
  } catch {
    return 30000
  }
}

function formatCurrency(amount, compact = false) {
  return new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP', notation: compact ? 'compact' : 'standard', maximumFractionDigits: compact ? 1 : 2 }).format(amount || 0)
}

function formatDate(dateStr) {
  return new Date(`${dateStr}T00:00:00`).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' })
}

function DashboardIcon({ name }) {
  const icons = {
    plus: <path d="M12 5v14M5 12h14" />,
    search: <><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></>,
    arrowUp: <><path d="m7 11 5-5 5 5"/><path d="M12 18V6"/></>,
    arrowDown: <><path d="m7 13 5 5 5-5"/><path d="M12 6v12"/></>,
    wallet: <><path d="M4 7a3 3 0 0 1 3-3h11a2 2 0 0 1 2 2v14H7a3 3 0 0 1-3-3V7Z"/><path d="M4 8h14a2 2 0 0 1 2 2v3h-5a2 2 0 0 0 0 4h5"/></>,
    target: <><circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3"/><path d="M12 2v3M22 12h-3"/></>,
    chevron: <path d="m9 18 6-6-6-6" />,
  }
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{icons[name]}</svg>
}

function Dashboard() {
  const { transactions } = useTransactionContext()
  const [filterType, setFilterType] = useState('All')
  const [filterCategory, setFilterCategory] = useState('All')
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState('newest')
  const [budget, setBudget] = useState(getInitialBudget)
  const [budgetDraft, setBudgetDraft] = useState(String(budget))
  const [editingBudget, setEditingBudget] = useState(false)

  useEffect(() => {
    try { localStorage.setItem(BUDGET_KEY, String(budget)) } catch { /* Storage can be unavailable in private mode. */ }
  }, [budget])

  const analytics = useMemo(() => {
    const now = new Date()
    const isThisMonth = (t) => {
      const date = new Date(`${t.date}T00:00:00`)
      return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()
    }
    const monthItems = transactions.filter(isThisMonth)
    const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0)
    const totalExpense = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0)
    const monthExpense = monthItems.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0)
    const monthIncome = monthItems.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0)
    const categoryTotals = monthItems.filter(t => t.type === 'expense').reduce((acc, t) => ({ ...acc, [t.category]: (acc[t.category] || 0) + t.amount }), {})
    const topCategory = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0]
    const months = Array.from({ length: 6 }, (_, index) => {
      const date = new Date(now.getFullYear(), now.getMonth() - 5 + index, 1)
      const inMonth = transactions.filter(t => {
        const itemDate = new Date(`${t.date}T00:00:00`)
        return itemDate.getMonth() === date.getMonth() && itemDate.getFullYear() === date.getFullYear()
      })
      return {
        label: date.toLocaleDateString('en-PH', { month: 'short' }),
        income: inMonth.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0),
        expense: inMonth.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0),
      }
    })
    const chartMax = Math.max(...months.flatMap(m => [m.income, m.expense]), 1)
    return { totalIncome, totalExpense, netBalance: totalIncome - totalExpense, monthExpense, monthIncome, topCategory, months, chartMax }
  }, [transactions])

  const filteredTransactions = useMemo(() => {
    const query = search.trim().toLowerCase()
    return transactions
      .filter(t => (filterType === 'All' || t.type === filterType.toLowerCase()) && (filterCategory === 'All' || t.category === filterCategory) && (!query || `${t.title} ${t.category} ${t.notes || ''}`.toLowerCase().includes(query)))
      .sort((a, b) => {
        if (sortBy === 'highest') return b.amount - a.amount
        if (sortBy === 'oldest') return new Date(a.date) - new Date(b.date)
        return new Date(b.date) - new Date(a.date)
      })
  }, [transactions, filterType, filterCategory, search, sortBy])

  const budgetPercent = Math.min((analytics.monthExpense / Math.max(budget, 1)) * 100, 100)
  const remaining = budget - analytics.monthExpense

  const saveBudget = () => {
    const next = Number(budgetDraft)
    if (next > 0) setBudget(next)
    else setBudgetDraft(String(budget))
    setEditingBudget(false)
  }

  return (
    <div className="dashboard animate-fadeInUp">
      <header className="dashboard-header">
        <div>
          <p className="eyebrow">Financial overview</p>
          <h1 className="heading-xl">Good to see you.</h1>
          <p className="text-body">Here’s how your money is moving this month.</p>
        </div>
        <Link to="/add" className="btn btn-primary dashboard-add" id="add-transaction-btn"><DashboardIcon name="plus" />Add transaction</Link>
      </header>

      <section className="balance-overview" aria-label="Account overview">
        <article className="balance-hero">
          <div className="balance-hero__top"><span>Available balance</span><span className="balance-hero__chip">All time</span></div>
          <strong>{formatCurrency(analytics.netBalance)}</strong>
          <div className="balance-hero__footer">
            <span><DashboardIcon name="arrowUp" />{formatCurrency(analytics.totalIncome, true)} income</span>
            <span><DashboardIcon name="arrowDown" />{formatCurrency(analytics.totalExpense, true)} spent</span>
          </div>
        </article>
        <article className="metric-card">
          <span className="metric-card__icon income"><DashboardIcon name="arrowUp" /></span>
          <div><span>This month’s income</span><strong>{formatCurrency(analytics.monthIncome)}</strong></div>
        </article>
        <article className="metric-card">
          <span className="metric-card__icon expense"><DashboardIcon name="arrowDown" /></span>
          <div><span>This month’s spending</span><strong>{formatCurrency(analytics.monthExpense)}</strong></div>
        </article>
      </section>

      <div className="dashboard-grid">
        <div className="dashboard-main-column">
          <section className="cashflow-card card">
            <div className="section-heading">
              <div><p className="eyebrow">Cash flow</p><h2 className="heading-md">Last 6 months</h2></div>
              <div className="chart-legend"><span><i className="income"/>Income</span><span><i className="expense"/>Expenses</span></div>
            </div>
            <div className="cashflow-chart" aria-label="Income and expenses for the last six months">
              {analytics.months.map(month => (
                <div className="chart-month" key={month.label} title={`${month.label}: ${formatCurrency(month.income)} income, ${formatCurrency(month.expense)} expenses`}>
                  <div className="chart-bars"><i className="income" style={{ height: `${Math.max((month.income / analytics.chartMax) * 100, month.income ? 5 : 1)}%` }}/><i className="expense" style={{ height: `${Math.max((month.expense / analytics.chartMax) * 100, month.expense ? 5 : 1)}%` }}/></div>
                  <span>{month.label}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="transactions-panel card">
            <div className="transactions-heading">
              <div><p className="eyebrow">Activity</p><h2 className="heading-md">Transactions <span>{filteredTransactions.length}</span></h2></div>
              <div className="transaction-tools">
                <label className="search-box"><DashboardIcon name="search" /><span className="sr-only">Search transactions</span><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search" /></label>
                <select className="compact-select" value={sortBy} onChange={e => setSortBy(e.target.value)} aria-label="Sort transactions"><option value="newest">Newest</option><option value="oldest">Oldest</option><option value="highest">Highest</option></select>
              </div>
            </div>
            <div className="filter-chips" aria-label="Transaction type">
              {['All', 'Income', 'Expense'].map(type => <button key={type} className={filterType === type ? 'active' : ''} onClick={() => setFilterType(type)}>{type}</button>)}
              <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)} aria-label="Filter by category"><option value="All">All categories</option>{CATEGORIES.slice(1).map(cat => <option key={cat}>{cat}</option>)}</select>
            </div>

            {filteredTransactions.length === 0 ? (
              <div className="dashboard-empty"><span><DashboardIcon name="wallet" /></span><h3>{transactions.length ? 'No matching transactions' : 'Your transaction list is ready'}</h3><p>{transactions.length ? 'Try a different search or filter.' : 'Add your first income or expense to start seeing useful patterns.'}</p>{!transactions.length && <Link to="/add" className="btn btn-primary">Add first transaction</Link>}</div>
            ) : (
              <div className="transaction-list" id="transaction-list">
                {filteredTransactions.map(transaction => (
                  <Link to={`/transaction/${transaction.id}`} key={transaction.id} className="transaction-row">
                    <span className="transaction-row__icon">{CATEGORY_ICONS[transaction.category] || CATEGORY_ICONS.Other}</span>
                    <span className="transaction-row__details"><strong>{transaction.title}</strong><small>{transaction.category} · {formatDate(transaction.date)}</small></span>
                    <span className={`transaction-row__amount ${transaction.type}`}>{transaction.type === 'income' ? '+' : '−'}{formatCurrency(transaction.amount)}</span>
                    <span className="transaction-row__arrow"><DashboardIcon name="chevron" /></span>
                  </Link>
                ))}
              </div>
            )}
          </section>
        </div>

        <aside className="dashboard-side-column">
          <section className="budget-card card">
            <div className="section-heading">
              <div><p className="eyebrow">Monthly budget</p><h2 className="heading-md">Spending plan</h2></div>
              {!editingBudget && <button className="text-button" onClick={() => setEditingBudget(true)}>Edit</button>}
            </div>
            {editingBudget ? <div className="budget-editor"><span>₱</span><input type="number" min="1" value={budgetDraft} onChange={e => setBudgetDraft(e.target.value)} autoFocus/><button onClick={saveBudget}>Save</button></div> : <strong className="budget-total">{formatCurrency(budget)}</strong>}
            <div className="budget-progress"><span style={{ width: `${budgetPercent}%` }} className={remaining < 0 ? 'over' : ''}/></div>
            <div className="budget-numbers"><span><strong>{formatCurrency(analytics.monthExpense)}</strong> spent</span><span className={remaining < 0 ? 'over' : ''}><strong>{formatCurrency(Math.abs(remaining))}</strong> {remaining < 0 ? 'over' : 'left'}</span></div>
          </section>

          <section className="insight-card">
            <span className="insight-card__icon"><DashboardIcon name="target" /></span>
            <p className="eyebrow">Smart insight</p>
            <h2>{analytics.topCategory ? `${analytics.topCategory[0]} leads your spending` : 'Build your first spending pattern'}</h2>
            <p>{analytics.topCategory ? `${formatCurrency(analytics.topCategory[1])} went to ${analytics.topCategory[0].toLowerCase()} this month. Open Insights to see the full breakdown.` : 'Log a few transactions and BroTrack will surface where your money is going.'}</p>
            <Link to="/summary">View insights <DashboardIcon name="chevron" /></Link>
          </section>

          <section className="quick-actions-card card">
            <div><p className="eyebrow">Quick actions</p><h2 className="heading-md">Keep things moving</h2></div>
            <Link to="/add"><span>+</span><div><strong>Log a transaction</strong><small>Income or expense</small></div><DashboardIcon name="chevron" /></Link>
            <Link to="/summary"><span>↗</span><div><strong>Review your spending</strong><small>Trends and categories</small></div><DashboardIcon name="chevron" /></Link>
          </section>
        </aside>
      </div>
    </div>
  )
}

export default Dashboard
