# COMPREHENSIVE PROJECT PLAN: Book Tracking Application

## Executive Summary

You're building a **Book Tracking App** to manage books you own and loans to friends/family. This project teaches you Vue.js 3 (Composition API) frontend development, Node.js/Express backend patterns, and PostgreSQL database design-all through hands-on implementation of a real, usable product.

**Tech Stack**:
- **Frontend**: Vue 3 (Composition API) with Vite
- **Backend**: Node.js + Express.js
- **Database**: PostgreSQL
- **Development**: Local development environment (no deployment initially)

---

## Feature Set: MVP Scope

### Core Features (Phase 1-2)
1. **Book Management**
   - Add books to your collection (title, author, ISBN, notes)
   - View all books with search/filter
   - Edit book details
   - Delete books (only if no active loans)

2. **Loan Tracking**
   - Log a book as borrowed (select book, select person, record date)
   - View active loans by person
   - Mark book as returned (auto-close loan)
   - View loan history (archived loans)

3. **People Management**
   - Add friends/family members
   - View loans by person
   - Track borrowing history per person

### Out of Scope (Future/Phase 3+)
- User authentication (assume single-user for now)
- Email notifications or reminders
- Recommendations based on reading history
- Book cover images or external API integration
- Mobile app
- Public book sharing

---

## Architecture Overview

### Frontend Architecture (Vue 3 Composition API)

**Key Patterns You'll Learn:**
- Component composition with `<script setup>` syntax
- State management with `ref()` and `reactive()`
- Computed properties and watchers
- Lifecycle hooks (`onMounted`, `onBeforeUnmount`)
- Props and event emitting for component communication
- Async handling with `fetch()` and error states
- Form handling and validation

**Component Structure:**
```text
src/
  ├── components/
  │   ├── BookForm.vue          (Add/Edit book form)
  │   ├── BookList.vue          (Display all books with filters)
  │   ├── BookCard.vue          (Individual book display)
  │   ├── LoanForm.vue          (Create new loan)
  │   ├── LoanList.vue          (View active/returned loans)
  │   ├── PersonList.vue        (Friends/family management)
  │   └── PersonForm.vue        (Add person)
  ├── views/
  │   ├── BooksView.vue         (Book management page)
  │   ├── LoansView.vue         (Loan tracking page)
  │   ├── PeopleView.vue        (People management page)
  │   ├── DashboardView.vue     (Overview/stats page)
  │   └── App.vue               (Main layout with nav)
  ├── composables/
  │   ├── useBooks.js           (Book data fetching and state)
  │   ├── useLoans.js           (Loan data fetching and state)
  │   └── usePeople.js          (People data fetching and state)
  └── main.js
```

**Key Composables to Build** (reusable logic):
- `useBooks()`: Fetch books, add, update, delete
- `useLoans()`: Fetch loans, create loan, return book
- `usePeople()`: Manage people (friends/family)
- `useApi()`: Generic wrapper for API calls with error handling

### Backend Architecture (Node.js + Express)

**Key Patterns You'll Learn:**
- Express middleware (routing, body parsing, error handling)
- MVC pattern (Models = database, Controllers = business logic, Routes = endpoints)
- REST API design principles
- Database queries and relationships
- Error handling and status codes
- Request validation

**Folder Structure:**
```text
backend/
  ├── config/
  │   └── database.js           (PostgreSQL connection setup)
  ├── models/
  │   ├── Book.js               (Book table + queries)
  │   ├── Loan.js               (Loan table + queries)
  │   └── Person.js             (Person table + queries)
  ├── routes/
  │   ├── books.js              (GET/POST/PUT/DELETE /books)
  │   ├── loans.js              (GET/POST /loans, return loan)
  │   └── people.js             (GET/POST /people)
  ├── controllers/
  │   ├── bookController.js     (Business logic for books)
  │   ├── loanController.js     (Business logic for loans)
  │   └── personController.js   (Business logic for people)
  ├── middleware/
  │   ├── errorHandler.js       (Global error handling)
  │   └── validation.js         (Input validation helpers)
  ├── database/
  │   ├── migrations/           (SQL schema setup files)
  │   └── seeds/                (Test data scripts)
  ├── app.js                    (Express app setup)
  ├── server.js                 (Start server on port 5000)
  └── .env                      (Database credentials)
```

### Database Schema

**Tables to Create:**

1. **persons** (friends/family)
   - `id` (PRIMARY KEY)
   - `name` (VARCHAR, unique)
   - `created_at` (TIMESTAMP)

2. **books** (your collection)
   - `id` (PRIMARY KEY)
   - `title` (VARCHAR)
   - `author` (VARCHAR)
   - `isbn` (VARCHAR, nullable)
   - `created_at` (TIMESTAMP)

3. **loans** (borrowing history)
   - `id` (PRIMARY KEY)
   - `book_id` (FOREIGN KEY -> books.id)
   - `person_id` (FOREIGN KEY -> persons.id)
   - `borrowed_date` (DATE)
   - `returned_date` (DATE, nullable - null = still borrowed)
   - `created_at` (TIMESTAMP)
   - `updated_at` (TIMESTAMP)

**Relationships:**
- 1 book -> many loans (one book can be borrowed multiple times)
- 1 person -> many loans (one person can borrow many books)

---

## Phase Breakdown: Implementation Roadmap

### Phase 0: Project Setup (1-2 hours)
**Goal**: Establish working development environment

**Steps:**
1. Initialize Git repository (already done)
2. Create project directory structure (`frontend/`, `backend/`)
3. Set up **Backend**:
   - Initialize Node.js project (`npm init`)
   - Install Express, PostgreSQL client (pg), dotenv
   - Create basic Express app with CORS enabled
   - Set up `.env` file for database credentials
4. Set up **Frontend**:
   - Initialize Vite with Vue 3 template (`npm create vite@latest`)
   - Install Vue Router for page navigation
   - Set up API base URL for backend communication

**Deliverables:**
- Backend running on `http://localhost:5000`
- Frontend running on `http://localhost:5173`
- Backend responds with `{ message: "Server is running" }` on GET `/`
- Frontend successfully calls backend and displays message

**Learning Focus:**
- Project structure conventions
- npm and build tools basics
- CORS and client-server communication

---

### Phase 1: Database & Core Backend API (2-3 hours)

**Goal**: Build data layer and REST endpoints (no frontend yet)

**Steps:**
1. **Database Setup**:
   - Install PostgreSQL locally (if not already)
   - Create database called `book_tracker`
   - Write migration file to create 3 tables (persons, books, loans with relationships)
   - Seed with sample data (3 people, 5 books, 2 loans)

2. **Database Model Layer**:
   - Create `models/Book.js` with methods:
     - `getAll()` - fetch all books
     - `getById(id)` - fetch single book
     - `create(data)` - insert new book
     - `update(id, data)` - update book
     - `delete(id)` - delete book (validate no active loans)
   - Create `models/Person.js` with similar CRUD methods
   - Create `models/Loan.js` with:
     - `getActive()` - loans where returned_date IS NULL
     - `getByPerson(personId)` - all loans for person
     - `create(bookId, personId, date)` - create loan
     - `markReturned(loanId, returnDate)` - update returned_date

3. **API Routes & Controllers**:
   - Create routes for:
     - `GET /api/books` - list all books
     - `GET /api/books/:id` - get single book
     - `POST /api/books` - create book
     - `PUT /api/books/:id` - update book
     - `DELETE /api/books/:id` - delete book
     - Similar for `/api/people` and `/api/loans`
   - Create controller functions to handle logic
   - Add error handling middleware (try-catch, proper HTTP status codes)

4. **Testing Deliverable**:
   - Use Postman or REST Client (VS Code extension) to test all endpoints
   - Document requests in `TESTING.md` (test each endpoint manually)

**Learning Focus:**
- SQL basics and table relationships
- Query building with `pg` library
- REST API conventions (HTTP methods, status codes, JSON)
- Error handling patterns
- Middleware in Express

---

### Phase 2: Frontend Components & Integration (3-4 hours)

**Goal**: Build Vue UI and connect to backend

**Steps:**
1. **Set Up Vue Routing** (Pages layer):
   - Create `BooksView.vue` - main page for book management
   - Create `PeopleView.vue` - manage people
   - Create `LoansView.vue` - view loans
   - Create `DashboardView.vue` - overview with stats
   - Set up router with navigation links in App.vue header

2. **Create Composables** (logic layer):
   - `useApi.js` - generic fetch wrapper with error handling
   - `useBooks()` - state + API calls for book operations
   - `usePeople()` - state + API calls for people operations
   - `useLoans()` - state + API calls for loan operations
   - *Learning*: Composition API state management without Pinia (simple for MVP)

3. **Build Components** (UI layer):
   - **BookList.vue**: Display books, buttons for edit/delete
   - **BookForm.vue**: Form to add/edit books with validation
   - **PersonList.vue**: Display people with their loan counts
   - **PersonForm.vue**: Add new person form
   - **LoanList.vue**: Show active loans and loan history
   - **LoanForm.vue**: Select book + person, log as borrowed
   - *Learning*: v-if/v-for rendering, form bindings (v-model), event handlers (@click), computed properties for filtering

4. **Connect Frontend to Backend**:
   - Update composables to call actual backend API
   - Replace any mocked data with real API responses
   - Add error states and loading indicators

5. **Testing**:
   - Test each view manually in browser
   - Document happy path and error scenarios in `TESTING.md`

**Learning Focus:**
- Vue component structure and props
- Composition API (`ref`, `reactive`, `computed`, `watch`)
- Fetching data with `fetch()` API
- Form handling and validation
- Event binding and data binding
- Conditional rendering

---

### Phase 3: Validation & Refinement (1-2 hours)

**Goal**: Add data validation, handle edge cases, improve UX

**Steps:**
1. **Frontend Validation**:
   - Add form validators (required fields, min/max length, ISBN format)
   - Show validation errors to user before submission
   - Disable submit buttons until form is valid

2. **Backend Validation**:
   - Add middleware to validate request data
   - Return proper error messages (400 Bad Request)
   - Test with invalid data from Postman

3. **Business Logic Validation**:
   - Prevent deleting books with active loans
   - Prevent duplicate people names
   - Add success notifications when operations complete

4. **Error Handling**:
   - User-friendly error messages
   - Handle network failures gracefully
   - Add try-catch in composables

**Learning Focus:**
- Input validation patterns
- Error messaging UX
- API error response handling

---

### Phase 4: Testing & Documentation (1-2 hours)

**Goal**: Validate functionality and document learnings

**Steps:**
1. **Manual Testing Checklist**:
   - Test each CRUD operation (Create, Read, Update, Delete) for all entities
   - Test error cases (invalid data, duplicate names, etc.)
   - Test UI responsiveness
   - Document results in `TESTING.md`

2. **Write Basic Unit Tests** (Vue components):
   - Test one component's computed properties
   - Test one composable's data transformations
   - Use Vue Test Utils or Vitest

3. **Document Learning**:
   - Create `LEARNING_LOG.md` with:
     - Key Vue 3 concepts learned
     - Common backend patterns observed
     - Challenges faced and solutions
     - Next steps if continuing

**Learning Focus:**
- Testing strategies
- Code documentation
- Reflection on learning journey

---

## Tech Stack Details & Why

| Technology | Purpose | Why This Choice |
|-----------|---------|----------------|
| **Vue 3** | Frontend UI framework | Modern, teaches reactive concepts, composition patterns |
| **Composition API** | Vue state management | Modern approach, teaches hooks concept (useful for React too) |
| **Vite** | Build tool | Fast, modern, great DX, understands ES modules |
| **Express.js** | Web framework | Simple, widely used, great for learning REST APIs |
| **PostgreSQL** | Relational database | More realistic than SQLite, teaches foreign keys + relationships |
| **pg** (node-postgres) | Database driver | Direct SQL queries teach deeper database concepts |
| **Vue Router** | Frontend routing | Multi-page SPA, teaches page transitions |
| **Fetch API** | HTTP client | Native, no extra dependencies, teaches how HTTP works |

---

## Key Learning Milestones

### After Phase 0
- [ ] Understand npm and project structure conventions
- [ ] Know how frontend and backend communicate (CORS)
- [ ] Can run both servers locally

### After Phase 1
- [ ] Understand relational database concepts (tables, relationships, foreign keys)
- [ ] Can write SQL CREATE TABLE and INSERT queries
- [ ] Understand REST API conventions (GET, POST, PUT, DELETE)
- [ ] Know what HTTP status codes mean (200, 400, 404, 500)
- [ ] Can build Express routes and controllers

### After Phase 2
- [ ] Understand Vue components and props/events
- [ ] Can use Composition API (`ref`, `reactive`, `computed`)
- [ ] Know how to fetch data from API in Vue
- [ ] Understand component lifecycle in Vue 3
- [ ] Can build a form and bind data
- [ ] Know async/await patterns for API calls

### After Phase 3
- [ ] Understand validation patterns (frontend + backend)
- [ ] Know how to handle user errors gracefully
- [ ] Understand edge cases in business logic

### After Phase 4
- [ ] Know how to test components and functions
- [ ] Can write clear documentation
- [ ] Have full understanding of full-stack request/response flow

---

## Files to Create (Checklist)

### Backend Setup
- [ ] `backend/package.json`
- [ ] `backend/.env`
- [ ] `backend/app.js`
- [ ] `backend/server.js`
- [ ] `backend/config/database.js`
- [ ] `backend/database/migrations/001_initial_schema.sql`
- [ ] `backend/database/seeds/seedData.js`

### Backend Models
- [ ] `backend/models/Book.js`
- [ ] `backend/models/Person.js`
- [ ] `backend/models/Loan.js`

### Backend Routes & Controllers
- [ ] `backend/routes/books.js`
- [ ] `backend/routes/people.js`
- [ ] `backend/routes/loans.js`
- [ ] `backend/controllers/bookController.js`
- [ ] `backend/controllers/personController.js`
- [ ] `backend/controllers/loanController.js`
- [ ] `backend/middleware/errorHandler.js`

### Frontend Setup
- [ ] `frontend/src/main.js`
- [ ] `frontend/src/App.vue`
- [ ] `frontend/src/router.js`
- [ ] `frontend/index.html`

### Frontend Composables
- [ ] `frontend/src/composables/useApi.js`
- [ ] `frontend/src/composables/useBooks.js`
- [ ] `frontend/src/composables/usePeople.js`
- [ ] `frontend/src/composables/useLoans.js`

### Frontend Views
- [ ] `frontend/src/views/BooksView.vue`
- [ ] `frontend/src/views/PeopleView.vue`
- [ ] `frontend/src/views/LoansView.vue`
- [ ] `frontend/src/views/DashboardView.vue`

### Frontend Components
- [ ] `frontend/src/components/BookList.vue`
- [ ] `frontend/src/components/BookForm.vue`
- [ ] `frontend/src/components/BookCard.vue`
- [ ] `frontend/src/components/PersonList.vue`
- [ ] `frontend/src/components/PersonForm.vue`
- [ ] `frontend/src/components/LoanList.vue`
- [ ] `frontend/src/components/LoanForm.vue`

### Documentation
- [ ] `PROJECT_PLAN.md`
- [ ] `ARCHITECTURE.md`
- [ ] `API_DOCUMENTATION.md`
- [ ] `TESTING.md`
- [ ] `LEARNING_LOG.md`

---

## Role Descriptions: How I'll Support Your Learning

### As Project Manager
- Keep your progress on track through phases
- Help you prioritize when overwhelmed
- Remind you of phase goals
- Watch for scope creep and keep non-MVP features out of the critical path

### As Product Owner
- Define clear acceptance criteria
- Manage feature scope (MVP vs. future)
- Explain the why behind features from the user perspective
- Help validate that the product works as intended

### As QA Engineer
- Create test plans for each phase
- Help identify edge cases to test
- Validate functionality against acceptance criteria
- Report bugs and ask for fixes

### As Instructor
- Explain concepts with examples
- Provide references and learning resources
- Review code and explain patterns
- Ask guiding questions instead of giving immediate answers when useful

---

## Next Steps

1. Confirm the scope and phase order.
2. Start with Phase 0 and scaffold the frontend and backend.
3. Build the database schema before wiring the first Vue screens.
4. Add testing and validation after the main CRUD paths work.

---

## Success Metrics

By the end of this project, you will have:
- A working full-stack web application
- Working knowledge of Vue 3 Composition API patterns
- Hands-on experience with REST API design
- Practical understanding of relational database design and SQL
- Experience tracing the full request/response cycle across frontend, backend, and database
