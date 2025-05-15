<script setup lang="ts">
import SignupForm from '../components/SignupForm.vue'
import FooterComponent from '../components/footer/FooterComponent.vue'
import { useTitle } from '@vueuse/core'

useTitle('Hesap Oluştur | LexAI')
</script>

<template>
  <div class="signup-page">
    <div class="signup-view">
      <div class="signup-container">
        <div class="card signup-card">
          <div class="card-header">
            <div class="logo-container">
              <i class="bi bi-person-plus"></i>
            </div>
            <h2>Hesap Oluştur</h2>
            <p class="subtitle">LexAI'ye hoş geldiniz!</p>
          </div>
          <SignupForm />
          <div class="card-footer">
            <p>Zaten hesabınız var mı? <router-link to="/login" class="login-link">Giriş Yap</router-link></p>
          </div>
        </div>
      </div>
    </div>
    <FooterComponent />
  </div>
</template>

<style scoped>
.signup-page {
  min-height: 92vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, rgba(66, 184, 131, 0.1), rgba(53, 73, 94, 0.1));
}

.signup-view {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 0;
}

.signup-container {
  width: 100%;
  max-width: 480px;
  margin: 0 auto;
  padding: 0 1rem;
}

.signup-card {
  padding: 2.5rem;
  border-radius: 16px;
  background: var(--card-bg);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.card-header {
  text-align: center;
  margin-bottom: 2rem;
}

.logo-container {
  width: 64px;
  height: 64px;
  margin: 0 auto 1.5rem;
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-container i {
  font-size: 28px;
  color: white;
}

h2 {
  font-size: 2rem;
  margin-bottom: 0.5rem;
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.subtitle {
  color: var(--text-color);
  opacity: 0.8;
  margin: 0;
  font-size: 1.1rem;
}

.card-footer {
  margin-top: 2rem;
  text-align: center;
  color: var(--text-color);
}

.login-link {
  color: var(--primary-color);
  text-decoration: none;
  font-weight: 600;
  transition: color 0.3s ease;
}

.login-link:hover {
  color: var(--primary-hover);
}

@media (max-width: 480px) {
  .signup-card {
    padding: 2rem 1.5rem;
  }
  
  h2 {
    font-size: 1.75rem;
  }
}
</style>