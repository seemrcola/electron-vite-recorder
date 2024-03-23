import { createRouter, createWebHashHistory } from 'vue-router'
import routes from './routes'

const baseRoutes = [
  {
    path: '/',
    redirect: '/home',
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes: [...baseRoutes, ...routes],
})

export default router
