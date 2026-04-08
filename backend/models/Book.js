// models/Book.js
// Data access layer for the books table.

const pool = require('../config/database')

const Book = {

  // Get all books in the database.
  async getAll() {
	const result = await pool.query('SELECT id, title, author, isbn FROM books ORDER BY title ASC')
	return result.rows
  },

  // Get a single book by ID.
  async getById(id) {
	const result = await pool.query('SELECT id, title, author, isbn FROM books WHERE id = $1', [id])
	return result.rows[0] // rows is an array, but we expect only one match
  },
  
  // Create a new book.
  // ISBN is optional — only checks for duplicates when one is provided.
  async create(title, author, isbn) {
    if (isbn) {
      const existing = await pool.query(
        'SELECT id FROM books WHERE LOWER(isbn) = LOWER($1)',
        [isbn]
      )
      if (existing.rows.length > 0) {
        const error = new Error(`A book with ISBN "${isbn}" already exists`)
        error.status = 400
        throw error
      }
    }

    const result = await pool.query(
      'INSERT INTO books (title, author, isbn) VALUES ($1, $2, $3) RETURNING *',
      [title, author, isbn || null]
    )
    return result.rows[0]
  },

  // Update an existing book. Returns the updated row, or undefined if not found.
  async update(id, title, author, isbn) {
    const result = await pool.query(
      `UPDATE books
          SET title = $1, author = $2, isbn = $3
        WHERE id = $4
       RETURNING *`,
      [title, author, isbn || null, id]
    )
    return result.rows[0]
  },

  // Delete a book — but only if it has no active loans.
  // This enforces a business rule at the data layer so no other code can bypass it.
  async delete(id) {
    const loanCheck = await pool.query(
      'SELECT id FROM loans WHERE book_id = $1 AND returned_date IS NULL',
      [id]
    )
    if (loanCheck.rows.length > 0) {
      const error = new Error('Cannot delete a book that is currently on loan')
      error.status = 400
      throw error
    }

    const result = await pool.query(
      'DELETE FROM books WHERE id = $1 RETURNING *',
      [id]
    )
    return result.rows[0]
  },

}

module.exports = Book