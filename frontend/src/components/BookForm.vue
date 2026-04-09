<!-- BookForm.vue -->
<!-- Add a new book or edit an existing one. -->
<!-- When editingBook prop is provided, the form pre-fills with that book's data. -->

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  // When null, the form is in "add" mode. When a book object, it's in "edit" mode.
  editingBook: { type: Object, default: null },
})

const emit = defineEmits(['submit', 'cancel'])

// Form field state — ref() makes each value reactive
const title = ref('')
const author = ref('')
const isbn = ref('')
const formError = ref(null)

// watch() runs whenever editingBook changes.
// If a book is passed in for editing, pre-fill the form fields with its data.
watch(
  () => props.editingBook,
  (book) => {
    if (book) {
      title.value = book.title
      author.value = book.author
      isbn.value = book.isbn || ''
    } else {
      title.value = ''
      author.value = ''
      isbn.value = ''
    }
    formError.value = null
  },
  { immediate: true }
)

function handleSubmit() {
  formError.value = null

  if (!title.value.trim() || !author.value.trim()) {
    formError.value = 'Title and author are required.'
    return
  }

  emit('submit', {
    title: title.value.trim(),
    author: author.value.trim(),
    isbn: isbn.value.trim() || null,
  })

  // Reset form after successful submit (only in add mode)
  if (!props.editingBook) {
    title.value = ''
    author.value = ''
    isbn.value = ''
  }
}
</script>

<template>
  <form @submit.prevent="handleSubmit" class="book-form">
    <h3>{{ editingBook ? 'Edit Book' : 'Add a Book' }}</h3>

    <p v-if="formError" class="form-error">{{ formError }}</p>

    <label>
      Title *
      <input v-model="title" type="text" placeholder="e.g. The Hobbit" />
    </label>

    <label>
      Author *
      <input v-model="author" type="text" placeholder="e.g. J.R.R. Tolkien" />
    </label>

    <label>
      ISBN (optional)
      <input v-model="isbn" type="text" placeholder="e.g. 978-0-395-07122-1" />
    </label>

    <div class="form-buttons">
      <button type="submit">{{ editingBook ? 'Save Changes' : 'Add Book' }}</button>
      <button v-if="editingBook" type="button" @click="emit('cancel')" class="btn-cancel">
        Cancel
      </button>
    </div>
  </form>
</template>

<style scoped>
.book-form {
  background: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 1.25rem;
  margin-bottom: 1.5rem;
}

h3 {
  margin-top: 0;
  margin-bottom: 1rem;
}

label {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  margin-bottom: 0.75rem;
  font-size: 0.9rem;
  font-weight: 600;
}

input {
  padding: 0.45rem 0.65rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 0.95rem;
  font-weight: normal;
}

.form-buttons {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

button[type='submit'] {
  padding: 0.45rem 1rem;
  background: #27ae60;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.btn-cancel {
  padding: 0.45rem 1rem;
  background: #95a5a6;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.form-error {
  color: #e74c3c;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
}
</style>
