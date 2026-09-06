/**
 * App.jsx — Root component for BroTrack
 * 
 * Stage 1: Basic shell with design system applied.
 * Next stages will add routing, contexts, and pages.
 */
function App() {
  // Default to light theme for now (ThemeContext comes in Stage 2)
  document.documentElement.setAttribute('data-theme', 'light')

  return (
    <div className="container">
      <div className="page-wrapper">
        <div style={{ textAlign: 'center', padding: 'var(--space-3xl) 0' }}>
          <h1 className="heading-xl" style={{ marginBottom: 'var(--space-md)' }}>
            💰 BroTrack
          </h1>
          <p className="text-body" style={{ marginBottom: 'var(--space-xl)' }}>
            Your Personal Budget Tracker — Coming Soon
          </p>
          <div style={{ display: 'flex', gap: 'var(--space-md)', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="btn btn-primary btn-lg">Get Started</button>
            <button className="btn btn-secondary btn-lg">Learn More</button>
          </div>

          {/* Design System Preview */}
          <div style={{ marginTop: 'var(--space-3xl)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-lg)' }}>
            <div className="card animate-fadeInUp">
              <div className="badge badge-income" style={{ marginBottom: 'var(--space-sm)' }}>Income</div>
              <h3 className="heading-md">Design System Ready</h3>
              <p className="text-body">Beautiful light &amp; dark themes with glassmorphism</p>
            </div>
            <div className="card animate-fadeInUp" style={{ animationDelay: '100ms' }}>
              <div className="badge badge-expense" style={{ marginBottom: 'var(--space-sm)' }}>Expense</div>
              <h3 className="heading-md">Premium UI</h3>
              <p className="text-body">Micro-animations, gradients, and modern typography</p>
            </div>
            <div className="card animate-fadeInUp" style={{ animationDelay: '200ms' }}>
              <div className="badge badge-category" style={{ marginBottom: 'var(--space-sm)' }}>React</div>
              <h3 className="heading-md">Modern Stack</h3>
              <p className="text-body">React + Vite + React Router with Context API</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
