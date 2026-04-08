// controllers/personController.js
// Handles the business logic for all person-related HTTP requests.
// Each function receives (req, res, next) from Express.

const Person = require('../models/Person')

const personController = {
	// GET /api/people
	async getAll(req, res, next) {
		try {
			const persons = await Person.getAll()
			res.json(persons)
		} catch (err) {
			next(err)
		}
	},

	// GET /api/people/:id
	async getById(req, res, next) {
		try {
			const person = await Person.getById(req.params.id)
			if (!person) {
				return res.status(404).json({ error: 'Person not found' })
			}
			res.json(person)
		} catch (err) {
			next(err)
		}
	},

	// POST /api/people
	async create(req, res, next) {
		try {
			const { name } = req.body
			if (!name) {
				return res.status(400).json({ error: 'Name is required' })
			}
			const person = await Person.create(name)
			res.status(201).json(person)
		} catch (err) {
			next(err)
		}
	},
}

module.exports = personController