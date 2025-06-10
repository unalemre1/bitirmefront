<script setup lang="ts">
// useRouter import'una artık ihtiyacımız yok
// çünkü router nesnesini doğrudan kullanmıyoruz.
// import { useRouter } from 'vue-router'

// const router = useRouter() // Bu satır kaldırıldı
</script>

<template>
  <router-link
    to="/about"
    class="about-btn"
  >
    <span>Hakkımızda</span>
  </router-link>
</template>

<style scoped>
.about-btn {
  position: relative;
  padding: 0.75rem 1rem;
  font-weight: 500;
  color: var(--text-color);
  text-decoration: none;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.about-btn:hover {
  color: var(--primary-color);
  /*background-color: rgba(66, 184, 131, 0.1);*/
}

.about-btn span {
  position: relative;
  z-index: 1;
}
</style>