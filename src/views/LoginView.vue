<script setup lang="ts">
import LoginForm from '../components/login/LoginForm.vue'
import FooterComponent from '../components/footer/FooterComponent.vue'
import { useTitle } from '@vueuse/core'

useTitle('Giriş Yap | LexAI')
</script>

<template>
  <div class="login-page">
    <div class="login-view">
      <div class="login-container">
        <div class="card login-card">
          <div class="card-header">
            <div class="logo-container">
              <i class="bi bi-shield-lock"></i>
            </div>
            <h2>Hoş Geldiniz</h2>
            <p class="subtitle">Hesabınıza giriş yapın</p>
          </div>
          <LoginForm />
          <div class="card-footer">
            <p>Hesabınız yok mu? <router-link to="/signup" class="signup-link">Hesap Oluştur</router-link></p>
          </div>
        </div>
      </div>
    </div>
    <FooterComponent />
  </div>
</template>

<style scoped>
.login-page {
  min-height: 92vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, rgba(66, 184, 131, 0.1), rgba(53, 73, 94, 0.1));
}

.login-view {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 0;
}

.login-container {
  width: 100%;
  max-width: 420px;
  margin: 0 auto;
  padding: 0 1rem;
}

.login-card {
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

.signup-link {
  color: var(--primary-color);
  text-decoration: none;
  font-weight: 600;
  transition: color 0.3s ease;
}

.signup-link:hover {
  color: var(--primary-hover);
}

@media (max-width: 480px) {
  .login-card {
    padding: 2rem 1.5rem;
  }
  
  h2 {
    font-size: 1.75rem;
  }
}
</style>