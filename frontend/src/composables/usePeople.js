// usePeople.js
// Manages all people-related state and API calls.

import { ref } from 'vue'
import { apiRequest } from './useApi'

const people = ref([])
const loading = ref(false)
const error = ref(null)

export function usePeople() {

  async function fetchPeople() {
    loading.value = true
    error.value = null
    try {
      people.value = await apiRequest('/people')
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  async function createPerson(personData) {
    const newPerson = await apiRequest('/people', 'POST', personData)
    people.value.push(newPerson)
    return newPerson
  }

  async function deletePerson(id) {
    await apiRequest(`/people/${id}`, 'DELETE')
    people.value = people.value.filter(p => p.id !== id)
  }

  return { people, loading, error, fetchPeople, createPerson, deletePerson }
}
