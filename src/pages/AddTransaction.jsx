/**
 * AddTransaction.jsx — Form page for logging new transactions
 * Route: /add
 * 
 * Features:
 * - Multi-field form: title, amount, type (income/expense), category, date, notes
 * - Client-side validation with inline error messages
 * - Category selection with visual icon pills
 * - On successful submission → navigate to Dashboard
 * - Smooth form animations
 * 
 * Validates:
 * - Title: required, min 2 characters
 * - Amount: required, must be positive number
 * - Type: required (income or expense)
 * - Category: required
 * - Date: required
 */
import { useState, useCallback } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useTransactionContext } from '../context/TransactionContext'
import './AddTransaction.css'

/** Category definitions with icons and colors */
const CATEGORIES = [
  { name: 'Food', icon: '🍔', color: 'var(--cat-food)' },
  { name: 'Transport', icon: '🚗', color: 'var(--cat-transport)' },
  { name: 'Entertainment', icon: '🎮', color: 'var(--cat-entertainment)' },
  { name: 'Bills', icon: '📄', color: 'var(--cat-bills)' },
  { name: 'Shopping', icon: '🛍️', color: 'var(--cat-shopping)' },
  { name: 'Health', icon: '💊', color: 'var(--cat-health)' },
  { name: 'Education', icon: '📚', color: 'var(--cat-education)' },
  { name: 'Salary', icon: '💼', color: 'var(--cat-salary)' },
  { name: 'Freelance', icon: '💻', color: 'var(--cat-freelance)' },
  { name: 'Other', icon: '📦', color: 'var(--cat-other)' },
]

/** Initial empty form state */
const INITIAL_FORM = {
  title: '',
  amount: '',
  type: '',
  category: '',
  date: new Date().toISOString().split('T')[0],
  notes: '',
}

/**
 * Validate all form fields and return an errors object.
 * Returns empty object if all valid.
 */
function validateForm(form) {
  const errors = {}

  if (!form.title.trim()) {
    errors.title = 'Title is required'
  } else if (form.title.trim().length < 2) {
    errors.title = 'Title must be at least 2 characters'
  }

  if (!form.amount) {
    errors.amount = 'Amount is required'
  } else if (isNaN(form.amount) || parseFloat(form.amount) <= 0) {
    errors.amount = 'Amount must be a positive number'
  }

  if (!form.type) {
    errors.type = 'Please select income or expense'
  }

  if (!form.category) {
    errors.category = 'Please select a category'
  }

  if (!form.date) {
    errors.date = 'Date is required'
  }

  return errors
}

function AddTransaction() {
  const navigate = useNavigate()
  const { addTransaction } = useTransactionContext()
  const [form, setForm] = useState(INITIAL_FORM)
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  /** Update a single form field */
  const handleChange = useCallback((e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    // Clear error for this field when user starts typing
    setErrors(prev => {
      if (prev[name]) {
        const next = { ...prev }
        delete next[name]
        return next
      }
      return prev
    })
  }, [])

  /** Handle category pill click */
  const handleCategorySelect = useCallback((categoryName) => {
    setForm(prev => ({ ...prev, category: categoryName }))
    setErrors(prev => {
      if (prev.category) {
        const next = { ...prev }
        delete next.category
        return next
      }
      return prev
    })
  }, [])

  /** Handle type selection */
  const handleTypeSelect = useCallback((type) => {
    setForm(prev => ({ ...prev, type }))
    setErrors(prev => {
      if (prev.type) {
        const next = { ...prev }
        delete next.type
        return next
      }
      return prev
    })
  }, [])

  /** Handle form submission */
  const handleSubmit = useCallback((e) => {
    e.preventDefault()
    
    const validationErrors = validateForm(form)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setIsSubmitting(true)

    // Add the transaction via context
    addTransaction({
      title: form.title.trim(),
      amount: form.amount,
      type: form.type,
      category: form.category,
      date: form.date,
      notes: form.notes.trim(),
    })

    // Brief delay for visual feedback, then navigate to Dashboard
    setTimeout(() => {
      navigate('/')
    }, 300)
  }, [form, addTransaction, navigate])

  return (
    <div className="add-transaction animate-fadeInUp">
      {/* Page Header */}
      <div className="add-transaction__header">
        <Link to="/" className="btn btn-ghost" id="back-to-dashboard">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
          Back
        </Link>
        <div>
          <h1 className="heading-xl">Add Transaction</h1>
          <p className="text-body">Log a new income or expense</p>
        </div>
      </div>

      {/* Form */}
      <form className="transaction-form card" onSubmit={handleSubmit} id="add-transaction-form" noValidate>
        
        {/* Transaction Type Selection */}
        <div className="form-group">
          <label className="form-label">Transaction Type *</label>
          <div className="type-selector" id="type-selector">
            <button
              type="button"
              className={`type-btn type-btn--income ${form.type === 'income' ? 'active' : ''}`}
              onClick={() => handleTypeSelect('income')}
              id="type-income"
            >
              <span className="type-btn__icon">📥</span>
              <span className="type-btn__label">Income</span>
            </button>
            <button
              type="button"
              className={`type-btn type-btn--expense ${form.type === 'expense' ? 'active' : ''}`}
              onClick={() => handleTypeSelect('expense')}
              id="type-expense"
            >
              <span className="type-btn__icon">📤</span>
              <span className="type-btn__label">Expense</span>
            </button>
          </div>
          {errors.type && <div className="form-error" id="error-type">⚠ {errors.type}</div>}
        </div>

        {/* Title */}
        <div className="form-group">
          <label className="form-label" htmlFor="input-title">Title *</label>
          <input
            type="text"
            className={`form-input ${errors.title ? 'error' : ''}`}
            id="input-title"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="e.g., Grocery shopping, Monthly salary..."
            autoComplete="off"
          />
          {errors.title && <div className="form-error" id="error-title">⚠ {errors.title}</div>}
        </div>

        {/* Amount & Date — side by side on desktop */}
        <div className="form-grid">
        {/* Amount */}
        <div className="form-group">
          <label className="form-label" htmlFor="input-amount">Amount (₱) *</label>
          <input
            type="number"
            className={`form-input ${errors.amount ? 'error' : ''}`}
            id="input-amount"
            name="amount"
            value={form.amount}
            onChange={handleChange}
            placeholder="0.00"
            min="0"
            step="0.01"
          />
          {errors.amount && <div className="form-error" id="error-amount">⚠ {errors.amount}</div>}
        </div>

        {/* Date */}
        <div className="form-group">
          <label className="form-label" htmlFor="input-date">Date *</label>
          <input
            type="date"
            className={`form-input ${errors.date ? 'error' : ''}`}
            id="input-date"
            name="date"
            value={form.date}
            onChange={handleChange}
          />
          {errors.date && <div className="form-error" id="error-date">⚠ {errors.date}</div>}
        </div>
        </div>

        {/* Category Pills */}
        <div className="form-group">
          <label className="form-label">Category *</label>
          <div className="category-pills" id="category-pills">
            {CATEGORIES.map((cat) => (
              <button
                type="button"
                key={cat.name}
                className={`category-pill ${form.category === cat.name ? 'active' : ''}`}
                onClick={() => handleCategorySelect(cat.name)}
                style={form.category === cat.name ? { borderColor: cat.color, background: `${cat.color}15` } : {}}
                id={`category-${cat.name.toLowerCase()}`}
              >
                <span className="category-pill__icon">{cat.icon}</span>
                <span className="category-pill__name">{cat.name}</span>
              </button>
            ))}
          </div>
          {errors.category && <div className="form-error" id="error-category">⚠ {errors.category}</div>}
        </div>

        {/* Notes (Optional) */}
        <div className="form-group">
          <label className="form-label" htmlFor="input-notes">Notes (optional)</label>
          <textarea
            className="form-input form-textarea"
            id="input-notes"
            name="notes"
            value={form.notes}
            onChange={handleChange}
            placeholder="Add any additional notes..."
            rows="3"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className={`btn btn-primary btn-lg submit-btn ${isSubmitting ? 'submitting' : ''}`}
          disabled={isSubmitting}
          id="submit-transaction"
        >
          {isSubmitting ? (
            <>
              <span className="spinner" /> Adding...
            </>
          ) : (
            <>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              Add Transaction
            </>
          )}
        </button>
      </form>
    </div>
  )
}

export default AddTransaction
