import React, { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTransactionContext } from '../context/TransactionContext'
import './Summary.css'

const CATEGORY_ICONS = { Food: '🍔', Transport: '🚗', Entertainment: '🎮', Bills: '📄', Shopping: '🛍️', Health: '💊', Education: '📚', Salary: '💼', Freelance: '💻', Other: '📦' }
const CATEGORY_COLORS = { Food: '#f59e0b', Transport: '#3b82f6', Entertainment: '#ec4899', Bills: '#ef4444', Shopping: '#8b5cf6', Health: '#10b981', Education: '#06b6d4', Salary: '#22c55e', Freelance: '#f97316', Other: '#6b7280' }

function formatCurrency(amount, compact = false) {
  return new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP', notation: compact ? 'compact' : 'standard', maximumFractionDigits: compact ? 1 : 2 }).format(amount || 0)
}

const CategoryRow = React.memo(function CategoryRow({ item, total, index }) {
  const percentage = total ? (item.amount / total) * 100 : 0
  return (
    <div className="insight-category-row" style={{ '--delay': `${index * 45}ms` }}>
      <span className="insight-category-icon" style={{ background: `${item.color}18` }}>{item.icon}</span>
      <div className="insight-category-info">
        <div><strong>{item.name}</strong><span>{percentage.toFixed(0)}%</span></div>
        <div className="insight-category-track"><span style={{ width: `${percentage}%`, background: item.color }} /></div>
      </div>
      <strong className="insight-category-amount">{formatCurrency(item.amount, true)}</strong>
    </div>
  )
})

function Summary() {
  const { transactions } = useTransactionContext()
  const [range, setRange] = useState('month')

  const analytics = useMemo(() => {
    const now = new Date()
    const filtered = transactions.filter(t => {
      if (range === 'all') return true
      const date = new Date(`${t.date}T00:00:00`)
      if (range === 'month') return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()
      const threshold = new Date(now)
      threshold.setDate(threshold.getDate() - 90)
      return date >= threshold
    })
    const incomeItems = filtered.filter(t => t.type === 'income')
    const expenseItems = filtered.filter(t => t.type === 'expense')
    const totalIncome = incomeItems.reduce((sum, t) => sum + t.amount, 0)
    const totalExpense = expenseItems.reduce((sum, t) => sum + t.amount, 0)
    const expenseByCategory = Object.values(expenseItems.reduce((acc, t) => {
      acc[t.category] ??= { name: t.category, amount: 0, icon: CATEGORY_ICONS[t.category] || CATEGORY_ICONS.Other, color: CATEGORY_COLORS[t.category] || CATEGORY_COLORS.Other }
      acc[t.category].amount += t.amount
      return acc
    }, {})).sort((a, b) => b.amount - a.amount)
    const incomeByCategory = Object.values(incomeItems.reduce((acc, t) => {
      acc[t.category] ??= { name: t.category, amount: 0, icon: CATEGORY_ICONS[t.category] || CATEGORY_ICONS.Other, color: CATEGORY_COLORS[t.category] || CATEGORY_COLORS.Other }
      acc[t.category].amount += t.amount
      return acc
    }, {})).sort((a, b) => b.amount - a.amount)
    const savingRate = totalIncome > 0 ? ((totalIncome - totalExpense) / totalIncome) * 100 : 0
    return { filtered, totalIncome, totalExpense, balance: totalIncome - totalExpense, expenseByCategory, incomeByCategory, savingRate }
  }, [transactions, range])

  const expenseShare = analytics.totalIncome + analytics.totalExpense ? (analytics.totalExpense / (analytics.totalIncome + analytics.totalExpense)) * 100 : 0
  const topCategory = analytics.expenseByCategory[0]

  return (
    <div className="summary animate-fadeInUp">
      <header className="summary-header">
        <div><p className="eyebrow">Financial analysis</p><h1 className="heading-xl">Insights</h1><p className="text-body">See the habits behind your balance.</p></div>
        <div className="summary-actions">
          <div className="range-switch" role="group" aria-label="Analytics date range">
            <button className={range === 'month' ? 'active' : ''} onClick={() => setRange('month')}>This month</button>
            <button className={range === 'quarter' ? 'active' : ''} onClick={() => setRange('quarter')}>90 days</button>
            <button className={range === 'all' ? 'active' : ''} onClick={() => setRange('all')}>All time</button>
          </div>
          <Link to="/add" className="btn btn-primary">+ Add transaction</Link>
        </div>
      </header>

      {!transactions.length ? (
        <div className="insights-empty card"><span>↗</span><h2>No insights yet</h2><p>Add a few transactions and your category patterns, cash flow, and saving rate will show up here.</p><Link to="/add" className="btn btn-primary">Add first transaction</Link></div>
      ) : (
        <>
          <section className="insight-stats">
            <article className="insight-stat primary"><span>Net cash flow</span><strong className={analytics.balance < 0 ? 'negative' : ''}>{formatCurrency(analytics.balance)}</strong><small>{analytics.filtered.length} transactions in this range</small></article>
            <article className="insight-stat"><span>Total income</span><strong className="income">{formatCurrency(analytics.totalIncome)}</strong><small>{analytics.filtered.filter(t => t.type === 'income').length} income entries</small></article>
            <article className="insight-stat"><span>Total expenses</span><strong>{formatCurrency(analytics.totalExpense)}</strong><small>{analytics.filtered.filter(t => t.type === 'expense').length} expense entries</small></article>
            <article className="insight-stat"><span>Saving rate</span><strong className={analytics.savingRate < 0 ? 'negative' : 'income'}>{analytics.savingRate.toFixed(0)}%</strong><small>{analytics.totalIncome ? 'of income kept' : 'Add income to calculate'}</small></article>
          </section>

          <div className="insights-grid">
            <section className="spending-mix card">
              <div className="insight-section-title"><div><p className="eyebrow">Money mix</p><h2 className="heading-md">Income vs spending</h2></div><span>{range === 'month' ? 'Current month' : range === 'quarter' ? 'Last 90 days' : 'All records'}</span></div>
              <div className="mix-content">
                <div className="donut" style={{ '--expense-share': `${expenseShare * 3.6}deg` }}><div><strong>{formatCurrency(analytics.totalIncome + analytics.totalExpense, true)}</strong><span>total flow</span></div></div>
                <div className="mix-legend">
                  <div><i className="income"/><span>Income<small>{formatCurrency(analytics.totalIncome)}</small></span></div>
                  <div><i className="expense"/><span>Expenses<small>{formatCurrency(analytics.totalExpense)}</small></span></div>
                  <div className="mix-note"><strong>{analytics.balance >= 0 ? 'Positive cash flow' : 'Expenses are ahead'}</strong><small>{analytics.balance >= 0 ? `${formatCurrency(analytics.balance)} stayed in your balance.` : `${formatCurrency(Math.abs(analytics.balance))} more went out than came in.`}</small></div>
                </div>
              </div>
            </section>

            <section className="top-category-card">
              <p className="eyebrow">Largest expense</p>
              <span className="top-category-emoji">{topCategory?.icon || '◎'}</span>
              <h2>{topCategory?.name || 'No spending in range'}</h2>
              <strong>{topCategory ? formatCurrency(topCategory.amount) : formatCurrency(0)}</strong>
              <p>{topCategory && analytics.totalExpense ? `${((topCategory.amount / analytics.totalExpense) * 100).toFixed(0)}% of all spending in this range.` : 'Choose another range or add an expense.'}</p>
            </section>

            <section className="category-breakdown card">
              <div className="insight-section-title"><div><p className="eyebrow">Expenses</p><h2 className="heading-md">Spending by category</h2></div><span>{analytics.expenseByCategory.length} categories</span></div>
              <div className="insight-category-list">
                {analytics.expenseByCategory.length ? analytics.expenseByCategory.map((item, index) => <CategoryRow key={item.name} item={item} total={analytics.totalExpense} index={index}/>) : <p className="inline-empty">No expenses found in this range.</p>}
              </div>
            </section>

            <section className="category-breakdown card">
              <div className="insight-section-title"><div><p className="eyebrow">Income</p><h2 className="heading-md">Income by source</h2></div><span>{analytics.incomeByCategory.length} sources</span></div>
              <div className="insight-category-list">
                {analytics.incomeByCategory.length ? analytics.incomeByCategory.map((item, index) => <CategoryRow key={item.name} item={item} total={analytics.totalIncome} index={index}/>) : <p className="inline-empty">No income found in this range.</p>}
              </div>
            </section>
          </div>
        </>
      )}
    </div>
  )
}

export default Summary
