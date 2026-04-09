import { createRouter, createWebHistory } from 'vue-router'

import BooksView from './views/BooksView.vue'
import PeopleView from './views/PeopleView.vue'
import LoansView from './views/LoansView.vue'
import DashboardView from './views/DashboardView.vue'

// Each route maps a URL path to a View component.
// When the user navigates to /books, Vue Router renders BooksView inside <RouterView />.
const routes = [
  { path: '/', redirect: '/dashboard' },
  { path: '/dashboard', component: DashboardView },
  { path: '/books', component: BooksView },
  { path: '/people', component: PeopleView },
  { path: '/loans', component: LoansView },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
