import {
  createRouter,
  createWebHistory,
  type RouteRecordRaw
} from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('@/views/CatalogPage.vue')
  },
  {
    path: '/product/:id',
    component: () => import('@/views/ProductPage.vue'),
    props: route => ({ id: Number(route.params.id) })
  },
  {
    path: '/cart',
    component: () => import('@/views/CartPage.vue'),
  },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { left: 0, top: 0 }
  }
})
