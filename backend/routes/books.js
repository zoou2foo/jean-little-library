// routes/books.js
// Maps HTTP method + URL pattern to the correct controller function.

const express = require('express')
const router = express.Router()
const bookController = require('../controllers/bookController')

router.get('/', bookController.getAll) // GET /api/books
router.get('/:id', bookController.getById) // GET /api/books/:id
router.post('/', bookController.create) // POST /api/books
router.put('/:id', bookController.update) // PUT /api/books/:id
router.delete('/:id', bookController.delete) // DELETE /api/books/:id

module.exports = router