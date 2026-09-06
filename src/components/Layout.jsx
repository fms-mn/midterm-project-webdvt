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
    <>
      <Navbar />
      <main className="container page-wrapper">
        <Outlet />
      </main>
    </>
  )
}

export default Layout
