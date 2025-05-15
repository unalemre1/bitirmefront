<script setup lang="ts">
const currentYear = new Date().getFullYear()
</script>

<template>
  <footer class="footer">
    <div class="footer-content">
      <p class="copyright">
        © {{ currentYear }} LexAI. Tüm hakları saklıdır.
      </p>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  width: 100%;
  padding: 1rem 0;
  background-color: var(--card-bg);
  color: var(--text-color);
  transition: background-color 0.3s ease, color 0.3s ease;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
}

.copyright {
  margin: 0;
  font-size: 0.875rem;
  opacity: 0.8;
}
</style>