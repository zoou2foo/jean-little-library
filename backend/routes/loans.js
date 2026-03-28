// routes/loans.js
// Maps HTTP method + URL pattern to the correct controller function.

const express = require('express')
const router = express.Router()
const loanController = require('../controllers/loanController')

router.get('/', loanController.getActive) // GET /api/loans
router.get('/person/:personId', loanController.getByPerson) // GET /api/loans/person/:personId
router.post('/', loanController.create) // POST /api/loans
router.post('/:id/return', loanController.markReturned) // POST /api/loans/:id/return

module.exports = router