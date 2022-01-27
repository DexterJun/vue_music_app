import { createRouter, createWebHashHistory } from 'vue-router'
import Recommend from '../views/Recommend.vue'
import Search from '../views/Search.vue'
import Singer from '../views/Singer.vue'
import TopList from '../views/TopList.vue'

const routes = [
  {
    path: '/',
    redirect: '/recommend'
  },
  {
    path: '/recommend',
    component: Recommend
  },
  {
    path: '/search',
    component: Search
  },
  {
    path: '/singer',
    component: Singer
  },
  {
    path: '/top-list',
    component: TopList
  }
]

const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes
})

export default router
