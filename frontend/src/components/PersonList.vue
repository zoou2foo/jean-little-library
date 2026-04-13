<!-- PersonList.vue -->
<!-- Displays all people with a delete button on each row. -->

<script setup>
import { onMounted, ref } from 'vue'
import { usePeople } from '../composables/usePeople'
import PersonForm from './PersonForm.vue'

const { people, loading, error, fetchPeople, createPerson, deletePerson } = usePeople()
const actionError = ref(null)

onMounted(fetchPeople)

async function handleSubmit(personData) {
  actionError.value = null
  try {
    await createPerson(personData)
  } catch (err) {
    actionError.value = err.message
  }
}

async function handleDelete(id) {
  if (!confirm('Remove this person?')) return
  actionError.value = null
  try {
    await deletePerson(id)
  } catch (err) {
    actionError.value = err.message
  }
}
</script>

<template>
  <div>
    <PersonForm @submit="handleSubmit" />

    <p v-if="actionError" class="action-error">{{ actionError }}</p>
    <p v-if="loading">Loading people...</p>
    <p v-else-if="error" class="action-error">{{ error }}</p>
    <p v-else-if="people.length === 0">No people added yet.</p>

    <ul v-else class="person-list">
      <li v-for="person in people" :key="person.id" class="person-row">
        <span>{{ person.name }}</span>
        <button @click="handleDelete(person.id)" class="btn-delete">Remove</button>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.person-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.person-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.65rem 1rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  margin-bottom: 0.5rem;
  background: #fff;
}

.btn-delete {
  padding: 0.3rem 0.75rem;
  background: #e74c3c;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.85rem;
}

.action-error {
  color: #e74c3c;
  margin-bottom: 0.75rem;
}
</style>
