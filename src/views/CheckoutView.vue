<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTitle } from '@vueuse/core'
import FooterComponent from '../components/footer/FooterComponent.vue'

useTitle('Ödeme | LexAI')

const route = useRoute()
const router = useRouter()
const selectedPlan = ref('')
const isProcessing = ref(false)

onMounted(() => {
  const plan = localStorage.getItem('selectedPlan')
  if (!plan) {
    router.push('/subscription')
    return
  }
  selectedPlan.value = plan
})

const handlePayment = async () => {
  try {
    isProcessing.value = true
    // Payment processing logic will be implemented here
    await new Promise(resolve => setTimeout(resolve, 1500)) // Simulating API call
    router.push('/dashboard')
  } catch (error) {
    console.error('Payment error:', error)
  } finally {
    isProcessing.value = false
  }
}
</script>

<template>
  <div class="checkout-page">
    <div class="checkout-container">
      <div class="checkout-card">
        <div class="card-header">
          <h1>Ödeme</h1>
          <p class="subtitle">{{ selectedPlan }} planı için ödeme yapın</p>
        </div>

        <div class="payment-form">
          <div class="form-group">
            <label for="cardName">Kart Üzerindeki İsim</label>
            <input 
              type="text" 
              id="cardName" 
              class="form-control" 
              placeholder="Kart üzerindeki ismi girin"
            />
          </div>

          <div class="form-group">
            <label for="cardNumber">Kart Numarası</label>
            <input 
              type="text" 
              id="cardNumber" 
              class="form-control" 
              placeholder="1234 5678 9012 3456"
              maxlength="19"
            />
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="expiryDate">Son Kullanma Tarihi</label>
              <input 
                type="text" 
                id="expiryDate" 
                class="form-control" 
                placeholder="AA/YY"
                maxlength="5"
              />
            </div>

            <div class="form-group">
              <label for="cvv">CVV</label>
              <input 
                type="text" 
                id="cvv" 
                class="form-control" 
                placeholder="123"
                maxlength="3"
              />
            </div>
          </div>

          <button 
            class="btn btn-primary payment-button" 
            @click="handlePayment"
            :disabled="isProcessing"
          >
            <span v-if="isProcessing" class="loading-spinner">
              <i class="bi bi-arrow-repeat"></i>
            </span>
            <span v-else>Ödemeyi Tamamla</span>
          </button>
        </div>
      </div>
    </div>
    <FooterComponent />
  </div>
</template>

<style scoped>
.checkout-page {
  min-height: 92vh;
  display: flex;
  flex-direction: column;
  background: var(--bg-color);
}

.checkout-container {
  flex: 1;
  max-width: 600px;
  margin: 0 auto;
  padding: 3rem 1.5rem;
}

.checkout-card {
  background: var(--card-bg);
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 4px 6px var(--shadow-color);
}

.card-header {
  text-align: center;
  margin-bottom: 2rem;
}

.card-header h1 {
  font-size: 2rem;
  margin-bottom: 0.5rem;
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.subtitle {
  color: var(--text-color);
  opacity: 0.8;
}

.payment-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-row {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 1rem;
}

label {
  font-weight: 500;
  color: var(--text-color);
}

.form-control {
  padding: 0.75rem;
  border: 2px solid var(--border-color);
  border-radius: 8px;
  font-size: 1rem;
  background: var(--bg-color);
  color: var(--text-color);
  transition: all 0.3s ease;
}

.form-control:focus {
  border-color: var(--primary-color);
  outline: none;
  box-shadow: 0 0 0 3px rgba(66, 184, 131, 0.2);
}

.payment-button {
  width: 100%;
  padding: 1rem;
  font-size: 1.1rem;
  font-weight: 600;
  margin-top: 1rem;
}

.loading-spinner {
  display: inline-flex;
  animation: spin 1s linear infinite;
}

.loading-spinner i {
  font-size: 1.25rem;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@media (max-width: 480px) {
  .checkout-container {
    padding: 2rem 1rem;
  }

  .checkout-card {
    padding: 1.5rem;
  }

  .form-row {
    grid-template-columns: 1fr;
  }
}
</style>