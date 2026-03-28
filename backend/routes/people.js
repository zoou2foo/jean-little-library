// routes/people.js
// Maps HTTP method + URL pattern to the correct controller function.

const express = require('express')
const router = express.Router()
const personController = require('../controllers/personController')

router.get('/', personController.getAll) // GET /api/people
router.get('/:id', personController.getById) // GET /api/people/:id
router.post('/', personController.create) // POST /api/people

module.exports = router