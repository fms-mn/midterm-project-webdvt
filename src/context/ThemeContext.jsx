/**
 * ThemeContext.jsx — Theme management via React Context API
 * 
 * Provides a ThemeProvider that wraps the entire app and a useTheme hook
 * for toggling between light and dark themes. Theme preference is
 * persisted to localStorage so it survives page reloads.
 * 
 * The theme is applied by setting the `data-theme` attribute on the
 * <html> element, which activates the corresponding CSS custom properties
 * defined in our design system (src/styles/index.css).
 * 
 * Usage:
 *   import { useTheme } from '../context/ThemeContext'
 *   const { theme, toggleTheme } = useTheme()
 * 
 * NO PROP DRILLING — any component can access theme via useTheme().
 */
import { createContext, useContext, useState, useEffect, useCallback } from 'react'

const ThemeContext = createContext(undefined)

/**
 * Reads the saved theme from localStorage, falling back to 'light'.
 */
function getInitialTheme() {
  try {
    const saved = localStorage.getItem('brotrack-theme')
    if (saved === 'dark' || saved === 'light') return saved
  } catch {
    // localStorage may be unavailable (e.g., private browsing in some browsers)
  }
  return 'light'
}

/**
 * ThemeProvider — Wrap your app with this to enable theme toggling.
 * Sets `data-theme` on <html> and persists choice to localStorage.
 */
export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(getInitialTheme)

  // Apply theme to the DOM and persist to storage
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    try {
      localStorage.setItem('brotrack-theme', theme)
    } catch {
      // Silently fail if localStorage is unavailable
    }
  }, [theme])

  // Memoized toggle to prevent unnecessary re-renders in consumers
  const toggleTheme = useCallback(() => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'))
  }, [])

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

/**
 * useTheme — Custom hook to access theme state and toggle function.
 * Must be used within a <ThemeProvider>.
 * 
 * @returns {{ theme: 'light' | 'dark', toggleTheme: () => void }}
 */
export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
