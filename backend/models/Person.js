// models/Person.js
// Data access layer for the persons table.

const pool = require('../config/database')

const Person = {

	// Get all people in the database.
	async getAll() {
		const result = await pool.query('SELECT id, name FROM persons ORDER BY name ASC')
		return result.rows
	},

	// Get a single person by ID.
	async getById(id) {
		const result = await pool.query('SELECT id, name FROM persons WHERE id = $1', [id])
		return result.rows[0] // rows is an array, but we expect only one match
	},

	// Create a new person — checks for duplicate names first (case-insensitive).
	async create(name) {
		const existing = await pool.query(
			'SELECT id FROM persons WHERE LOWER(name) = LOWER($1)',
			[name]
		)
		if (existing.rows.length > 0) {
			const error = new Error(`A person named "${name}" already exists`)
			error.status = 400
			throw error
		}

		const result = await pool.query(
			'INSERT INTO persons (name) VALUES ($1) RETURNING *',
			[name]
		)
		return result.rows[0]
	},
}

module.exports = Person