<!-- BookList.vue -->
<!-- Fetches all books and renders one BookCard per book. -->
<!-- Handles edit and delete actions and delegates to the useBooks composable. -->

<script setup>
import { onMounted, ref } from 'vue'
import { useBooks } from '../composables/useBooks'
import BookCard from './BookCard.vue'
import BookForm from './BookForm.vue'

const { books, loading, error, fetchBooks, createBook, updateBook, deleteBook } = useBooks()

// Track which book (if any) is currently being edited
const editingBook = ref(null)
const actionError = ref(null)

// onMounted runs once when this component is added to the page
onMounted(fetchBooks)

async function handleSubmit(bookData) {
  actionError.value = null
  try {
    if (editingBook.value) {
      await updateBook(editingBook.value.id, bookData)
      editingBook.value = null
    } else {
      await createBook(bookData)
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
    <BookForm
      :editingBook="editingBook"
      @submit="handleSubmit"
      @cancel="handleCancel"
    />

    <p v-if="actionError" class="action-error">{{ actionError }}</p>
    <p v-if="loading">Loading books...</p>
    <p v-else-if="error" class="action-error">{{ error }}</p>
    <p v-else-if="books.length === 0">No books yet. Add your first one above!</p>

    <!-- v-for renders one BookCard for each book in the list -->
    <BookCard
      v-else
      v-for="book in books"
      :key="book.id"
      :book="book"
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
</style>
