// seedData.js
// Run with: node database/seeds/seedData.js (from inside the backend/ folder)
// This script inserts sample people, books, and loans into the database.
// Safe to run multiple times — it clears existing data first.

require('dotenv').config()
const pool = require('../../config/database')

async function seed() {
  const client = await pool.connect()

  try {
    console.log('Seeding database...')

    // We use a transaction so that if any insert fails,
    // ALL inserts are rolled back and the database stays clean.
    await client.query('BEGIN')

    // --- Clear existing data (order matters: loans reference books and persons) ---
    await client.query('DELETE FROM loans')
    await client.query('DELETE FROM books')
    await client.query('DELETE FROM persons')

    // Reset auto-increment counters so IDs start from 1 each time
    await client.query('ALTER SEQUENCE persons_id_seq RESTART WITH 1')
    await client.query('ALTER SEQUENCE books_id_seq RESTART WITH 1')
    await client.query('ALTER SEQUENCE loans_id_seq RESTART WITH 1')

    // --- Insert persons ---
    // $1, $2 are placeholders — values are passed as the second argument (array).
    // This is called a "parameterized query" and prevents SQL injection.
    const personResult = await client.query(
      'INSERT INTO persons (name) VALUES ($1), ($2), ($3) RETURNING id, name',
      ['Marie Tremblay', 'Lucas Bouchard', 'Sophie Gauthier']
    )
    console.log('Inserted persons:', personResult.rows.map(p => p.name))

    // --- Insert books ---
    const bookResult = await client.query(
      `INSERT INTO books (title, author, isbn) VALUES
        ($1, $2, $3),
        ($4, $5, $6),
        ($7, $8, $9),
        ($10, $11, $12),
        ($13, $14, $15)
       RETURNING id, title`,
      [
        'The Hobbit',               'J.R.R. Tolkien',       '978-0547928227',
        'Dune',                     'Frank Herbert',         '978-0441013593',
        'The Night Circus',         'Erin Morgenstern',      '978-0385534635',
        'Project Hail Mary',        'Andy Weir',             '978-0593135204',
        'The Midnight Library',     'Matt Haig',             '978-0525559474',
      ]
    )
    console.log('Inserted books:', bookResult.rows.map(b => b.title))

    // --- Insert loans ---
    // Marie borrowed "The Hobbit" (book id 1) — still out (no returned_date)
    // Lucas borrowed "Dune" (book id 2) — still out
    await client.query(
      `INSERT INTO loans (book_id, person_id, borrowed_date) VALUES
        ($1, $2, $3),
        ($4, $5, $6)`,
      [
        1, 1, '2026-03-10',   // Marie borrowed The Hobbit
        2, 2, '2026-03-15',   // Lucas borrowed Dune
      ]
    )
    console.log('Inserted 2 active loans')

    await client.query('COMMIT')
    console.log('\nDatabase seeded successfully!')

  } catch (err) {
    await client.query('ROLLBACK')
    console.error('Seed failed, transaction rolled back:', err.message)
    process.exit(1)
  } finally {
    client.release()
    pool.end()
  }
}

seed()
