// controllers/loanController.js
// Handles the business logic for all loan-related HTTP requests.
// Each function receives (req, res, next) from Express.

const Loan = require('../models/Loan')

const loanController = {
	// GET /api/loans
	// returns all active loans (where returned_date IS NULL).
	async getActive(req, res, next) {
		try {
			const loans = await Loan.getActive()
			res.json(loans)
		} catch (err) {
			next(err)
		}
	},

	// GET /api/loans/person/:personId
	// returns the full loan history for a single person (active + returned).
	async getByPerson(req, res, next) {
		try {
			const loans = await Loan.getByPerson(req.params.personId)
			res.json(loans)
		} catch (err) {
			next(err)
		}
	},

	// POST /api/loans
	// Creates a new loan — but first confirms the book isn't already out.
	async create(req, res, next) {
		try {
			const { book_id, person_id, borrowed_date } = req.body
			
			if (!book_id || !person_id || !borrowed_date) {
				return res.status(400).json({ error: 'book_id, person_id, and borrowed_date are required' })
			}
			const newLoan = await Loan.create(book_id, person_id, borrowed_date)
			res.status(201).json(newLoan)
		} catch (err) {
			next(err)
		}
	},

	// POST /api/loans/:id/return
	// Marks a loan as returned by setting the returned_date.
	async markReturned(req, res, next) {
		try {
			const { returned_date } = req.body
			if (!returned_date) {
				return res.status(400).json({ error: 'returned_date is required' })
			}
			const updatedLoan = await Loan.markReturned(req.params.id, returned_date)
			if (!updatedLoan) {
				// Either the loan id doesn't exist, or it's already marked as returned.
				return res.status(404).json({ error: 'Active loan not found' })
			}
			res.json(updatedLoan)
		} catch (err) {
			next(err)
		}
	},
}

module.exports = loanController