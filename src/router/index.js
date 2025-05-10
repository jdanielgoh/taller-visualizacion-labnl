import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Red de contratos',
      component: () => import('../views/RedContratosView.vue'),
    },
  ],
})

export default router
