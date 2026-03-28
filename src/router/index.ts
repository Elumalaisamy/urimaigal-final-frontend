// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/HomeView.vue'),
  },
  {
    path: '/auth',
    name: 'auth',
    component: () => import('@/views/AuthView.vue'),
    meta: { guestOnly: true },
  },
  {
    path: '/lawyers',
    name: 'lawyers',
    component: () => import('@/views/LawyersView.vue'),
  },
  {
    path: '/lawyers/:id',
    name: 'lawyer-detail',
    component: () => import('@/views/LawyerDetailView.vue'),
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('@/views/DashboardView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/advocate/dashboard',
    name: 'advocate-dashboard',
    component: () => import('@/views/AdvocateDashboardView.vue'),
    meta: { requiresAuth: true, requiresAdvocate: true },
  },
  {
    path: '/advocate/profile',
    name: 'advocate-profile',
    component: () => import('@/views/AdvocateProfileView.vue'),
    meta: { requiresAuth: true, requiresAdvocate: true },
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/',
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 }),
})

router.beforeEach((to) => {
  const auth = useAuthStore()
  if (to.meta.requiresAuth && !auth.isAuthenticated) return { name: 'auth' }
  if (to.meta.guestOnly && auth.isAuthenticated) return { name: auth.isAdvocate ? 'advocate-dashboard' : 'dashboard' }

  if (to.name === 'dashboard' && auth.isAdvocate) {
    return { name: 'advocate-dashboard' }
  }
  if (to.name === 'advocate-dashboard' && !auth.isAdvocate) {
    return { name: 'dashboard' }
  }

  if (to.meta.requiresAdvocate && !auth.isAdvocate) return { name: 'dashboard' }
})

export default router
