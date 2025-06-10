<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTitle } from '@vueuse/core'
import FooterComponent from '../components/footer/FooterComponent.vue'
import axios from 'axios'

useTitle('Şifre Sıfırlama | LexAI')

const route = useRoute()
const router = useRouter()

const password = ref('')
const confirmPassword = ref('')
const message = ref('')
const error = ref('')
const isLoading = ref(false)
const token = ref<string | null>(null) // URL'den gelecek token
const email = ref<string | null>(null) // URL'den gelecek e-posta

// **ÖNEMLİ:** Backend API'nizin temel URL'ini buraya yazın.
const API_BASE_URL = 'http://localhost:3000' // Kendi backend adresinize göre değiştirin!

// Bileşen yüklendiğinde URL'den token ve email'i al
onMounted(() => {
  token.value = route.query.token as string
  email.value = route.query.email as string

  if (!token.value || !email.value) {
    error.value = 'Geçersiz şifre sıfırlama bağlantısı. Lütfen e-postanızdaki bağlantıyı kontrol edin.'
    // Geçersiz bağlantıysa kullanıcıyı farklı bir yere yönlendirebilirsiniz
    setTimeout(() => {
      router.push('/forgot-password')
    }, 3000)
  }
})

const handleResetPassword = async () => {
  error.value = ''
  message.value = ''
  isLoading.value = true

  if (!password.value || !confirmPassword.value) {
    error.value = 'Lütfen yeni şifrenizi ve tekrarını girin.'
    isLoading.value = false
    return
  }

  if (password.value !== confirmPassword.value) {
    error.value = 'Şifreler uyuşmuyor.'
    isLoading.value = false
    return
  }

  // Şifre karmaşıklığı doğrulaması (örnek)
  if (password.value.length < 8) {
    error.value = 'Şifreniz en az 8 karakter uzunluğunda olmalıdır.'
    isLoading.value = false
    return
  }
  // Daha fazla kural eklenebilir: büyük harf, küçük harf, rakam, özel karakter vb.

  try {
<<<<<<< HEAD
    const response = await axios.post(`${API_BASE_URL}/auth/reset-password`, { // Backend endpoint'iniz
=======
    const response = await axios.post(`${API_BASE_URL}/api/reset-password`, { // Backend endpoint'iniz
>>>>>>> 6af3b7a2c7a5c95ec9b2c492b521c69012573463
      token: token.value,
      email: email.value,
      newPassword: password.value,
    })

    if (response.status === 200) {
      message.value = response.data.message || 'Şifreniz başarıyla sıfırlandı. Şimdi giriş yapabilirsiniz.'
      // Başarılı olursa login sayfasına yönlendir
      setTimeout(() => {
        router.push('/login')
      }, 3000)
    }
  } catch (err: any) {
    console.error('Şifre sıfırlama hatası:', err)
    if (err.response && err.response.data && err.response.data.message) {
      error.value = err.response.data.message
    } else if (err.request) {
      error.value = 'Sunucuya ulaşılamadı. Lütfen internet bağlantınızı kontrol edin veya daha sonra tekrar deneyin.'
    } else {
      error.value = 'Şifre sıfırlama isteği gönderilirken beklenmeyen bir hata oluştu. Lütfen tekrar deneyin.'
    }
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="reset-password-page">
    <div class="reset-password-view">
      <div class="reset-password-container">
        <div class="card reset-password-card">
          <div class="card-header">
            <div class="logo-container">
              <i class="bi bi-lock-fill"></i>
            </div>
            <h2>Yeni Şifre Belirle</h2>
            <p class="subtitle">Hesabınız için yeni bir şifre belirleyin.</p>
          </div>

          <form @submit.prevent="handleResetPassword" class="reset-password-form">
            <div class="form-group">
              <label for="password">Yeni Şifreniz</label>
              <input
                type="password"
                id="password"
                v-model="password"
                placeholder="En az 8 karakter"
                required
                autocomplete="new-password"
              />
            </div>
            <div class="form-group">
              <label for="confirm-password">Yeni Şifreniz (Tekrar)</label>
              <input
                type="password"
                id="confirm-password"
                v-model="confirmPassword"
                placeholder="Şifreyi tekrar girin"
                required
                autocomplete="new-password"
              />
            </div>
            <button type="submit" :disabled="isLoading">
              <span v-if="isLoading" class="spinner"></span>
              <span v-else>Şifreyi Sıfırla</span>
            </button>
          </form>

          <div v-if="message" class="alert success">{{ message }}</div>
          <div v-if="error" class="alert error">{{ error }}</div>

          <div class="card-footer">
            <p> <router-link to="/login" class="login-link">Giriş Yap</router-link></p>
          </div>
        </div>
      </div>
    </div>
    <FooterComponent />
  </div>
</template>

<style scoped>
/* Genel şifre sıfırlama formu stilleri (forgot-password-page ile benzer olabilir) */
.reset-password-page {
  min-height: 92vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, rgba(66, 184, 131, 0.1), rgba(53, 73, 94, 0.1));
}

.reset-password-view {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 0;
}

.reset-password-container {
  width: 100%;
  max-width: 420px;
  margin: 0 auto;
  padding: 0 1rem;
}

.reset-password-card {
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

.reset-password-form {
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

input[type="password"] {
  padding: 0.85rem 1rem;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  font-size: 1rem;
  color: var(--text-color);
  background: var(--input-bg);
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

input[type="password"]:focus {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(var(--primary-color-rgb), 0.2);
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
  background-color: #e6ffe6;
  color: #1a6f3b;
  border: 1px solid #7edc9c;
}

.alert.error {
  background-color: #ffe6e6;
  color: #a30000;
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
  .reset-password-card {
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