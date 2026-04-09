// useLoans.js
// Manages all loan-related state and API calls.

import { ref } from 'vue'
import { apiRequest } from './useApi'

const loans = ref([])
const loading = ref(false)
const error = ref(null)

export function useLoans() {

  async function fetchLoans() {
    loading.value = true
    error.value = null
    try {
      loans.value = await apiRequest('/loans')
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  async function createLoan(loanData) {
    const newLoan = await apiRequest('/loans', 'POST', loanData)
    loans.value.push(newLoan)
    return newLoan
  }

  // Marks a loan as returned by setting its returned_date on the server.
  // We default to today's date since that's almost always when the book comes back.
  async function returnLoan(loanId) {
    const returned_date = new Date().toISOString().split('T')[0]
    const updated = await apiRequest(`/loans/${loanId}/return`, 'POST', { returned_date })
    const index = loans.value.findIndex(l => l.id === loanId)
    if (index !== -1) loans.value[index] = updated
    return updated
  }

  return { loans, loading, error, fetchLoans, createLoan, returnLoan }
}
