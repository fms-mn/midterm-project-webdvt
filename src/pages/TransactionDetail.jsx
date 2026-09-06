/**
 * TransactionDetail.jsx — Individual transaction detail page
 * Route: /transaction/:id
 * 
 * Features:
 * - Access via unique URL using useParams
 * - Display full transaction details in a premium card
 * - Edit mode toggle with inline form editing
 * - Delete with confirmation modal
 * - Navigate back to Dashboard after delete
 * - 404-style handling for invalid IDs
 */
import { useState, useCallback, useMemo } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useTransactionContext } from '../context/TransactionContext'
import './TransactionDetail.css'

/** Category emoji icons */
const CATEGORY_ICONS = {
  Food: '🍔', Transport: '🚗', Entertainment: '🎮', Bills: '📄',
  Shopping: '🛍️', Health: '💊', Education: '📚', Salary: '💼',
  Freelance: '💻', Other: '📦',
}

/** Available categories for edit mode */
const CATEGORIES = [
  'Food', 'Transport', 'Entertainment', 'Bills',
  'Shopping', 'Health', 'Education', 'Salary', 'Freelance', 'Other'
]

/** Format currency */
function formatCurrency(amount) {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency', currency: 'PHP', minimumFractionDigits: 2,
  }).format(amount)
}

/** Format date */
function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
  })
}

function TransactionDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getTransaction, updateTransaction, deleteTransaction } = useTransactionContext()
  
  const transaction = getTransaction(id)
  
  const [isEditing, setIsEditing] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [editForm, setEditForm] = useState(null)
  const [editErrors, setEditErrors] = useState({})

  /** Initialize edit form with current transaction data */
  const startEditing = useCallback(() => {
    if (transaction) {
      setEditForm({
        title: transaction.title,
        amount: transaction.amount.toString(),
        type: transaction.type,
        category: transaction.category,
        date: transaction.date,
        notes: transaction.notes || '',
      })
      setEditErrors({})
      setIsEditing(true)
    }
  }, [transaction])

  /** Cancel editing */
  const cancelEditing = useCallback(() => {
    setIsEditing(false)
    setEditForm(null)
    setEditErrors({})
  }, [])

  /** Handle edit form field changes */
  const handleEditChange = useCallback((e) => {
    const { name, value } = e.target
    setEditForm(prev => ({ ...prev, [name]: value }))
    setEditErrors(prev => {
      if (prev[name]) {
        const next = { ...prev }
        delete next[name]
        return next
      }
      return prev
    })
  }, [])

  /** Save edited transaction */
  const handleSave = useCallback(() => {
    const errors = {}
    if (!editForm.title.trim()) errors.title = 'Title is required'
    if (!editForm.amount || parseFloat(editForm.amount) <= 0) errors.amount = 'Valid amount required'
    if (!editForm.date) errors.date = 'Date is required'
    
    if (Object.keys(errors).length > 0) {
      setEditErrors(errors)
      return
    }

    updateTransaction(id, {
      title: editForm.title.trim(),
      amount: editForm.amount,
      type: editForm.type,
      category: editForm.category,
      date: editForm.date,
      notes: editForm.notes.trim(),
    })
    setIsEditing(false)
    setEditForm(null)
  }, [editForm, id, updateTransaction])

  /** Delete transaction and go home */
  const handleDelete = useCallback(() => {
    deleteTransaction(id)
    navigate('/')
  }, [deleteTransaction, id, navigate])

  /** Formatted created-at timestamp */
  const createdAtFormatted = useMemo(() => {
    if (!transaction?.createdAt) return null
    return new Date(transaction.createdAt).toLocaleString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    })
  }, [transaction?.createdAt])

  // Transaction not found
  if (!transaction) {
    return (
      <div className="animate-fadeInUp">
        <div className="empty-state">
          <div className="empty-state-icon">🔍</div>
          <h2 className="empty-state-title">Transaction Not Found</h2>
          <p className="empty-state-text">
            The transaction you&apos;re looking for doesn&apos;t exist or has been deleted.
          </p>
          <Link to="/" className="btn btn-primary btn-lg">← Back to Dashboard</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="transaction-detail animate-fadeInUp">
      {/* Back Navigation */}
      <Link to="/" className="btn btn-ghost detail-back-btn" id="back-to-dashboard">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6"/>
        </svg>
        Back to Dashboard
      </Link>

      {/* Detail Card */}
      <div className="detail-card card" id="transaction-detail-card">
        {/* Header with type badge and actions */}
        <div className="detail-card__header">
          <div className="detail-card__badge-row">
            <span className={`badge badge-${transaction.type}`}>
              {transaction.type === 'income' ? '📥 Income' : '📤 Expense'}
            </span>
            <span className="badge badge-category">
              {CATEGORY_ICONS[transaction.category]} {transaction.category}
            </span>
          </div>
          <div className="detail-card__actions">
            {!isEditing ? (
              <>
                <button className="btn btn-secondary" onClick={startEditing} id="edit-btn">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                    <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                  </svg>
                  Edit
                </button>
                <button className="btn btn-danger" onClick={() => setShowDeleteModal(true)} id="delete-btn">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="3 6 5 6 21 6"/>
                    <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
                  </svg>
                  Delete
                </button>
              </>
            ) : (
              <>
                <button className="btn btn-primary" onClick={handleSave} id="save-btn">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  Save
                </button>
                <button className="btn btn-secondary" onClick={cancelEditing} id="cancel-btn">
                  Cancel
                </button>
              </>
            )}
          </div>
        </div>

        {/* Content — View or Edit mode */}
        {!isEditing ? (
          /* View Mode */
          <div className="detail-card__body">
            <div className="detail-icon-large">
              {CATEGORY_ICONS[transaction.category] || '📦'}
            </div>
            
            <h2 className="detail-title">{transaction.title}</h2>
            
            <div className={`detail-amount ${transaction.type}`}>
              {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
            </div>

            <div className="detail-fields">
              <div className="detail-field">
                <span className="detail-field__label">Date</span>
                <span className="detail-field__value">{formatDate(transaction.date)}</span>
              </div>
              <div className="detail-field">
                <span className="detail-field__label">Category</span>
                <span className="detail-field__value">{CATEGORY_ICONS[transaction.category]} {transaction.category}</span>
              </div>
              <div className="detail-field">
                <span className="detail-field__label">Type</span>
                <span className="detail-field__value" style={{ textTransform: 'capitalize' }}>{transaction.type}</span>
              </div>
              {transaction.notes && (
                <div className="detail-field detail-field--full">
                  <span className="detail-field__label">Notes</span>
                  <span className="detail-field__value">{transaction.notes}</span>
                </div>
              )}
              {createdAtFormatted && (
                <div className="detail-field detail-field--full">
                  <span className="detail-field__label">Added on</span>
                  <span className="detail-field__value text-small">{createdAtFormatted}</span>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Edit Mode */
          <div className="detail-card__edit">
            <div className="form-group">
              <label className="form-label" htmlFor="edit-title">Title</label>
              <input
                type="text"
                className={`form-input ${editErrors.title ? 'error' : ''}`}
                id="edit-title"
                name="title"
                value={editForm.title}
                onChange={handleEditChange}
              />
              {editErrors.title && <div className="form-error">⚠ {editErrors.title}</div>}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="edit-amount">Amount (₱)</label>
                <input
                  type="number"
                  className={`form-input ${editErrors.amount ? 'error' : ''}`}
                  id="edit-amount"
                  name="amount"
                  value={editForm.amount}
                  onChange={handleEditChange}
                  min="0"
                  step="0.01"
                />
                {editErrors.amount && <div className="form-error">⚠ {editErrors.amount}</div>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="edit-type">Type</label>
                <select
                  className="form-select"
                  id="edit-type"
                  name="type"
                  value={editForm.type}
                  onChange={handleEditChange}
                >
                  <option value="income">Income</option>
                  <option value="expense">Expense</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="edit-category">Category</label>
                <select
                  className="form-select"
                  id="edit-category"
                  name="category"
                  value={editForm.category}
                  onChange={handleEditChange}
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{CATEGORY_ICONS[cat]} {cat}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="edit-date">Date</label>
                <input
                  type="date"
                  className={`form-input ${editErrors.date ? 'error' : ''}`}
                  id="edit-date"
                  name="date"
                  value={editForm.date}
                  onChange={handleEditChange}
                />
                {editErrors.date && <div className="form-error">⚠ {editErrors.date}</div>}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="edit-notes">Notes</label>
              <textarea
                className="form-input form-textarea"
                id="edit-notes"
                name="notes"
                value={editForm.notes}
                onChange={handleEditChange}
                rows="3"
              />
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal-overlay" onClick={() => setShowDeleteModal(false)} id="delete-modal">
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div style={{ textAlign: 'center', marginBottom: 'var(--space-md)' }}>
              <span style={{ fontSize: '3rem' }}>🗑️</span>
            </div>
            <h3 className="modal-title" style={{ textAlign: 'center' }}>Delete Transaction?</h3>
            <p className="text-body" style={{ textAlign: 'center' }}>
              Are you sure you want to delete &quot;<strong>{transaction.title}</strong>&quot;? This action cannot be undone.
            </p>
            <div className="modal-actions">
              <button
                className="btn btn-secondary"
                onClick={() => setShowDeleteModal(false)}
                id="cancel-delete"
              >
                Cancel
              </button>
              <button
                className="btn btn-danger"
                onClick={handleDelete}
                id="confirm-delete"
              >
                🗑️ Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default TransactionDetail
