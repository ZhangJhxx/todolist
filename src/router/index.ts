import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import Todo from '../views/Todo.vue'

const routes: Array<RouteRecordRaw> = [

  {
    path: '/',
    name: 'Todo',
    component: Todo
    // component: () => import( '../views/Todo.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
