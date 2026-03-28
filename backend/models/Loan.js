// models/Loan.js
// Data access layer for the loans table.

const pool = require('../config/database')

const Loan = {

  // Get all active loans (returned_date IS NULL).
  // We JOIN books and persons so the caller gets all useful info in one query
  // instead of having to make three separate queries.
  async getActive() {
    const result = await pool.query(
      `SELECT
          loans.id,
          loans.borrowed_date,
          books.id   AS book_id,
          books.title AS book_title,
          books.author AS book_author,
          persons.id   AS person_id,
          persons.name AS person_name
        FROM loans
        JOIN books   ON loans.book_id   = books.id
        JOIN persons ON loans.person_id = persons.id
        WHERE loans.returned_date IS NULL
        ORDER BY loans.borrowed_date ASC`
    )
    return result.rows
  },

  // Get the full loan history for a single person (active + returned).
  async getByPerson(personId) {
    const result = await pool.query(
      `SELECT
          loans.id,
          loans.borrowed_date,
          loans.returned_date,
          books.id    AS book_id,
          books.title AS book_title,
          books.author AS book_author
        FROM loans
        JOIN books ON loans.book_id = books.id
        WHERE loans.person_id = $1
        ORDER BY loans.borrowed_date DESC`,
      [personId]
    )
    return result.rows
  },

  // Create a new loan — but first confirm the book isn't already out.
  async create(bookId, personId, borrowedDate) {
    const activeCheck = await pool.query(
      'SELECT id FROM loans WHERE book_id = $1 AND returned_date IS NULL',
      [bookId]
    )
    if (activeCheck.rows.length > 0) {
      const error = new Error('This book is already on loan')
      error.status = 400
      throw error
    }

    const result = await pool.query(
      `INSERT INTO loans (book_id, person_id, borrowed_date)
        VALUES ($1, $2, $3)
       RETURNING *`,
      [bookId, personId, borrowedDate]
    )
    return result.rows[0]
  },

  // Mark a loan as returned by setting returned_date.
  // Also updates updated_at so we have an audit trail.
  async markReturned(loanId, returnedDate) {
    const result = await pool.query(
      `UPDATE loans
          SET returned_date = $1, updated_at = NOW()
        WHERE id = $2 AND returned_date IS NULL
       RETURNING *`,
      [returnedDate, loanId]
    )
    return result.rows[0] // undefined if loan wasn't found or already returned
  },

}

module.exports = Loan