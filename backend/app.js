require('dotenv').config()

const express = require('express')
const cors = require('cors')

const app = express()

// --- Middleware ---
// cors() allows the Vue frontend (running on a different port) to call this API.
// express.json() parses incoming request bodies as JSON automatically.
app.use(cors())
app.use(express.json())

// --- Health check route ---
// A simple route to confirm the server is reachable.
app.get('/', (req, res) => {
  res.json({ message: 'Server is running' })
})

const errorHandler = require('./middleware/errorHandler')

// --- API Routes ---
// These will be added in Step 5, one by one.
// They'll look like: app.use('/api/books', require('./routes/books'))
app.use('/api/books', require('./routes/books'))
app.use('/api/people', require('./routes/people'))
app.use('/api/loans', require('./routes/loans'))

// --- Error handler (must be last) ---
app.use(errorHandler)

module.exports = app
