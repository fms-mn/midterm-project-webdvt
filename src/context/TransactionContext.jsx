/**
 * TransactionContext.jsx — App-wide transaction state via React Context
 * 
 * Wraps the useTransactions custom hook and exposes it through Context
 * so that any component in the tree can access transaction data and
 * CRUD operations without prop drilling.
 * 
 * This is separate from the custom hook to demonstrate the pattern:
 * - useTransactions (hook) = handles persistence logic (reusable)
 * - TransactionContext (context) = provides app-wide access (no prop drilling)
 * 
 * Usage:
 *   import { useTransactionContext } from '../context/TransactionContext'
 *   const { transactions, addTransaction } = useTransactionContext()
 */
import { createContext, useContext } from 'react'
import { useTransactions } from '../hooks/useTransactions'

const TransactionContext = createContext(undefined)

/**
 * TransactionProvider — Wrap your app with this to provide
 * transaction state and CRUD operations to all child components.
 */
export function TransactionProvider({ children }) {
  const transactionState = useTransactions()

  return (
    <TransactionContext.Provider value={transactionState}>
      {children}
    </TransactionContext.Provider>
  )
}

/**
 * useTransactionContext — Access transaction state from any component.
 * Must be used within a <TransactionProvider>.
 * 
 * @returns {{
 *   transactions: Array,
 *   addTransaction: Function,
 *   updateTransaction: Function,
 *   deleteTransaction: Function,
 *   getTransaction: Function
 * }}
 */
export function useTransactionContext() {
  const context = useContext(TransactionContext)
  if (context === undefined) {
    throw new Error('useTransactionContext must be used within a TransactionProvider')
  }
  return context
}
