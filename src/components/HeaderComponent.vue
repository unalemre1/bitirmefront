<script setup lang="ts">
import { useTheme } from '../composables/useTheme'
import { useAuth } from '../composables/useAuth'
import ThemeToggle from './header/ThemeToggle.vue'
import Logo from './header/Logo.vue'
import LoginButton from './header/LoginButton.vue'
import LogoutButton from './header/LogoutButton.vue'
import AboutButton from './header/AboutButton.vue'
import ProfileButton from './header/ProfileButton.vue'
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'

const { isDarkMode, toggleTheme } = useTheme()
const { verifyToken } = useAuth()
const isAuthenticated = ref(false)
const route = useRoute()
const menuOpen = ref(false)

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

watch(() => route.path, async () => {
  await checkAuth()
  menuOpen.value = false // Sayfa değişince menü kapansın
})
</script>

<template>
  <header class="header">
    <div class="header-content">
      <div class="header-left">
        <Logo title="LexAI" />
      </div>

      <!-- Masaüstü menü -->
      <nav class="header-actions desktop">
        <AboutButton />
        <router-link to="/subscription" class="subscription-link">Abonelik</router-link>
        <ThemeToggle :is-dark-mode="isDarkMode" @toggle="toggleTheme" />
        <ProfileButton v-if="isAuthenticated" />
        <LogoutButton v-if="isAuthenticated" />
        <LoginButton v-else />
      </nav>

      <!-- Mobil tema ve hamburger -->
      <div class="mobile-actions">
        <ThemeToggle :is-dark-mode="isDarkMode" @toggle="toggleTheme" />
        <button class="hamburger" @click="menuOpen = !menuOpen">☰</button>
      </div>
    </div>

    <!-- Mobil menü -->
    <nav class="mobile-menu" v-if="menuOpen">
      <AboutButton />
      <router-link to="/subscription" class="subscription-link">Abonelik</router-link>
      <ProfileButton v-if="isAuthenticated" />
      <LogoutButton v-if="isAuthenticated" />
      <LoginButton v-else />
    </nav>
  </header>
</template>

<style scoped>
.header {
  background-color: var(--header-bg);
  color: var(--header-text);
  padding: 1rem 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  width: 100%;
  box-sizing: border-box;
  overflow-x: hidden;
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
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.subscription-link {
  padding: 0.5rem 0.75rem;
  font-weight: 500;
  color: var(--text-color);
  text-decoration: none;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.subscription-link:hover {
  color: var(--primary-color);
}

.hamburger {
  background: none;
  border: none;
  font-size: 1.8rem;
  cursor: pointer;
  color: var(--hamburger-color); /* 🌟 Tema bazlı renk */
}

.mobile-menu {
  display: none;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1rem;
}

.mobile-actions {
  display: none;
  align-items: center;
  gap: 0.5rem; /* tema butonu ile hamburger arası mesafe */
}

/* 🌙 Temalar */
:global(body.dark-mode) {
  --header-bg: #1a1a1a;
  --header-text: #ffffff;
  --hamburger-color: #ffffff; /* 🌟 Koyu tema için beyaz */
}

:global(body:not(.dark-mode)) {
  --header-bg: #ffffff;
  --header-text: #213547;
  --hamburger-color: #000000; /* 🌟 Açık tema için siyah */
}


/* 🌟 Mobil düzenleme */
@media (max-width: 768px) {
  .header-actions.desktop {
    display: none;
  }

  .mobile-actions {
    display: flex;
    margin-left: auto; /* Sağa yasla */
  }

  .mobile-menu {
    display: flex;
    background-color: var(--header-bg);
    width: 100%;
  }

  .subscription-link {
    width: 100%;
    text-align: left;
  }
}
</style>
