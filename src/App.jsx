/**
 * App.jsx — Root component for BroTrack
 * 
 * Stage 2: Wraps the app with ThemeProvider and TransactionProvider.
 * The theme is now managed via Context API — no prop drilling.
 * Routing will be added in Stage 3.
 */
import { ThemeProvider, useTheme } from './context/ThemeContext'
import { TransactionProvider, useTransactionContext } from './context/TransactionContext'

/**
 * Inner app component — can now use both contexts.
 * Demonstrates that Context API is working correctly.
 */
function AppContent() {
  const { theme, toggleTheme } = useTheme()
  const { transactions, addTransaction } = useTransactionContext()

  /** Add a sample transaction to test the custom hook */
  const handleAddSample = () => {
    addTransaction({
      title: 'Sample Transaction',
      amount: Math.floor(Math.random() * 1000) + 100,
      type: Math.random() > 0.5 ? 'income' : 'expense',
      category: 'Food',
      date: new Date().toISOString().split('T')[0],
      notes: 'Added for testing',
    })
  }

  return (
    <div className="container">
      <div className="page-wrapper">
        <div style={{ textAlign: 'center', padding: 'var(--space-3xl) 0' }}>
          <h1 className="heading-xl" style={{ marginBottom: 'var(--space-md)' }}>
            💰 BroTrack
          </h1>
          <p className="text-body" style={{ marginBottom: 'var(--space-xl)' }}>
            Your Personal Budget Tracker
          </p>

          <div style={{ display: 'flex', gap: 'var(--space-md)', justifyContent: 'center', flexWrap: 'wrap', marginBottom: 'var(--space-2xl)' }}>
            <button className="btn btn-primary btn-lg" onClick={handleAddSample}>
              ➕ Add Sample Transaction
            </button>
            <button className="btn btn-secondary btn-lg" onClick={toggleTheme}>
              {theme === 'light' ? '🌙' : '☀️'} Toggle {theme === 'light' ? 'Dark' : 'Light'}
            </button>
          </div>

          {/* Show transaction count to verify persistence */}
          <p className="text-body" style={{ marginBottom: 'var(--space-lg)' }}>
            📊 {transactions.length} transaction{transactions.length !== 1 ? 's' : ''} stored
          </p>

          {/* Preview cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-lg)' }} className="stagger-children">
            <div className="card animate-fadeInUp">
              <div className="badge badge-income" style={{ marginBottom: 'var(--space-sm)' }}>✅ Context API</div>
              <h3 className="heading-md">Theme via Context</h3>
              <p className="text-body">Current theme: <strong>{theme}</strong> — managed via ThemeContext, no prop drilling</p>
            </div>
            <div className="card animate-fadeInUp">
              <div className="badge badge-category" style={{ marginBottom: 'var(--space-sm)' }}>✅ Custom Hook</div>
              <h3 className="heading-md">useTransactions</h3>
              <p className="text-body">Reusable hook handling localStorage read/write with CRUD operations</p>
            </div>
            <div className="card animate-fadeInUp">
              <div className="badge badge-expense" style={{ marginBottom: 'var(--space-sm)' }}>🔜 Next</div>
              <h3 className="heading-md">React Router</h3>
              <p className="text-body">Stage 3 will add 4 real routes with distinct URLs</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * App — Root component wrapping everything with Context Providers.
 * ThemeProvider and TransactionProvider are at the top level
 * so all pages and components can access theme and transaction state.
 */
function App() {
  return (
    <ThemeProvider>
      <TransactionProvider>
        <AppContent />
      </TransactionProvider>
    </ThemeProvider>
  )
}

export default App
