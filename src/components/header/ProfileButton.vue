<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<template>
  <button 
    class="profile-btn"
    @click="router.push('/profile')"
  >
    <i class="bi bi-person-circle"></i>
    <span>Profilim</span>
  </button>
</template>

<style scoped>
.profile-btn {
  position: relative;
  padding: 0.75rem 1.5rem;
  font-weight: 500;
  color: var(--text-color);
  background: none;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
}

.profile-btn:hover {
  background-color: rgba(66, 184, 131, 0.1);
  color: var(--primary-color);
}

.profile-btn i {
  font-size: 1.25rem;
}
</style>