<script setup lang="ts">
import { useTitle } from '@vueuse/core'
import FooterComponent from '../components/footer/FooterComponent.vue'
import PricingPlans from '../components/subscription/PricingPlans.vue'

useTitle('Abonelik | LexAI')
</script>

<template>
  <div class="subscription-page">
    <div class="subscription-container">
      <div class="subscription-header">
        <h1>Abonelik Planları</h1>
        <p class="subtitle">Size en uygun planı seçin</p>
      </div>
      <PricingPlans />
    </div>
    <FooterComponent />
  </div>
</template>

<style scoped>
.subscription-page {
  min-height: 92vh;
  display: flex;
  flex-direction: column;
  background: var(--bg-color);
}

.subscription-container {
  flex: 1;
  max-width: 1200px;
  margin: 0 auto;
  padding: 3rem 1.5rem;
}

.subscription-header {
  text-align: center;
  margin-bottom: 3rem;
}

.subscription-header h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.subtitle {
  font-size: 1.2rem;
  color: var(--text-color);
  opacity: 0.8;
}

@media (max-width: 768px) {
  .subscription-container {
    padding: 2rem 1rem;
  }

  .subscription-header h1 {
    font-size: 2rem;
  }
}
</style>