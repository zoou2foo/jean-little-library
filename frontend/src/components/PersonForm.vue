<!-- PersonForm.vue -->
<!-- Simple form to add a new person (friend or family member). -->

<script setup>
import { ref } from 'vue'

const emit = defineEmits(['submit'])

const name = ref('')
const formError = ref(null)

function handleSubmit() {
  formError.value = null
  if (!name.value.trim()) {
    formError.value = 'Name is required.'
    return
  }
  emit('submit', { name: name.value.trim() })
  name.value = ''
}
</script>

<template>
  <form @submit.prevent="handleSubmit" class="person-form">
    <h3>Add a Person</h3>
    <p v-if="formError" class="form-error">{{ formError }}</p>
    <label>
      Name *
      <input v-model="name" type="text" placeholder="e.g. Alice" />
    </label>
    <button type="submit">Add Person</button>
  </form>
</template>

<style scoped>
.person-form {
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

input {
  padding: 0.45rem 0.65rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 0.95rem;
  font-weight: normal;
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
