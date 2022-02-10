import { createRouter, createWebHashHistory } from 'vue-router'
import Recommend from '../views/Recommend.vue'
import Search from '../views/Search.vue'
import Singer from '../views/Singer.vue'
import TopList from '../views/TopList.vue'
import SingerDetail from '../views/SingerDetail.vue'
import Album from '../views/Album.vue'
import TopDetail from '../views/TopDetail.vue'

const routes = [
  {
    path: '/',
    redirect: '/recommend'
  },
  {
    path: '/recommend',
    component: Recommend,
    children: [
      {
        path: ':id',
        component: Album
      }
    ]
  },
  {
    path: '/search',
    component: Search
  },
  {
    path: '/singer',
    component: Singer,
    children: [
      {
        path: ':id',
        component: SingerDetail
      }
    ]
  },
  {
    path: '/top-list',
    component: TopList,
    children: [
      {
        path: ':id',
        component: TopDetail
      }
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes
})

export default router
