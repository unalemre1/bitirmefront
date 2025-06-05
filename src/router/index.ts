import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { authApi } from '../api/auth'

// Views
import InfoView from '../views/InfoView.vue'
import AuthenticatedInfoView from '../views/AuthenticatedInfoView.vue'
import SignupView from '../views/SignupView.vue'
import LoginView from '../views/LoginView.vue'
import ChatView from '../views/ChatView.vue'
import AboutView from '../views/AboutView.vue'
import SubscriptionView from '../views/SubscriptionView.vue'
import CheckoutView from '../views/CheckoutView.vue'
import ProfileView from '../views/ProfileView.vue'
import ForgotPasswordView from '../views/ForgotPassword.vue' // Önceki adımlarda bu isimle oluşturduğumuz varsayıldı
import ResetPasswordView from '../views/ResetPasswordView.vue' // <-- YENİ EKLENEN IMPORT

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: InfoView,
    beforeEnter: (to, from, next) => {
      const token = localStorage.getItem('token')
      if (token) {
        next('/dashboard')
      } else {
        next()
      }
    }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: AuthenticatedInfoView,
    meta: { requiresAuth: true }
  },
  {
    path: '/info',
    name: 'Info',
    component: InfoView,
    beforeEnter: (to, from, next) => {
      const token = localStorage.getItem('token')
      if (token) {
        next('/dashboard')
      } else {
        next()
      }
    }
  },
  {
    path: '/signup',
    name: 'Signup',
    component: SignupView
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView
  },
  {
    path: '/forgot-password',
    name: 'ForgotPassword',
    component: ForgotPasswordView // `ForgotPasswordPage` yerine `ForgotPasswordView` kullanıldı
  },
  {
    path: '/reset-password', // <-- YENİ EKLENEN ROTA
    name: 'ResetPassword',
    component: ResetPasswordView
    // `token` ve `email` query parametreleri zaten `useRoute` içinde alındığı için
    // burada `props: true` eklemenize gerek yok.
  },
  {
    path: '/chat',
    name: 'Chat',
    component: ChatView,
    meta: { requiresAuth: true }
  },
  {
    path: '/about',
    name: 'About',
    component: AboutView
  },
  {
    path: '/subscription',
    name: 'Subscription',
    component: SubscriptionView
  },
  {
    path: '/checkout',
    name: 'Checkout',
    component: CheckoutView,
    meta: { requiresAuth: true }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: ProfileView,
    meta: { requiresAuth: true }
  },
  // Catch all 404
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../views/NotFoundView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Navigation guard for protected routes
router.beforeEach(async (to, from, next) => {
  const token = localStorage.getItem('token')

  if (to.meta.requiresAuth) {
    if (!token) {
      next('/login')
      return
    }

    try {
      // For test token
      if (token === 'test-token') {
        next()
        return
      }

      const isValid = await authApi.verifyToken()
      if (!isValid) {
        localStorage.removeItem('token')
        next('/login')
        return
      }
      next()
    } catch (error) {
      console.error('Navigation guard error:', error)
      localStorage.removeItem('token')
      next('/login')
      return
    }
  } else {
    // If user is authenticated and tries to access login/signup/forgot-password/reset-password pages
    if (token && (to.path === '/login' || to.path === '/signup' || to.path === '/forgot-password' || to.path === '/reset-password')) { // <-- Değişiklik burada
      next('/dashboard')
      return
    }
    next()
  }
})

export default router