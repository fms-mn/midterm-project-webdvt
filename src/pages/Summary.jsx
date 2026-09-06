/**
 * Summary.jsx — Spending breakdown and analytics page
 * 
 * Will include:
 * - Category-wise spending breakdown with visual bars
 * - Income vs Expense comparison
 * - Theme toggle (also accessible here)
 * 
 * Full implementation in Stage 7.
 */

function Summary() {
  return (
    <div className="animate-fadeInUp">
      <div style={{ marginBottom: 'var(--space-xl)' }}>
        <h1 className="heading-xl">Summary</h1>
        <p className="text-body">Your spending breakdown and analytics</p>
      </div>

      <div className="empty-state">
        <div className="empty-state-icon">📈</div>
        <h2 className="empty-state-title">Coming in Stage 7</h2>
        <p className="empty-state-text">
          Category breakdown charts, income vs expense comparison, and more!
        </p>
      </div>
    </div>
  )
}

export default Summary
