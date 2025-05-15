<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const isAnnual = ref(false)

const plans = [
  {
    name: 'Başlangıç',
    description: 'Bireysel avukatlar için temel özellikler',
    monthlyPrice: 199,
    annualPrice: 1990,
    features: [
      'AI destekli hukuki analiz',
      'Temel belge yönetimi',
      'E-posta desteği',
      '5 GB depolama'
    ],
    recommended: false
  },
  {
    name: 'Profesyonel',
    description: 'Küçük hukuk büroları için gelişmiş özellikler',
    monthlyPrice: 399,
    annualPrice: 3990,
    features: [
      'Tüm Başlangıç özellikleri',
      'Gelişmiş AI analizi',
      'Öncelikli destek',
      '20 GB depolama',
      'Çoklu kullanıcı desteği'
    ],
    recommended: true
  },
  {
    name: 'Kurumsal',
    description: 'Büyük hukuk firmaları için özel çözümler',
    monthlyPrice: 799,
    annualPrice: 7990,
    features: [
      'Tüm Profesyonel özellikleri',
      'Özel AI modeli eğitimi',
      '7/24 öncelikli destek',
      'Sınırsız depolama',
      'API erişimi',
      'Özel entegrasyonlar'
    ],
    recommended: false
  }
]

const handleSubscribe = (planName: string) => {
  const token = localStorage.getItem('token')
  if (!token) {
    router.push('/login')
    return
  }
  
  localStorage.setItem('selectedPlan', planName)
  router.push('/checkout')
}
</script>

<template>
  <div class="pricing-section">
    <div class="billing-toggle">
      <span :class="{ active: !isAnnual }">Aylık</span>
      <label class="switch">
        <input type="checkbox" v-model="isAnnual">
        <span class="slider"></span>
      </label>
      <span :class="{ active: isAnnual }">Yıllık</span>
      <span class="discount-badge" v-if="isAnnual">%17 İndirim</span>
    </div>

    <div class="pricing-grid">
      <div 
        v-for="plan in plans" 
        :key="plan.name"
        class="pricing-card"
        :class="{ recommended: plan.recommended }"
      >
        <div class="card-header">
          <h3>{{ plan.name }}</h3>
          <p class="description">{{ plan.description }}</p>
          <div class="price">
            <span class="currency">₺</span>
            <span class="amount">{{ isAnnual ? plan.annualPrice : plan.monthlyPrice }}</span>
            <span class="period">/{{ isAnnual ? 'yıl' : 'ay' }}</span>
          </div>
        </div>

        <div class="features">
          <ul>
            <li v-for="feature in plan.features" :key="feature">
              <i class="bi bi-check-circle-fill"></i>
              {{ feature }}
            </li>
          </ul>
        </div>

        <button 
          class="subscribe-btn"
          :class="{ primary: plan.recommended }"
          @click="handleSubscribe(plan.name)"
        >
          Planı Seç
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.pricing-section {
  padding: 2rem 0;
}

.billing-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 3rem;
}

.billing-toggle span {
  color: var(--text-color);
  opacity: 0.7;
  transition: opacity 0.3s ease;
}

.billing-toggle span.active {
  opacity: 1;
  font-weight: 600;
}

.switch {
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--border-color);
  transition: .4s;
  border-radius: 34px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 26px;
  width: 26px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  transition: .4s;
  border-radius: 50%;
}

input:checked + .slider {
  background-color: var(--primary-color);
}

input:checked + .slider:before {
  transform: translateX(26px);
}

.discount-badge {
  background-color: var(--primary-color);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.875rem;
  font-weight: 600;
}

.pricing-grid {
  display: flex;
  justify-content: center;
  align-items: stretch;
  gap: 2rem;
  margin-top: 2rem;
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
}

.pricing-card {
  background: var(--card-bg);
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 6px var(--shadow-color);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  position: relative;
  overflow: hidden;
  height: 100%;
  display: flex;
  flex-direction: column;
  flex: 1;
  max-width: 350px;
}

.pricing-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 15px var(--shadow-color);
}

.pricing-card.recommended {
  border: 2px solid var(--primary-color);
}

.pricing-card.recommended::before {
  content: 'Önerilen';
  position: absolute;
  top: 1rem;
  right: -2rem;
  background: var(--primary-color);
  color: white;
  padding: 0.25rem 3rem;
  transform: rotate(45deg);
  font-size: 0.875rem;
  font-weight: 600;
}

.card-header {
  text-align: center;
  margin-bottom: 2rem;
}

.card-header h3 {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  color: var(--text-color);
}

.description {
  color: var(--text-color);
  opacity: 0.8;
  margin-bottom: 1.5rem;
}

.price {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--text-color);
}

.currency {
  font-size: 1.5rem;
  vertical-align: super;
}

.period {
  font-size: 1rem;
  opacity: 0.7;
}

.features {
  margin: 2rem 0;
  flex-grow: 1;
}

.features ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.features li {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
  color: var(--text-color);
}

.features i {
  color: var(--primary-color);
}

.subscribe-btn {
  width: 100%;
  padding: 1rem;
  border: 2px solid var(--primary-color);
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  background: transparent;
  color: var(--primary-color);
  margin-top: auto;
}

.subscribe-btn:hover {
  background: var(--primary-color);
  color: white;
}

.subscribe-btn.primary {
  background: var(--primary-color);
  color: white;
}

.subscribe-btn.primary:hover {
  background: var(--primary-hover);
  border-color: var(--primary-hover);
}

@media (max-width: 1024px) {
  .pricing-grid {
    padding: 0 1rem;
  }

  .pricing-card {
    padding: 1.5rem;
  }

  .price {
    font-size: 2rem;
  }
}

@media (max-width: 768px) {
  .pricing-grid {
    flex-direction: column;
    align-items: center;
  }

  .pricing-card {
    width: 100%;
    max-width: 400px;
  }

  .card-header h3 {
    font-size: 1.25rem;
  }

  .description {
    font-size: 0.875rem;
  }

  .features li {
    font-size: 0.875rem;
  }
}

@media (max-width: 480px) {
  .pricing-grid {
    gap: 1.5rem;
  }
}
</style>