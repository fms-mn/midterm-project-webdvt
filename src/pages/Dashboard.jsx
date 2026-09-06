/**
 * Dashboard.jsx — Home page
 * 
 * Will display:
 * - Balance summary cards
 * - Filterable transaction list
 * - Links to individual transaction details
 * 
 * Full implementation in Stage 4.
 */
import { Link } from 'react-router-dom'

function Dashboard() {
  return (
    <div className="animate-fadeInUp">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-xl)' }}>
        <div>
          <h1 className="heading-xl">Dashboard</h1>
          <p className="text-body">Overview of your financial activity</p>
        </div>
        <Link to="/add" className="btn btn-primary btn-lg" id="add-transaction-btn">
          ➕ Add Transaction
        </Link>
      </div>

      <div className="empty-state">
        <div className="empty-state-icon">📊</div>
        <h2 className="empty-state-title">Coming in Stage 4</h2>
        <p className="empty-state-text">
          Balance cards, transaction list with filters, and more!
        </p>
      </div>
    </div>
  )
}

export default Dashboard
