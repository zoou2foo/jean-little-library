// useApi.js
// A generic fetch wrapper used by all other composables.
// It centralises the base URL and error handling in one place,
// so useBooks/useLoans/usePeople don't each repeat that logic.

const BASE_URL = 'http://localhost:5000/api'

// Sends an HTTP request and returns the parsed JSON response.
// method: 'GET' | 'POST' | 'PUT' | 'DELETE'
// body: optional JS object — will be serialised to JSON automatically
export async function apiRequest(path, method = 'GET', body = null) {
  const options = {
    method,
    headers: { 'Content-Type': 'application/json' },
  }

  if (body) {
    options.body = JSON.stringify(body)
  }

  const response = await fetch(`${BASE_URL}${path}`, options)

  // If the server returned an error status (4xx, 5xx),
  // parse the error message and throw so the caller can catch it.
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    const message = errorData.error || `Request failed with status ${response.status}`
    throw new Error(message)
  }

  return response.json()
}
