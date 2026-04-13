// useBooks.js
// Manages all book-related state and API calls.
// Any component that imports this composable shares the same reactive state.

import { ref } from 'vue'
import { apiRequest } from './useApi'

// ref() creates a reactive variable — when it changes, any component
// that uses it will automatically re-render.
const books = ref([])
const loading = ref(false)
const error = ref(null)

export function useBooks() {

  async function fetchBooks() {
    loading.value = true
    error.value = null
    try {
      books.value = await apiRequest('/books')
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  async function createBook(bookData) {
    const newBook = await apiRequest('/books', 'POST', bookData)
    // Add the new book to the local list without re-fetching everything.
    books.value.push(newBook)
    return newBook
  }

  async function updateBook(id, bookData) {
    const updated = await apiRequest(`/books/${id}`, 'PUT', bookData)
    // Find the book in the local list and replace it with the updated version.
    const index = books.value.findIndex(b => b.id === id)
    if (index !== -1) books.value[index] = updated
    return updated
  }

  async function deleteBook(id) {
    await apiRequest(`/books/${id}`, 'DELETE')
    // Remove the deleted book from the local list.
    books.value = books.value.filter(b => b.id !== id)
  }

  return { books, loading, error, fetchBooks, createBook, updateBook, deleteBook }
}
