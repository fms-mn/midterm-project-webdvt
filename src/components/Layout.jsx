/**
 * Layout.jsx — Shared layout wrapper for all pages
 * 
 * Provides consistent structure with:
 * - Navbar at the top
 * - Main content area with page transitions
 * - Container for consistent max-width
 */
import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'

function Layout() {
  return (
    <div className="app-shell">
      <Navbar />
      <main className="page-wrapper">
        <Outlet />
      </main>
    </div>
  )
}

export default Layout
