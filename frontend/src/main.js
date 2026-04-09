import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'

// .use(router) registers Vue Router so every component can use <RouterView /> and <RouterLink />
createApp(App).use(router).mount('#app')
