<script setup lang="ts">
import { ref } from 'vue'
import { useTitle } from '@vueuse/core'
import FooterComponent from '../components/footer/FooterComponent.vue' // Footer bileşeninizin yolu

useTitle('Şifremi Unuttum | LexAI')

const email = ref('')
const message = ref('')
const error = ref('')
const isLoading = ref(false)

const handleForgotPassword = async () => {
  error.value = ''
  message.value = ''
  isLoading.value = true

  // Burada e-posta doğrulama ve API çağrısı yapılmalı
  // Gerçek bir uygulamada bu kısım backend API'nize bir POST isteği gönderecektir.
  try {
    // Örnek bir gecikme ve başarı/hata simülasyonu
    await new Promise(resolve => setTimeout(resolve, 1500))

    if (email.value === 'test@example.com') { // Bu sadece bir simülasyon
      message.value = 'Şifre sıfırlama talimatları e-posta adresinize gönderildi.'
    } else {
      error.value = 'Bu e-posta adresine kayıtlı bir hesap bulunamadı.'
    }
  } catch (err) {
    console.error('Şifre sıfırlama hatası:', err)
    error.value = 'Şifre sıfırlama isteği gönderilirken bir sorun oluştu. Lütfen tekrar deneyin.'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="forgot-password-page">
    <div class="forgot-password-view">
      <div class="forgot-password-container">
        <div class="card forgot-password-card">
          <div class="card-header">
            <div class="logo-container">
              <i class="bi bi-key"></i>
            </div>
            <h2>Şifremi Unuttum</h2>
            <p class="subtitle">Hesabınızın şifresini sıfırlamak için e-posta adresinizi girin.</p>
          </div>
          <form @submit.prevent="handleForgotPassword" class="forgot-password-form">
            <div class="form-group">
              <label for="email">E-posta Adresiniz</label>
              <input
                type="email"
                id="email"
                v-model="email"
                placeholder="örnek@eposta.com"
                required
                autocomplete="email"
              />
            </div>
            <button type="submit" :disabled="isLoading">
              <span v-if="isLoading" class="spinner"></span>
              <span v-else>Şifre Sıfırlama Bağlantısı Gönder</span>
            </button>
          </form>

          <div v-if="message" class="alert success">{{ message }}</div>
          <div v-if="error" class="alert error">{{ error }}</div>

          <div class="card-footer">
            <p>Giriş yapmak ister misiniz? <router-link to="/login" class="login-link">Giriş Yap</router-link></p>
            <p>Hesabınız yok mu? <router-link to="/signup" class="signup-link">Hesap Oluştur</router-link></p>
          </div>
        </div>
      </div>
    </div>
    <FooterComponent />
  </div>
</template>

<style scoped>
.forgot-password-page {
  min-height: 92vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, rgba(66, 184, 131, 0.1), rgba(53, 73, 94, 0.1));
}

.forgot-password-view {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 0;
}

.forgot-password-container {
  width: 100%;
  max-width: 420px;
  margin: 0 auto;
  padding: 0 1rem;
}

.forgot-password-card {
  padding: 2.5rem;
  border-radius: 16px;
  background: var(--card-bg); /* Genel bir kart arka plan rengi değişkeni */
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
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color)); /* Ana renkleriniz */
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
  color: var(--text-color); /* Genel bir metin rengi değişkeni */
  opacity: 0.8;
  margin: 0;
  font-size: 1.1rem;
}

.forgot-password-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

label {
  font-size: 0.95rem;
  color: var(--text-color);
  margin-bottom: 0.5rem;
  font-weight: 600;
}

input[type="email"] {
  padding: 0.85rem 1rem;
  border: 1px solid var(--border-color); /* Genel bir kenarlık rengi değişkeni */
  border-radius: 8px;
  font-size: 1rem;
  color: var(--text-color);
  background: var(--input-bg); /* Genel bir girdi arka plan rengi değişkeni */
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

input[type="email"]:focus {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(var(--primary-color-rgb), 0.2); /* RGB formatında birincil renk */
  outline: none;
}

button[type="submit"] {
  padding: 0.9rem 1.5rem;
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.3s ease, transform 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

button[type="submit"]:hover:not(:disabled) {
  opacity: 0.9;
  transform: translateY(-1px);
}

button[type="submit"]:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.spinner {
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-top: 3px solid #fff;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.alert {
  padding: 1rem;
  border-radius: 8px;
  margin-top: 1.5rem;
  font-size: 0.95rem;
  text-align: center;
}

.alert.success {
  background-color: #e6ffe6; /* Açık yeşil */
  color: #1a6f3b; /* Koyu yeşil */
  border: 1px solid #7edc9c;
}

.alert.error {
  background-color: #ffe6e6; /* Açık kırmızı */
  color: #a30000; /* Koyu kırmızı */
  border: 1px solid #f57f7f;
}

.card-footer {
  margin-top: 2rem;
  text-align: center;
  color: var(--text-color);
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.login-link,
.signup-link {
  color: var(--primary-color);
  text-decoration: none;
  font-weight: 600;
  transition: color 0.3s ease;
}

.login-link:hover,
.signup-link:hover {
  color: var(--primary-hover); /* Birincil rengin hover hali */
}

@media (max-width: 480px) {
  .forgot-password-card {
    padding: 2rem 1.5rem;
  }
  
  h2 {
    font-size: 1.75rem;
  }

  button[type="submit"] {
    font-size: 1rem;
    padding: 0.8rem 1.2rem;
  }
}
</style>