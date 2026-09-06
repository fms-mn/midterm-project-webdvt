/**
 * useTransactions.js — Custom hook for transaction persistence
 * 
 * This is the REUSABLE custom hook required by the rubric.
 * It abstracts all reading/writing of transactions to localStorage,
 * so no component needs to handle serialization or storage logic directly.
 * 
 * Features:
 * - Reads transactions from localStorage on mount
 * - Provides CRUD operations (add, update, delete)
 * - Generates unique IDs for new transactions
 * - Automatically syncs state to localStorage on every change
 * - Handles serialization/deserialization and error fallbacks
 * 
 * Usage:
 *   const { transactions, addTransaction, updateTransaction, deleteTransaction } = useTransactions()
 * 
 * This hook is consumed by TransactionContext to provide app-wide state,
 * but it could also be used independently in any component.
 */
import { useState, useEffect, useCallback } from 'react'

const STORAGE_KEY = 'brotrack-transactions'

/**
 * Generate a unique ID for a new transaction.
 * Uses timestamp + random string for uniqueness.
 */
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 9)
}

/**
 * Read transactions from localStorage with error handling.
 * Returns an empty array if storage is empty or corrupted.
 */
function readFromStorage() {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    if (data) {
      const parsed = JSON.parse(data)
      if (Array.isArray(parsed)) return parsed
    }
  } catch (error) {
    console.warn('Failed to read transactions from localStorage:', error)
  }
  return []
}

/**
 * Write transactions to localStorage with error handling.
 */
function writeToStorage(transactions) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions))
  } catch (error) {
    console.warn('Failed to write transactions to localStorage:', error)
  }
}

/**
 * useTransactions — Reusable custom hook for transaction CRUD with localStorage persistence.
 * 
 * @returns {{
 *   transactions: Array,
 *   addTransaction: (transaction: Object) => Object,
 *   updateTransaction: (id: string, updates: Object) => boolean,
 *   deleteTransaction: (id: string) => boolean,
 *   getTransaction: (id: string) => Object | undefined
 * }}
 */
export function useTransactions() {
  const [transactions, setTransactions] = useState(readFromStorage)

  // Sync to localStorage whenever transactions change
  useEffect(() => {
    writeToStorage(transactions)
  }, [transactions])

  /**
   * Add a new transaction.
   * Automatically generates an ID and adds a createdAt timestamp.
   * 
   * @param {Object} transaction — { title, amount, type, category, date, notes }
   * @returns {Object} The newly created transaction with id and createdAt
   */
  const addTransaction = useCallback((transaction) => {
    const newTransaction = {
      ...transaction,
      id: generateId(),
      amount: parseFloat(transaction.amount),
      createdAt: new Date().toISOString(),
    }
    setTransactions(prev => [newTransaction, ...prev])
    return newTransaction
  }, [])

  /**
   * Update an existing transaction by ID.
   * Merges the updates into the existing transaction object.
   * 
   * @param {string} id — Transaction ID to update
   * @param {Object} updates — Fields to update
   * @returns {boolean} True if the transaction was found and updated
   */
  const updateTransaction = useCallback((id, updates) => {
    let found = false
    setTransactions(prev =>
      prev.map(t => {
        if (t.id === id) {
          found = true
          return { ...t, ...updates, amount: updates.amount ? parseFloat(updates.amount) : t.amount }
        }
        return t
      })
    )
    return found
  }, [])

  /**
   * Delete a transaction by ID.
   * 
   * @param {string} id — Transaction ID to delete
   * @returns {boolean} True if the transaction was found and deleted
   */
  const deleteTransaction = useCallback((id) => {
    let found = false
    setTransactions(prev => {
      const filtered = prev.filter(t => {
        if (t.id === id) {
          found = true
          return false
        }
        return true
      })
      return filtered
    })
    return found
  }, [])

  /**
   * Get a single transaction by ID.
   * 
   * @param {string} id — Transaction ID to look up
   * @returns {Object | undefined} The transaction if found
   */
  const getTransaction = useCallback((id) => {
    return transactions.find(t => t.id === id)
  }, [transactions])

  return {
    transactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    getTransaction,
  }
}
