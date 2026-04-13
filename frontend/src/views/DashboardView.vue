<script setup>
import { computed, onMounted } from 'vue'
import { useBooks } from '../composables/useBooks'
import { usePeople } from '../composables/usePeople'
import { useLoans } from '../composables/useLoans'

const { books, fetchBooks } = useBooks()
const { people, fetchPeople } = usePeople()
const { loans, fetchLoans } = useLoans()

// Fetch all three in parallel when the Dashboard mounts.
onMounted(() => Promise.all([fetchBooks(), fetchPeople(), fetchLoans()]))

// computed() derives a value from reactive state.
// Whenever books.value changes, totalBooks recalculates automatically.
const totalBooks = computed(() => books.value.length)
const totalPeople = computed(() => people.value.length)
const activeLoans = computed(() => loans.value.length)
</script>

<template>
  <div>
    <h1>Dashboard</h1>
    <p class="subtitle">Welcome to Jean's Little Library</p>

	<div class="stats-grid">
		<div class="stat-card">
			<span class="stat-number">{{ totalBooks }}</span>
			<span class="stat-label">Books in Collection</span>
		</div>
		<div class="stat-card">
			<span class="stat-number">{{ activeLoans }}</span>
			<span class="stat-label">Active Loans</span>
		</div>
		<div class="stat-card">
			<span class="stat-number">{{ totalPeople }}</span>
			<span class="stat-label">People</span>
		</div>
	</div>
  </div>
</template>

<style scoped>
.subtitle {
  color: #666;
  margin-top: -0.5rem;
  margin-bottom: 2rem;
}

.stats-grid {
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.stat-card {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	background: #fff;
	border: 1px solid #ddd;
	border-radius: 10px;
	padding: 2rem 3rem;
	min-width: 150px;
	gap: 0.5rem;
}

.stat-number {
	font-size: 2.5rem;
	font-weight: bold;
	color: #2c3e50;
}

.stat-label {
	font-size: 0.9rem;
	color: #777;
	text-align: center;
}
</style>
