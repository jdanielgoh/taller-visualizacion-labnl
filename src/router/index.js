import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/red-contratos',
      name: 'Red de contratos',

      component: () => import('../views/RedContratosView.vue'),
    },
  ],
})

export default router
