-- Migration: 001_initial_schema
-- Created: 2026-03-27
-- Description: Creates the initial tables for Jean Little Library app

-- TABLE: persons
-- Stores the friends and family who can borrow books
CREATE TABLE IF NOT EXISTS persons (
	id SERIAL PRIMARY KEY,
	name VARCHAR(255) NOT NULL,
	created_at TIMESTAMP DEFAULT NOW()
);

-- TABLE: books
-- Stores the books in my personal library collection
CREATE TABLE IF NOT EXISTS books (
	id SERIAL PRIMARY KEY,
	title VARCHAR(255) NOT NULL,
	author VARCHAR(255) NOT NULL,
	isbn VARCHAR(20),
	created_at TIMESTAMP DEFAULT NOW()
);

-- TABLE: loans
-- Tracks which books was borrowed by which person and when
CREATE TABLE IF NOT EXISTS loans (
	id SERIAL PRIMARY KEY,
	book_id INTEGER NOT NULL REFERENCES books(id) ON DELETE RESTRICT,
	person_id INTEGER NOT NULL REFERENCES persons(id) ON DELETE RESTRICT,
	borrowed_date DATE NOT NULL,
	returned_date DATE,
	created_at TIMESTAMP DEFAULT NOW(),
	updated_at TIMESTAMP DEFAULT NOW()
);