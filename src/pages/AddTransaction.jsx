/**
 * AddTransaction.jsx — Form page for logging new transactions
 * 
 * Will include:
 * - Multi-field form (title, amount, type, category, date, notes)
 * - Client-side validation with inline errors
 * - Category selection with icon pills
 * - Navigate to Dashboard on success
 * 
 * Full implementation in Stage 5.
 */

function AddTransaction() {
  return (
    <div className="animate-fadeInUp">
      <div style={{ marginBottom: 'var(--space-xl)' }}>
        <h1 className="heading-xl">Add Transaction</h1>
        <p className="text-body">Log a new income or expense</p>
      </div>

      <div className="empty-state">
        <div className="empty-state-icon">➕</div>
        <h2 className="empty-state-title">Coming in Stage 5</h2>
        <p className="empty-state-text">
          Beautiful form with validation, category pills, and smooth animations!
        </p>
      </div>
    </div>
  )
}

export default AddTransaction
