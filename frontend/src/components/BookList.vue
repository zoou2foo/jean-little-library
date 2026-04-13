<!-- BookList.vue -->
<!-- Fetches all books and renders one BookCard per book. -->
<!-- Handles edit and delete actions and delegates to the useBooks composable. -->

<script setup>
import { onMounted, ref, computed } from 'vue'
import { useBooks } from '../composables/useBooks'
import { useLoans } from '../composables/useLoans'
import BookCard from './BookCard.vue'
import BookForm from './BookForm.vue'

const { books, loading, error, fetchBooks, createBook, updateBook, deleteBook } = useBooks()
const { loans, fetchLoans } = useLoans()
const onLoanBookIds = computed(() => new Set(loans.value.map(l => l.book_id)))

const searchQuery = ref('')
const filteredBooks = computed(() =>
  books.value.filter(b =>
    b.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    b.author.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
)

// Track which book (if any) is currently being edited
const editingBook = ref(null)
const actionError = ref(null)
const successMessage = ref(null)

function showSuccess(msg) {
  successMessage.value = msg
  setTimeout(() => successMessage.value = null, 3000)
}

// onMounted runs once when this component is added to the page
onMounted(() => Promise.all([fetchBooks(), fetchLoans()]))

async function handleSubmit(bookData) {
  actionError.value = null
  try {
    if (editingBook.value) {
      await updateBook(editingBook.value.id, bookData)
      editingBook.value = null
      showSuccess('Book updated!')
    } else {
      await createBook(bookData)
      showSuccess('Book added!')
    }
  } catch (err) {
    actionError.value = err.message
  }
}

async function handleDelete(id) {
  if (!confirm('Remove this book? If it has loan history it will be archived, otherwise it will be permanently deleted.')) return
  actionError.value = null
  try {
    await deleteBook(id)
    showSuccess('Book removed.')
  } catch (err) {
    actionError.value = err.message
  }
}

function handleEdit(book) {
  editingBook.value = book
}

function handleCancel() {
  editingBook.value = null
  actionError.value = null
}
</script>

<template>
  <div>
    <input
      v-model="searchQuery"
      type="text"
      placeholder="Search by title or author..."
      class="search-input"
    />

    <BookForm
      :editingBook="editingBook"
      @submit="handleSubmit"
      @cancel="handleCancel"
    />

    <p v-if="successMessage" class="success-banner">{{ successMessage }}</p>
    <p v-if="actionError" class="action-error">{{ actionError }}</p>
    <p v-if="loading">Loading books...</p>
    <p v-else-if="error" class="action-error">{{ error }}</p>
    <p v-else-if="filteredBooks.length === 0 && searchQuery">No books match your search.</p>
    <p v-else-if="books.length === 0">No books yet. Add your first one above!</p>

    <!-- v-for renders one BookCard for each book in the list -->
    <BookCard
      v-else
      v-for="book in filteredBooks"
      :key="book.id"
      :book="book"
	  :isOnLoan="onLoanBookIds.has(book.id)"
      @edit="handleEdit"
      @delete="handleDelete"
    />
  </div>
</template>

<style scoped>
.action-error {
  color: #e74c3c;
  margin-bottom: 0.75rem;
}

.success-banner {
  color: #27ae60;
  background: #eafaf1;
  border: 1px solid #a9dfbf;
  border-radius: 4px;
  padding: 0.5rem 0.75rem;
  margin-bottom: 0.75rem;
}

.search-input {
  width: 100%;
  padding: 0.5rem 0.75rem;
  margin-bottom: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 0.95rem;
  box-sizing: border-box;
}
</style>
