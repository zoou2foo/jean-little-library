<!-- LoanForm.vue -->
<!-- Lets the user select a book and a person, then log a new loan. -->
<!-- Books and people lists are passed in as props from the parent. -->

<script setup>
import { ref } from 'vue'

const props = defineProps({
  books: { type: Array, required: true },
  people: { type: Array, required: true },
})

const emit = defineEmits(['submit'])

const selectedBookId = ref('')
const selectedPersonId = ref('')
const borrowedDate = ref(new Date().toISOString().split('T')[0]) // default to today
const formError = ref(null)

function handleSubmit() {
  formError.value = null

  if (!selectedBookId.value || !selectedPersonId.value || !borrowedDate.value) {
    formError.value = 'Please select a book, a person, and a date.'
    return
  }

  emit('submit', {
    book_id: Number(selectedBookId.value),
    person_id: Number(selectedPersonId.value),
    borrowed_date: borrowedDate.value,
  })

  selectedBookId.value = ''
  selectedPersonId.value = ''
  borrowedDate.value = new Date().toISOString().split('T')[0]
}
</script>

<template>
  <form @submit.prevent="handleSubmit" class="loan-form">
    <h3>Log a New Loan</h3>
    <p v-if="formError" class="form-error">{{ formError }}</p>

    <label>
      Book *
      <!-- v-model binds the dropdown value to selectedBookId -->
      <select v-model="selectedBookId">
        <option value="" disabled>Select a book</option>
        <option v-for="book in books" :key="book.id" :value="book.id">
          {{ book.title }} — {{ book.author }}
        </option>
      </select>
    </label>

    <label>
      Borrower *
      <select v-model="selectedPersonId">
        <option value="" disabled>Select a person</option>
        <option v-for="person in people" :key="person.id" :value="person.id">
          {{ person.name }}
        </option>
      </select>
    </label>

    <label>
      Borrowed Date *
      <input v-model="borrowedDate" type="date" />
    </label>

    <button type="submit">Log Loan</button>
  </form>
</template>

<style scoped>
.loan-form {
  background: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 1.25rem;
  margin-bottom: 1.5rem;
}

h3 { margin-top: 0; margin-bottom: 1rem; }

label {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  margin-bottom: 0.75rem;
  font-size: 0.9rem;
  font-weight: 600;
}

select, input[type='date'] {
  padding: 0.45rem 0.65rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 0.95rem;
  font-weight: normal;
  background: #fff;
}

button {
  padding: 0.45rem 1rem;
  background: #27ae60;
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
