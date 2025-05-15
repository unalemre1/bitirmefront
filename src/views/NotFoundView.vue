<script setup lang="ts">
import FooterComponent from '../components/footer/FooterComponent.vue'
</script>

<template>
  <div class="not-found-page">
    <div class="not-found-container container text-center">
      <h1 class="display-1 mb-4">404</h1>
      <h2 class="mb-4">Sayfa Bulunamadı</h2>
      <p class="mb-4">Aradığınız sayfa mevcut değil veya taşınmış olabilir.</p>
      <router-link to="/" class="btn btn-primary">
        Ana Sayfaya Dön
      </router-link>
    </div>
    <FooterComponent />
  </div>
</template>

<style scoped>
.not-found-page {
  min-height: 100vh;
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.not-found-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  overflow-y: auto;
}
</style>