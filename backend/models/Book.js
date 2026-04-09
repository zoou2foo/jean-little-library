// models/Book.js
// Data access layer for the books table.

const pool = require('../config/database')

const Book = {

  // Get all non-archived books in the database.
  async getAll() {
	const result = await pool.query('SELECT id, title, author, isbn FROM books WHERE archived = FALSE ORDER BY title ASC')
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

  // Soft-delete: archive a book instead of removing it.
  // If the book is currently on loan, block the action entirely.
  // If it has past loan history, archive it so the history is preserved.
  // If it has no history at all, hard-delete it since there's nothing to preserve.
  async delete(id) {
    // Always block if the book is currently out on loan
    const activeLoanCheck = await pool.query(
      'SELECT id FROM loans WHERE book_id = $1 AND returned_date IS NULL',
      [id]
    )
    if (activeLoanCheck.rows.length > 0) {
      const error = new Error('Cannot delete a book that is currently on loan')
      error.status = 400
      throw error
    }

    // If the book has past loan history, archive it instead of deleting
    const historyCheck = await pool.query(
      'SELECT id FROM loans WHERE book_id = $1',
      [id]
    )
    if (historyCheck.rows.length > 0) {
      const result = await pool.query(
        'UPDATE books SET archived = TRUE WHERE id = $1 RETURNING *',
        [id]
      )
      return result.rows[0]
    }

    // No loan history at all — safe to hard-delete
    const result = await pool.query(
      'DELETE FROM books WHERE id = $1 RETURNING *',
      [id]
    )
    return result.rows[0]
  },

}

module.exports = Book