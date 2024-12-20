import Consultant from '@/views/Consultant.vue'
import Startpage from '@/views/Startpage.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Consultant',
      component: Consultant
    },
  ],
})

export default router
