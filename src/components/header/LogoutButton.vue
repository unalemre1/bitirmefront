<script setup lang="ts">
import { useAuth } from '../../composables/useAuth'
import { useRouter } from 'vue-router'

const router = useRouter()
const { logout } = useAuth()

const handleLogout = async () => {
  localStorage.removeItem('token')
  router.push('/login')
}
</script>

<template>
  <button class="logout-btn" @click="handleLogout">
    <div class="btn-background"></div>
    <span>Çıkış Yap</span>
  </button>
</template>

<style scoped>
.logout-btn {
  position: relative;
  padding: 0.75rem 1.5rem;
  font-weight: 600;
  color: var(--text-color);
  text-decoration: none;
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s ease;
  border: 2px solid var(--accent-color);
  background: transparent;
  cursor: pointer;
  z-index: 1;
}

.btn-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: var(--accent-color);
  transform: translateX(-100%);
  transition: transform 0.3s ease;
  z-index: -1;
}

.logout-btn:hover {
  color: white;
}

.logout-btn:hover .btn-background {
  transform: translateX(0);
}

.logout-btn span {
  position: relative;
  z-index: 1;
}
</style>