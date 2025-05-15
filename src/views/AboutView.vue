<script setup lang="ts">
import { useTitle } from '@vueuse/core'
import FooterComponent from '../components/footer/FooterComponent.vue'

useTitle('Hakkımızda | LexAI')
</script>

<template>
  <div class="about-page">
    <div class="about-container">
      <div class="about-header">
        <h1>Hakkımızda</h1>
        <div class="divider"></div>
      </div>
      
      <section class="about-section">
        <h2>Biz Kimiz?</h2>
        <p>
          LexAI, 2024 yılında bir bilgisayar mühendisliği öğrencileri tarafından kurulmuş, hukuk profesyonellerine
          yapay zeka destekli çözümler sunan yenilikçi bir platformdur. Amacımız, avukatların ve hukuk
          danışmanlarının günlük işlerini kolaylaştırmak, verimliliklerini artırmak ve daha iyi hukuki
          hizmetler sunmalarına yardımcı olmaktır.
        </p>
      </section>
      
      <section class="about-section">
        <h2>Misyonumuz</h2>
        <p>
          Hukuk dünyasını teknoloji ile buluşturarak, adalet sisteminin daha hızlı, erişilebilir ve
          verimli olmasına katkıda bulunmak. Yapay zeka teknolojimiz ile hukuki araştırma, belge analizi
          ve dava yönetimi süreçlerini optimize ederek, hukuk profesyonellerinin zamanlarını daha iyi yönetebilmelerini sağlamak.
        </p>
      </section>
      
      <section class="about-section">
        <h2>Vizyonumuz</h2>
        <p>
          Hukuk teknolojileri alanında öncü bir platform olarak, yapay zeka destekli çözümlerimizle
          global ölçekte hukuk sistemlerinin dijital dönüşümüne öncülük etmek. Her hukuk profesyonelinin
          erişebileceği, güvenilir bir asistan olmak.
        </p>
      </section>
      
      <section class="about-section">
        <h2>Ekibimiz</h2>
        <div class="team-grid">
          <div class="team-member">
            <div class="member-avatar">
              <i class="bi bi-person-circle"></i>
            </div>
            <h3>Hamdi Cem Karkıner</h3>
            <p class="member-title">Kurucu & CEO</p>
            <p class="member-bio">
              Yapay Zeka
            </p>
          </div>
          
          <div class="team-member">
            <div class="member-avatar">
              <i class="bi bi-person-circle"></i>
            </div>
            <h3>Emre Ünal</h3>
            <p class="member-title">CTO</p>
            <p class="member-bio">
              Frontend
            </p>
          </div>
          
          <div class="team-member">
            <div class="member-avatar">
              <i class="bi bi-person-circle"></i>
            </div>
            <h3>Ali Uzunkulaoğlu</h3>
            <p class="member-title">Hukuk Danışmanı</p>
            <p class="member-bio">
              Backend
            </p>
          </div>
          
          <div class="team-member">
            <div class="member-avatar">
              <i class="bi bi-person-circle"></i>
            </div>
            <h3>Kaan Yılmaz</h3>
            <p class="member-title">Ürün Yöneticisi</p>
            <p class="member-bio">
              Yapay Zeka
            </p>
          </div>
        </div>
      </section>
      
      <section class="about-section">
        <h2>İletişim</h2>
        <p>
          Sorularınız veya işbirliği teklifleriniz için bizimle iletişime geçebilirsiniz:
        </p>
        <div class="contact-info">
          <div class="contact-item">
            <i class="bi bi-envelope"></i>
            <span>info@lexai.com</span>
          </div>
          <div class="contact-item">
            <i class="bi bi-telephone"></i>
            <span>+90 212 123 4567</span>
          </div>
          <div class="contact-item">
            <i class="bi bi-geo-alt"></i>
            <span>Ankara</span>
          </div>
        </div>
      </section>
    </div>
    <FooterComponent />
  </div>
</template>

<style scoped>
.about-page {
  min-height: 92vh;
  display: flex;
  flex-direction: column;
  background-color: var(--bg-color);
}

.about-container {
  flex: 1;
  max-width: 900px;
  margin: 0 auto;
  padding: 3rem 1.5rem;
}

.about-header {
  text-align: center;
  margin-bottom: 3rem;
}

.about-header h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.divider {
  height: 4px;
  width: 80px;
  margin: 0 auto;
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  border-radius: 2px;
}

.about-section {
  margin-bottom: 3rem;
}

.about-section h2 {
  font-size: 1.75rem;
  margin-bottom: 1.25rem;
  color: var(--text-color);
  position: relative;
  padding-bottom: 0.5rem;
}

.about-section h2::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 50px;
  height: 3px;
  background-color: var(--primary-color);
  border-radius: 1.5px;
}

.about-section p {
  font-size: 1.1rem;
  line-height: 1.7;
  color: var(--text-color);
  opacity: 0.9;
}

.team-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}

.team-member {
  text-align: center;
  background-color: var(--card-bg);
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px var(--shadow-color);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.team-member:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 15px var(--shadow-color);
}

.member-avatar {
  width: 80px;
  height: 80px;
  margin: 0 auto 1rem;
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.member-avatar i {
  font-size: 40px;
  color: white;
}

.team-member h3 {
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
  color: var(--text-color);
}

.member-title {
  font-size: 0.9rem;
  color: var(--primary-color);
  font-weight: 600;
  margin-bottom: 1rem;
}

.member-bio {
  font-size: 0.9rem;
  line-height: 1.5;
  color: var(--text-color);
  opacity: 0.8;
}

.contact-info {
  margin-top: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 1.1rem;
  color: var(--text-color);
}

.contact-item i {
  font-size: 1.25rem;
  color: var(--primary-color);
}

@media (max-width: 768px) {
  .about-header h1 {
    font-size: 2rem;
  }
  
  .about-section h2 {
    font-size: 1.5rem;
  }
  
  .about-section p {
    font-size: 1rem;
  }
  
  .team-grid {
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  }
}

@media (max-width: 480px) {
  .about-container {
    padding: 2rem 1rem;
  }
  
  .team-grid {
    grid-template-columns: 1fr;
  }
}
</style>