/**
 * TransactionDetail.jsx — Individual transaction detail page
 * 
 * Accessed via /transaction/:id using useParams.
 * Will include:
 * - Full transaction details display
 * - Edit mode with inline editing
 * - Delete with confirmation modal
 * 
 * Full implementation in Stage 6.
 */
import { useParams, Link } from 'react-router-dom'

function TransactionDetail() {
  const { id } = useParams()

  return (
    <div className="animate-fadeInUp">
      <div style={{ marginBottom: 'var(--space-xl)' }}>
        <Link to="/" className="btn btn-ghost" style={{ marginBottom: 'var(--space-md)' }}>
          ← Back to Dashboard
        </Link>
        <h1 className="heading-xl">Transaction Detail</h1>
        <p className="text-body">Viewing transaction: <code>{id}</code></p>
      </div>

      <div className="empty-state">
        <div className="empty-state-icon">🔍</div>
        <h2 className="empty-state-title">Coming in Stage 6</h2>
        <p className="empty-state-text">
          Full details, inline editing, and delete confirmation modal!
        </p>
      </div>
    </div>
  )
}

export default TransactionDetail
