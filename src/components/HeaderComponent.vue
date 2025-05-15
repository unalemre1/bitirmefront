<script setup lang="ts">
import { useTheme } from '../composables/useTheme'
import { useAuth } from '../composables/useAuth'
import ThemeToggle from './header/ThemeToggle.vue'
import Logo from './header/Logo.vue'
import LoginButton from './header/LoginButton.vue'
import LogoutButton from './header/LogoutButton.vue'
import AboutButton from './header/AboutButton.vue'
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'

const { isDarkMode, toggleTheme } = useTheme()
const { verifyToken } = useAuth()
const isAuthenticated = ref(false)
const route = useRoute()

const checkAuth = async () => {
  const token = localStorage.getItem('token')
  if (token) {
    const isValid = await verifyToken()
    isAuthenticated.value = isValid
    if (!isValid) {
      localStorage.removeItem('token')
    }
  } else {
    isAuthenticated.value = false
  }
}

onMounted(async () => {
  await checkAuth()
})

// Watch for route changes to update auth state
watch(() => route.path, async () => {
  await checkAuth()
})
</script>

<template>
  <header class="header">
    <div class="header-content">
      <div class="header-left">
        <Logo title="LexAI" />
        <AboutButton />
        <router-link 
          to="/subscription" 
          class="subscription-link"
        >
          Abonelik
        </router-link>
      </div>
      <div class="header-actions">
        <ThemeToggle 
          :is-dark-mode="isDarkMode" 
          @toggle="toggleTheme" 
        />
        <LogoutButton v-if="isAuthenticated" />
        <LoginButton v-else />
      </div>
    </div>
  </header>
</template>

<style scoped>
.header {
  background-color: var(--header-bg);
  color: var(--header-text);
  padding: 1rem 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.subscription-link {
  position: relative;
  padding: 0.75rem 1rem;
  font-weight: 500;
  color: var(--text-color);
  text-decoration: none;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.subscription-link:hover {
  color: var(--primary-color);
}

:global(body.dark-mode) {
  --header-bg: #1a1a1a;
  --header-text: #ffffff;
}

:global(body:not(.dark-mode)) {
  --header-bg: #ffffff;
  --header-text: #213547;
}
</style>