<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useTitle } from '@vueuse/core'
import FooterComponent from '../components/footer/FooterComponent.vue'
import FormInput from '../components/form/FormInput.vue'
import { profileApi } from '../api/profile'
import type { UserProfile } from '../types/profile'

useTitle('Profilim | LexAI')

// Extend UserProfile type to include optional password fields for updates
interface UserProfileWithPassword extends UserProfile {
  oldPassword?: string;
  newPassword?: string;
}

const profile = ref<UserProfileWithPassword>({
  name: '',
  surname: '',
  email: '',
  userType: 'user',
  oldPassword: '', // Initialize new fields
  newPassword: ''
})

const isEditing = ref(false)
const isSaving = ref(false)
const error = ref<string | null>(null)
const successMessage = ref<string | null>(null) // To show success message for password change

const toggleEdit = () => {
  isEditing.value = !isEditing.value
  // Clear password fields and messages when exiting edit mode
  if (!isEditing.value) {
    profile.value.oldPassword = ''
    profile.value.newPassword = ''
    error.value = null
    successMessage.value = null
  }
}

const fetchProfile = async () => {
  try {
    const data = await profileApi.fetchProfile()
    profile.value = { ...profile.value, ...data } // Merge fetched data
  } catch (err) {
    console.error('Error fetching profile:', err)
    error.value = 'Profil bilgileri yüklenirken bir hata oluştu'
  }
}

const saveProfile = async () => {
  error.value = null; // Clear previous errors
  successMessage.value = null; // Clear previous success messages

  if (isEditing.value && (profile.value.oldPassword || profile.value.newPassword)) {
    if (!profile.value.oldPassword || !profile.value.newPassword) {
      error.value = 'Eski şifre ve yeni şifre alanları boş bırakılamaz.';
      return;
    }
    if (profile.value.newPassword.length < 6) { // Example: Minimum password length
      error.value = 'Yeni şifre en az 6 karakter olmalıdır.';
      return;
    }
  }

  try {
    isSaving.value = true
    const updatedProfileData: Partial<UserProfileWithPassword> = {
      name: profile.value.name,
      surname: profile.value.surname,
      email: profile.value.email,
    };

    // Only include password fields if they are not empty (meaning user wants to change password)
    if (profile.value.oldPassword && profile.value.newPassword) {
      updatedProfileData.oldPassword = profile.value.oldPassword;
      updatedProfileData.newPassword = profile.value.newPassword;
    }

    const updatedProfile = await profileApi.updateProfile(updatedProfileData);
    profile.value = { ...profile.value, ...updatedProfile }; // Update profile with returned data

    // Handle password change specific success
    if (profile.value.oldPassword && profile.value.newPassword) {
      successMessage.value = 'Şifreniz başarıyla güncellendi.';
      profile.value.oldPassword = ''; // Clear password fields after successful update
      profile.value.newPassword = '';
    } else {
      successMessage.value = 'Profil bilgileriniz başarıyla güncellendi.';
    }

    isEditing.value = false
  } catch (err: any) {
    console.error('Error saving profile:', err)
    error.value = err.response?.data?.message || 'Profil güncellenirken bir hata oluştu';
  } finally {
    isSaving.value = false
  }
}

onMounted(() => {
  fetchProfile()
})
</script>

<template>
  <div class="profile-page">
    <div class="profile-container">
      <div class="profile-card">
        <div class="card-header">
          <div class="avatar">
            <i class="bi bi-person-circle"></i>
          </div>
          <h1>Profil Bilgileri</h1>
          <button
            class="edit-button"
            @click="toggleEdit"
            v-if="!isEditing"
          >
            <i class="bi bi-pencil"></i>
            Düzenle
          </button>
        </div>

        <div v-if="error" class="error-message">
          {{ error }}
        </div>
        <div v-if="successMessage" class="success-message">
          {{ successMessage }}
        </div>

        <form @submit.prevent="saveProfile" class="profile-form">
          <div class="form-row">
            <FormInput
              v-model="profile.name"
              label="Ad"
              id="profileName"
              :disabled="!isEditing"
            />

            <FormInput
              v-model="profile.surname"
              label="Soyad"
              id="profileSurname"
              :disabled="!isEditing"
            />
          </div>

          <FormInput
            v-model="profile.email"
            type="email"
            label="E-posta"
            id="profileEmail"
            :disabled="!isEditing"
          />

          <div class="user-type">
            <label>Hesap Türü</label>
            <div class="type-badge" :class="profile.userType">
              <i :class="profile.userType === 'lawyer' ? 'bi bi-briefcase' : 'bi bi-person'"></i>
              {{ profile.userType === 'lawyer' ? 'Avukat' : 'Kullanıcı' }}
            </div>
          </div>

          <FormInput
            v-if="profile.userType === 'lawyer'"
            v-model="profile.baro_sicil_no"
            label="Baro Sicil Numarası"
            id="profileBaroNo"
            :disabled="!isEditing"
          />

          <hr class="section-divider">
          <h2 class="section-title">Şifre Değişikliği</h2>
          <FormInput
            v-model="profile.oldPassword"
            type="password"
            label="Eski Şifre"
            id="oldPassword"
            autocomplete="current-password"
            :disabled="!isEditing" />
          <FormInput
            v-model="profile.newPassword"
            type="password"
            label="Yeni Şifre"
            id="newPassword"
            autocomplete="new-password"
            :disabled="!isEditing" />

          <div class="form-actions" v-if="isEditing">
            <button
              type="button"
              class="btn btn-secondary"
              @click="toggleEdit"
              :disabled="isSaving"
            >
              İptal
            </button>
            <button
              type="submit"
              class="btn btn-primary"
              :disabled="isSaving"
            >
              <span v-if="isSaving" class="loading-spinner">
                <i class="bi bi-arrow-repeat"></i>
              </span>
              <span v-else>Kaydet</span>
            </button>
          </div>
        </form>
      </div>
    </div>
    <FooterComponent />
  </div>
</template>

<style scoped>
/* Existing styles... */

/* Add styles for new elements */
.section-divider {
  border: 0;
  height: 1px;
  background-color: var(--border-color);
  margin: 2rem 0;
}

.section-title {
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  color: var(--text-color);
  text-align: center;
}

.success-message {
  background-color: #4CAF50; /* Green color for success */
  color: white;
  padding: 0.75rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
}

/* Ensure existing styles are not broken and new styles fit well */
.profile-page {
  min-height: 92vh;
  display: flex;
  flex-direction: column;
  background: var(--bg-color);
}

.profile-container {
  flex: 1;
  max-width: 800px;
  margin: 0 auto;
  padding: 3rem 1.5rem;
}

.profile-card {
  background: var(--card-bg);
  padding: 2.5rem;
  border-radius: 16px;
  box-shadow: 0 4px 6px var(--shadow-color);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 2rem;
  position: relative;
}

.avatar {
  width: 64px;
  height: 64px;
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar i {
  font-size: 32px;
  color: white;
}

.card-header h1 {
  font-size: 1.75rem;
  margin: 0;
  color: var(--text-color);
}

.edit-button {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: 2px solid var(--primary-color);
  color: var(--primary-color);
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
}

.edit-button:hover {
  background: var(--primary-color);
  color: white;
}

.error-message {
  background-color: var(--accent-color);
  color: white;
  padding: 0.75rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
}

.profile-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

.user-type {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.user-type label {
  font-weight: 500;
  color: var(--text-color);
}

.type-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-weight: 500;
  width: fit-content;
}

.type-badge.lawyer {
  background-color: var(--primary-color);
  color: white;
}

.type-badge.user {
  background-color: var(--secondary-color);
  color: white;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1rem;
}

.btn {
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-primary {
  background: var(--primary-color);
  color: white;
  border: none;
}

.btn-primary:hover:not(:disabled) {
  background: var(--primary-hover);
}

.btn-secondary {
  background: none;
  border: 2px solid var(--border-color);
  color: var(--text-color);
}

.btn-secondary:hover:not(:disabled) {
  border-color: var(--text-color);
}

.btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
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

@media (max-width: 768px) {
  .profile-container {
    padding: 2rem 1rem;
  }

  .profile-card {
    padding: 1.5rem;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .card-header {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
    margin-bottom: 1.5rem;
  }

  .edit-button {
    position: static;
    transform: none;
    width: 100%;
    justify-content: center;
  }
}
</style>