import Startpage from '@/views/Startpage.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Startpage',
      component: Startpage
    },
  ],
})

export default router
