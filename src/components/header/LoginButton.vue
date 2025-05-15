<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<template>
  <router-link 
    to="/login" 
    class="login-btn"
  >
    <span>Giriş Yap</span>
    <div class="btn-background"></div>
  </router-link>
</template>

<style scoped>
.login-btn {
  position: relative;
  padding: 0.75rem 1.5rem;
  font-weight: 600;
  color: var(--text-color);
  text-decoration: none;
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s ease;
  border: 2px solid var(--primary-color);
  z-index: 1;
}

.btn-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: var(--primary-color);
  transform: translateX(-100%);
  transition: transform 0.3s ease;
  z-index: -1;
}

.login-btn:hover {
  color: white;
}

.login-btn:hover .btn-background {
  transform: translateX(0);
}

.login-btn span {
  position: relative;
  z-index: 1;
}
</style>