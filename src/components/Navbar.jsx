/**
 * Navbar.jsx — Main navigation bar for BroTrack
 * 
 * Features:
 * - Logo/brand link to home
 * - NavLink components with active route highlighting
 * - Theme toggle button with animated sun/moon icon
 * - Responsive design with mobile-friendly layout
 * - Glassmorphism background with backdrop blur
 */
import { NavLink } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'
import './Navbar.css'

function Navbar() {
  const { theme, toggleTheme } = useTheme()

  return (
    <nav className="navbar" id="main-navbar">
      <div className="container">
        <div className="navbar-inner">
          {/* Brand / Logo */}
          <NavLink to="/" className="navbar-brand" id="navbar-brand">
            <span className="navbar-logo">💰</span>
            <span className="navbar-title">BroTrack</span>
          </NavLink>

          {/* Navigation Links */}
          <div className="navbar-links" id="navbar-links">
            <NavLink
              to="/"
              end
              className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`}
              id="nav-dashboard"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7" rx="1"/>
                <rect x="14" y="3" width="7" height="7" rx="1"/>
                <rect x="3" y="14" width="7" height="7" rx="1"/>
                <rect x="14" y="14" width="7" height="7" rx="1"/>
              </svg>
              <span>Dashboard</span>
            </NavLink>

            <NavLink
              to="/add"
              className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`}
              id="nav-add-transaction"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="16"/>
                <line x1="8" y1="12" x2="16" y2="12"/>
              </svg>
              <span>Add</span>
            </NavLink>

            <NavLink
              to="/summary"
              className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`}
              id="nav-summary"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="20" x2="18" y2="10"/>
                <line x1="12" y1="20" x2="12" y2="4"/>
                <line x1="6" y1="20" x2="6" y2="14"/>
              </svg>
              <span>Summary</span>
            </NavLink>
          </div>

          {/* Theme Toggle */}
          <button
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
            id="theme-toggle"
          >
            <div className={`toggle-track ${theme}`}>
              <span className="toggle-icon sun">☀️</span>
              <span className="toggle-icon moon">🌙</span>
              <div className="toggle-thumb" />
            </div>
          </button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
