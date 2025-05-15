<script setup lang="ts">
import { useTitle } from '@vueuse/core'
import FooterComponent from '../components/footer/FooterComponent.vue'

useTitle('LexAI - Dashboard')
</script>

<template>
  <div class="auth-info-page">
    <div class="auth-info-view">
      <!-- Welcome Section -->
      <section class="welcome-section">
        <div class="welcome-content">
          <h1>Hoş Geldiniz</h1>
          <p class="subtitle">LexAI ile hukuki süreçlerinizi yönetin</p>
        </div>
      </section>

      <!-- Quick Actions -->
      <section class="quick-actions">
        <h2>Hızlı İşlemler</h2>
        <div class="actions-grid">
          <router-link to="/chat" class="action-card">
            <i class="bi bi-chat-dots"></i>
            <h3>AI Asistan</h3>
            <p>Hukuki sorularınız için AI asistanımızla görüşün</p>
          </router-link>

          <router-link to="/subscription" class="action-card">
            <i class="bi bi-star"></i>
            <h3>Abonelik</h3>
            <p>Abonelik planlarını inceleyin</p>
          </router-link>

          <div class="action-card">
            <i class="bi bi-file-earmark-text"></i>
            <h3>Belgelerim</h3>
            <p>Hukuki belgelerinizi yönetin</p>
          </div>

          <div class="action-card">
            <i class="bi bi-calendar-check"></i>
            <h3>Takvim</h3>
            <p>Duruşma ve toplantılarınızı planlayın</p>
          </div>
        </div>
      </section>

      <!-- Stats Section -->
      <section class="stats-section">
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon">
              <i class="bi bi-chat"></i>
            </div>
            <div class="stat-content">
              <h4>AI Görüşmeleri</h4>
              <p class="stat-value">24</p>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon">
              <i class="bi bi-file-text"></i>
            </div>
            <div class="stat-content">
              <h4>Belgeler</h4>
              <p class="stat-value">12</p>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon">
              <i class="bi bi-calendar2-week"></i>
            </div>
            <div class="stat-content">
              <h4>Aktif Davalar</h4>
              <p class="stat-value">8</p>
            </div>
          </div>
        </div>
      </section>
    </div>
    <FooterComponent />
  </div>
</template>

<style scoped>
.auth-info-page {
  min-height: 92vh;
  display: flex;
  flex-direction: column;
  background: var(--bg-color);
}

.auth-info-view {
  flex: 1;
  padding: 2rem 1rem;
}

/* Welcome Section */
.welcome-section {
  text-align: center;
  padding: 3rem 0;
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  color: white;
  border-radius: 16px;
  margin-bottom: 3rem;
}

.welcome-content h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.welcome-content .subtitle {
  font-size: 1.25rem;
  opacity: 0.9;
}

/* Quick Actions */
.quick-actions {
  max-width: 1200px;
  margin: 0 auto 3rem;
  padding: 0 1rem;
}

.quick-actions h2 {
  font-size: 1.75rem;
  margin-bottom: 2rem;
  color: var(--text-color);
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.action-card {
  background: var(--card-bg);
  padding: 2rem;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 4px 6px var(--shadow-color);
  transition: all 0.3s ease;
  text-decoration: none;
  color: var(--text-color);
}

.action-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 15px var(--shadow-color);
}

.action-card i {
  font-size: 2rem;
  color: var(--primary-color);
  margin-bottom: 1rem;
}

.action-card h3 {
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
}

.action-card p {
  opacity: 0.8;
  font-size: 0.9rem;
  line-height: 1.5;
}

/* Stats Section */
.stats-section {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
}

.stat-card {
  background: var(--card-bg);
  padding: 1.5rem;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 4px 6px var(--shadow-color);
}

.stat-icon {
  width: 48px;
  height: 48px;
  background: var(--primary-color);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-icon i {
  font-size: 1.5rem;
  color: white;
}

.stat-content h4 {
  font-size: 0.9rem;
  color: var(--text-color);
  opacity: 0.8;
  margin-bottom: 0.25rem;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--text-color);
}

@media (max-width: 768px) {
  .welcome-section {
    padding: 2rem 1rem;
  }

  .welcome-content h1 {
    font-size: 2rem;
  }

  .quick-actions h2 {
    font-size: 1.5rem;
  }

  .actions-grid {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  }
}

@media (max-width: 480px) {
  .welcome-content h1 {
    font-size: 1.75rem;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }
}
</style>