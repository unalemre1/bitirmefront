<script setup lang="ts">
import { useTitle } from '@vueuse/core'
import { useRouter } from 'vue-router'
import FooterComponent from '../components/footer/FooterComponent.vue'

useTitle('LexAI - Hukuki Asistan')

const router = useRouter()

const navigateToSignup = () => router.push('/signup')
</script>

<template>
  <div class="info-page">
    <div class="info-view">
      <!-- Hero Section -->
      <section class="hero-section">
        <div class="hero-content">
          <h1 class="hero-title">LexAI</h1>
          <p class="hero-subtitle">Yapay Zeka Destekli Hukuk Asistanınız</p>
          <p class="hero-description">
            LexAI, modern hukuk dünyasının ihtiyaçlarına yönelik geliştirilmiş, yapay zeka destekli bir hukuki asistan platformudur.
          </p>
          <div class="hero-buttons">
            <button class="btn btn-primary hero-btn" @click="navigateToSignup">
              Hemen Başla
            </button>
            <router-link to="/login" class="btn btn-outline hero-btn">
              Giriş Yap
            </router-link>
          </div>
        </div>
      </section>

      <!-- Features Section -->
      <section class="features-section">
        <h2 class="section-title">Neler Sunuyoruz?</h2>
        <div class="features-grid">
          <div class="feature-item">
            <i class="bi bi-shield-check feature-icon"></i>
            <h3>Güvenli Belge Yönetimi</h3>
            <p>Tüm hukuki belgelerinizi güvenle saklayın, düzenleyin ve istediğiniz zaman erişin.</p>
          </div>

          <div class="feature-item">
            <i class="bi bi-calendar-check feature-icon"></i>
            <h3>Dava Takip Sistemi</h3>
            <p>Davalarınızı ve duruşmalarınızı akıllı takvim sistemiyle takip edin, önemli tarihleri kaçırmayın.</p>
          </div>

          <div class="feature-item">
            <i class="bi bi-robot feature-icon"></i>
            <h3>AI Destekli Analiz</h3>
            <p>Yapay zeka teknolojimiz ile hukuki metinlerinizi analiz edin, benzer davaları inceleyin.</p>
          </div>

          <div class="feature-item">
            <i class="bi bi-chat-dots feature-icon"></i>
            <h3>Anlık İletişim</h3>
            <p>Müvekkillerinizle güvenli bir şekilde iletişim kurun, belge paylaşın ve görüşmeler planlayın.</p>
          </div>
        </div>
      </section>

      <!-- Benefits Section -->
      <section class="benefits-section">
        <h2 class="section-title">Neden LexAI?</h2>
        <div class="benefits-container">
          <div class="benefit-item">
            <i class="bi bi-clock-history benefit-icon"></i>
            <div class="benefit-content">
              <h3>Zaman Tasarrufu</h3>
              <p>Rutin işlerinizi otomatikleştirerek size değerli zamanınızı geri kazandırıyoruz.</p>
            </div>
          </div>

          <div class="benefit-item">
            <i class="bi bi-graph-up-arrow benefit-icon"></i>
            <div class="benefit-content">
              <h3>Verimlilik Artışı</h3>
              <p>Akıllı özelliklerimizle iş süreçlerinizi optimize ediyor, verimliliğinizi artırıyoruz.</p>
            </div>
          </div>

          <div class="benefit-item">
            <i class="bi bi-shield-lock benefit-icon"></i>
            <div class="benefit-content">
              <h3>Maksimum Güvenlik</h3>
              <p>En son güvenlik protokolleriyle verilerinizi koruyoruz.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- CTA Section -->
      <section class="cta-section">
        <div class="cta-content">
          <h2>Hemen Başlayın</h2>
          <p>LexAI ile hukuki süreçlerinizi daha verimli yönetin.</p>
          <button class="btn btn-primary cta-btn" @click="navigateToSignup">
            Ücretsiz Hesap Oluştur
          </button>
        </div>
      </section>
    </div>
    <FooterComponent />
  </div>
</template>

<style scoped>
.info-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.info-view {
  flex: 1;
  overflow-y: auto;
}

/* Hero Section */
.hero-section {
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  color: white;
  padding: 4rem 2rem;
  text-align: center;
  }

.hero-content {
  max-width: 800px;
  margin: 0 auto;
}

.hero-title {
  font-size: 3.5rem;
  margin-bottom: 1rem;
  font-weight: 700;
}

.hero-subtitle {
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  opacity: 0.9;
}

.hero-description {
  font-size: 1.1rem;
  margin-bottom: 2rem;
  opacity: 0.8;
  line-height: 1.6;
}

.hero-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.hero-btn {
  padding: 0.75rem 2rem;
  font-size: 1.1rem;
  font-weight: 600;
  text-decoration: none;
}

.btn-outline {
  background: transparent;
  border: 2px solid white;
  color: white;
}

.btn-outline:hover {
  background: rgba(255, 255, 255, 0.1);
}

/* Features Section */
.features-section {
  padding: 4rem 2rem;
  background: var(--bg-color);
}

.section-title {
  text-align: center;
  font-size: 2rem;
  margin-bottom: 3rem;
  color: var(--text-color);
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.feature-item {
  text-align: center;
  padding: 2rem;
  background: var(--card-bg);
  border-radius: 12px;
  box-shadow: 0 4px 6px var(--shadow-color);
  transition: transform 0.3s ease;
}

.feature-item:hover {
  transform: translateY(-5px);
}

.feature-icon {
  font-size: 2.5rem;
  color: var(--primary-color);
  margin-bottom: 1rem;
}

.feature-item h3 {
  font-size: 1.25rem;
  margin-bottom: 1rem;
  color: var(--text-color);
}

.feature-item p {
  color: var(--text-color);
  opacity: 0.8;
  line-height: 1.6;
}

/* Benefits Section */
.benefits-section {
  padding: 4rem 2rem;
  background: var(--card-bg);
}

.benefits-container {
  max-width: 900px;
  margin: 0 auto;
}

.benefit-item {
  display: flex;
  align-items: flex-start;
  gap: 1.5rem;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: var(--bg-color);
  border-radius: 12px;
  transition: transform 0.3s ease;
}

.benefit-item:hover {
  transform: translateX(10px);
}

.benefit-icon {
  font-size: 2rem;
  color: var(--primary-color);
  flex-shrink: 0;
}

.benefit-content h3 {
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
  color: var(--text-color);
}

.benefit-content p {
  color: var(--text-color);
  opacity: 0.8;
  line-height: 1.6;
}

/* CTA Section */
.cta-section {
  padding: 4rem 2rem;
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  color: white;
  text-align: center;
}

.cta-content {
  max-width: 600px;
  margin: 0 auto;
}

.cta-content h2 {
  font-size: 2rem;
  margin-bottom: 1rem;
}

.cta-content p {
  font-size: 1.1rem;
  margin-bottom: 2rem;
  opacity: 0.9;
}

.cta-btn {
  padding: 1rem 3rem;
  font-size: 1.1rem;
  font-weight: 600;
  background: white;
  color: var(--primary-color);
}

.cta-btn:hover {
  background: rgba(255, 255, 255, 0.9);
  transform: translateY(-2px);
}

/* Responsive Design */
@media (max-width: 768px) {
  .hero-title {
    font-size: 2.5rem;
  }

  .hero-subtitle {
    font-size: 1.25rem;
  }

  .hero-buttons {
    flex-direction: column;
  }

  .features-grid {
    grid-template-columns: 1fr;
  }

  .benefit-item {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
}

@media (max-width: 480px) {
  .hero-section {
    padding: 3rem 1rem;
  }

  .section-title {
    font-size: 1.75rem;
  }

  .feature-item,
  .benefit-item {
    padding: 1.5rem 1rem;
  }
}
</style>