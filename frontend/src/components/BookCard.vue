<!-- BookCard.vue -->
<!-- Displays a single book's details with Edit and Delete buttons. -->
<!-- Props flow IN from the parent (BookList). Events flow OUT to the parent via emit. -->

<script setup>
const props = defineProps({
  book: { type: Object, required: true },
})

// emit lets this component tell its parent "the user clicked edit/delete on this book"
const emit = defineEmits(['edit', 'delete'])
</script>

<template>
  <div class="book-card">
    <div class="book-info">
      <strong>{{ book.title }}</strong>
      <span class="author">{{ book.author }}</span>
      <span v-if="book.isbn" class="isbn">ISBN: {{ book.isbn }}</span>
    </div>
    <div class="book-actions">
      <button @click="emit('edit', book)" class="btn-edit">Edit</button>
      <button @click="emit('delete', book.id)" class="btn-delete">Remove</button>
    </div>
  </div>
</template>

<style scoped>
.book-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  margin-bottom: 0.5rem;
  background: #fff;
}

.book-info {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.author {
  color: #555;
  font-size: 0.9rem;
}

.isbn {
  color: #999;
  font-size: 0.8rem;
}

.book-actions {
  display: flex;
  gap: 0.5rem;
}

button {
  padding: 0.3rem 0.75rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.85rem;
}

.btn-edit {
  background: #3498db;
  color: white;
}

.btn-delete {
  background: #e74c3c;
  color: white;
}
</style>
