import { createRouter, createWebHashHistory } from 'vue-router'
/* 将组件卸载import函数中将函数变成异步组件，只有路由到该组件的时候才会加载该组件
注释中的内容是为加载的组件起名，webpack默认会以数字为组件命名 */
const Recommend = () => import('../views/Recommend.vue'/* webpackChunkName: "Recommend" */)
const Search = () => import('../views/Search.vue'/* webpackChunkName: "Search" */)
const Singer = () => import('../views/Singer.vue'/* webpackChunkName: "Singer" */)
const TopList = () => import('../views/TopList.vue'/* webpackChunkName: "TopList" */)
const SingerDetail = () => import('../views/SingerDetail.vue'/* webpackChunkName: "SingerDetail" */)
const Album = () => import('../views/Album.vue'/* webpackChunkName: "Album" */)
const TopDetail = () => import('../views/TopDetail.vue'/* webpackChunkName: "TopDetail" */)
const UserCenter = () => import('../views/UserCenter.vue'/* webpackChunkName: "UserCenter" */)

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
    component: Search,
    children: [
      {
        path: ':id',
        component: SingerDetail
      }
    ]
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
  },
  {
    path: '/user',
    components: {
      user: UserCenter
    }
  }
]

const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes
})

export default router
