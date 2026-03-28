// controllers/bookController.js
// Handles the business logic for all book-related HTTP requests.
// Each function receives (req, res, next) from Express.

const Book = require('../models/Book')

const bookController = {
	// GET /api/books
	async getAll(req, res, next) {
		try {
			const books = await Book.getAll()
			res.json(books)
		} catch (err) {
			next(err)
		}
	},

	// GET /api/books/:id
	async getById(req, res, next) {
		try {
			const book = await Book.getById(req.params.id)
			if (!book) {
				return res.status(404).json({ error: 'Book not found' })
			}
			res.json(book)
		} catch (err) {
			next(err)
		}
	},

	// POST /api/books
	async create(req, res, next) {
		try {
			const { title, author, isbn } = req.body
			if (!title || !author) {
				return res.status(400).json({ error: 'Title and author are required' })
			}
			const book = await Book.create(title, author, isbn)
			res.status(201).json(book)
		} catch (err) {
			next(err)
		}
	},

	// PUT /api/books/:id
	async update(req, res, next) {
		try {
			const { title, author, isbn } = req.body
			if (!title || !author) {
				return res.status(400).json({ error: 'Title and author are required' })
			}
			const book = await Book.update(req.params.id, title, author, isbn)
			if (!book) {
				return res.status(404).json({ error: 'Book not found' })
			}
			res.json(book)
		} catch (err) {
			next(err)
		}
	},

	// DELETE /api/books/:id
	async delete(req, res, next) {
		try {
			const book = await Book.delete(req.params.id)
			if (!book) {
				return res.status(404).json({ error: 'Book not found' })
			}
			res.json({ message: 'Book deleted successfully', book })
		} catch (err) {
			next(err)
		}
	},
}

module.exports = bookController