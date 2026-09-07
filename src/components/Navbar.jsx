import { NavLink } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'
import './Navbar.css'

function NavIcon({ name }) {
  const paths = {
    dashboard: <><rect x="3" y="3" width="7" height="7" rx="2"/><rect x="14" y="3" width="7" height="7" rx="2"/><rect x="3" y="14" width="7" height="7" rx="2"/><rect x="14" y="14" width="7" height="7" rx="2"/></>,
    add: <><path d="M12 3v18M3 12h18"/></>,
    summary: <><path d="M4 19V9M10 19V5M16 19v-7M22 19V3"/></>,
    sun: <><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.42-1.42M17.66 6.34l1.41-1.41"/></>,
    moon: <path d="M20.5 14.5A8.5 8.5 0 0 1 9.5 3.5 8.5 8.5 0 1 0 20.5 14.5Z"/>,
  }
  return <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>
}

function Navbar() {
  const { theme, toggleTheme } = useTheme()

  return (
    <nav className="navbar" id="main-navbar" aria-label="Primary navigation">
      <div className="navbar-inner">
        <div className="navbar-top">
          <NavLink to="/" className="navbar-brand" id="navbar-brand">
            <span className="navbar-logo" aria-hidden="true">
              <svg viewBox="0 0 32 32" fill="none"><path d="M6 9.5A3.5 3.5 0 0 1 9.5 6h13A3.5 3.5 0 0 1 26 9.5v13a3.5 3.5 0 0 1-3.5 3.5h-13A3.5 3.5 0 0 1 6 22.5v-13Z" fill="currentColor"/><path d="M18 13h9v7h-9a3.5 3.5 0 1 1 0-7Z" fill="white" fillOpacity=".95"/><circle cx="19" cy="16.5" r="1.2" fill="currentColor"/></svg>
            </span>
            <span>
              <span className="navbar-title">BroTrack</span>
              <span className="navbar-subtitle">Money, made clear.</span>
            </span>
          </NavLink>

          <div className="navbar-section-label">Workspace</div>
          <div className="navbar-links" id="navbar-links">
            <NavLink to="/" end className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`} id="nav-dashboard">
              <NavIcon name="dashboard" /><span>Dashboard</span>
            </NavLink>
            <NavLink to="/add" className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`} id="nav-add-transaction">
              <NavIcon name="add" /><span>Add transaction</span>
            </NavLink>
            <NavLink to="/summary" className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`} id="nav-summary">
              <NavIcon name="summary" /><span>Insights</span>
            </NavLink>
          </div>
        </div>

        <div className="navbar-footer">
          <div className="privacy-note"><span className="privacy-dot" />Saved privately on this device</div>
          <button className="theme-toggle" onClick={toggleTheme} aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`} id="theme-toggle">
            <NavIcon name={theme === 'light' ? 'moon' : 'sun'} />
            <span>{theme === 'light' ? 'Dark mode' : 'Light mode'}</span>
            <span className={`toggle-track ${theme}`}><span className="toggle-thumb" /></span>
          </button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
