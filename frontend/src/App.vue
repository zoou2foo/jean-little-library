<script setup>
// RouterLink renders a navigation link that works with Vue Router (no full page reload).
// RouterView is the slot where the matched view component gets rendered.
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <header>
    <nav>
      <span class="app-title">Jean's Little Library</span>
      <RouterLink to="/dashboard">Dashboard</RouterLink>
      <RouterLink to="/books">Books</RouterLink>
      <RouterLink to="/people">People</RouterLink>
      <RouterLink to="/loans">Loans</RouterLink>
    </nav>
  </header>

  <!-- The view component for the current route renders here -->
  <main>
    <RouterView />
  </main>
</template>

<style scoped>
header {
  background-color: #2c3e50;
  padding: 1rem 2rem;
}

nav {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.app-title {
  color: #fff;
  font-weight: bold;
  font-size: 1.1rem;
  margin-right: auto;
}

nav a {
  color: #ccc;
  text-decoration: none;
  font-size: 0.95rem;
}

nav a:hover,
nav a.router-link-active {
  color: #fff;
  text-decoration: underline;
}

main {
  padding: 2rem;
}
</style>
