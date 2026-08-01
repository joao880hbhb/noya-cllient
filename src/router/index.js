import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
      meta: { requiresGuest: true },
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('../views/ProfileView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/profile/edit',
      name: 'profile-edit',
      component: () => import('../views/EditProfileView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/profile/:publicId',
      name: 'public-profile',
      component: () => import('../views/PublicProfileView.vue'),
    },
    {
      path: '/blogs',
      name: 'blogs',
      component: () => import('../views/BlogsView.vue'),
    },
    {
      path: '/blogs/create',
      name: 'blog-create',
      component: () => import('../views/BlogCreateView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/blogs/my-posts',
      name: 'my-blogs',
      component: () => import('../views/MyBlogsView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/blogs/:slug/edit',
      name: 'blog-edit',
      component: () => import('../views/BlogEditView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/blogs/:slug',
      name: 'blog-detail',
      component: () => import('../views/BlogDetailView.vue'),
    },
  ],
})

// Navigation guard
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  // Check if route requires authentication
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next({
      name: 'login',
      query: { redirect: to.fullPath },
    })
  }
  // Check if route requires guest (not authenticated)
  else if (to.meta.requiresGuest && authStore.isAuthenticated) {
    next({ name: 'home' })
  }
  // Allow navigation
  else {
    next()
  }
})

export default router
