<!-- LoanList.vue -->
<!-- Shows all active loans with a "Mark Returned" button on each. -->

<script setup>
import { onMounted, ref } from 'vue'
import { useLoans } from '../composables/useLoans'
import { useBooks } from '../composables/useBooks'
import { usePeople } from '../composables/usePeople'
import LoanForm from './LoanForm.vue'

const { loans, loading, error, fetchLoans, createLoan, returnLoan } = useLoans()
const { books, fetchBooks } = useBooks()
const { people, fetchPeople } = usePeople()
const actionError = ref(null)

// Fetch all three lists when this component mounts
onMounted(async () => {
  await Promise.all([fetchLoans(), fetchBooks(), fetchPeople()])
})

async function handleSubmit(loanData) {
  actionError.value = null
  try {
    await createLoan(loanData)
  } catch (err) {
    actionError.value = err.message
  }
}

async function handleReturn(loanId) {
  if (!confirm('Mark this book as returned?')) return
  actionError.value = null
  try {
    await returnLoan(loanId)
  } catch (err) {
    actionError.value = err.message
  }
}
</script>

<template>
  <div>
    <LoanForm :books="books" :people="people" @submit="handleSubmit" />

    <h3>Active Loans</h3>
    <p v-if="actionError" class="action-error">{{ actionError }}</p>
    <p v-if="loading">Loading loans...</p>
    <p v-else-if="error" class="action-error">{{ error }}</p>
    <p v-else-if="loans.length === 0">No active loans right now.</p>

    <ul v-else class="loan-list">
      <li v-for="loan in loans" :key="loan.id" class="loan-row">
        <div class="loan-info">
          <strong>{{ loan.book_title }}</strong>
          <span>by {{ loan.book_author }}</span>
          <span class="loan-meta">
            Borrowed by <strong>{{ loan.person_name }}</strong>
            on {{ loan.borrowed_date }}
          </span>
        </div>
        <button @click="handleReturn(loan.id)" class="btn-return">Mark Returned</button>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.loan-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.loan-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  margin-bottom: 0.5rem;
  background: #fff;
}

.loan-info {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.loan-info span {
  color: #555;
  font-size: 0.9rem;
}

.loan-meta {
  color: #888;
  font-size: 0.85rem;
}

.btn-return {
  padding: 0.3rem 0.75rem;
  background: #27ae60;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.85rem;
  white-space: nowrap;
}

.action-error {
  color: #e74c3c;
  margin-bottom: 0.75rem;
}
</style>
