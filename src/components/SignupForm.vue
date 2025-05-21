<script setup lang="ts">
import { watch, ref } from 'vue'
import FormInput from './form/FormInput.vue'
import PasswordInput from './form/PasswordInput.vue'
import BaroSicilInput from './form/BaroSicilInput.vue'
import TermsCheckbox from './form/TermsCheckbox.vue'
import { useForm } from '../composables/useForm'
import { validators } from '../utils/validators'
import { useSharedPasswordVisibility } from '../composables/useSharedPasswordVisibility'
import { useAuth } from '../composables/useAuth'

const { formData, errors, isValid } = useForm()
const { showPassword, togglePasswordVisibility } = useSharedPasswordVisibility()
const { signup, isLoading, error: authError } = useAuth()
const termsAccepted = ref(false)
const userType = ref<'lawyer' | 'user'>('user')
const idCardPhoto = ref<File | null>(null)
const photoPreview = ref<string | null>(null)

const handlePhotoChange = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files && input.files[0]) {
    const file = input.files[0]
    idCardPhoto.value = file
    photoPreview.value = URL.createObjectURL(file)
  }
}

watch(() => formData.value, (newData) => {
  errors.value = {}
  
  const nameError = validators.required(newData.name)
  if (nameError !== true) errors.value.name = nameError

  const surnameError = validators.required(newData.surname)
  if (surnameError !== true) errors.value.surname = surnameError

  const emailError = validators.email(newData.email)
  if (emailError !== true) errors.value.email = emailError

  const passwordError = validators.minLength(6)(newData.password)
  if (passwordError !== true) errors.value.password = passwordError

  if (userType.value === 'lawyer') {
    const baroSicilError = validators.baroSicil(newData.baro_sicil_no)
    if (baroSicilError !== true) errors.value.baro_sicil_no = baroSicilError
    
    if (!idCardPhoto.value) {
      errors.value.idCardPhoto = 'Kimlik kartı fotoğrafı zorunludur'
    }
  }
}, { deep: true })

const handleSubmit = async () => {
  if (!isValid.value || !termsAccepted.value || isLoading.value) return

  const baseCredentials = {
    name: formData.value.name,
    surname: formData.value.surname,
    email: formData.value.email,
    password: formData.value.password,
    userType: userType.value
  }

  if (userType.value === 'lawyer') {
    if (!idCardPhoto.value) {
      errors.value.idCardPhoto = 'Kimlik kartı fotoğrafı zorunludur'
      return
    }

    await signup({
      ...baseCredentials,
      userType: 'lawyer',
      baro_sicil_no: formData.value.baro_sicil_no,
      idCardPhoto: idCardPhoto.value
    })
  } else {
    await signup({
      ...baseCredentials,
      userType: 'user'
    })
  }
}
</script>

<template>
  <form @submit.prevent="handleSubmit" novalidate class="signup-form">
    <div v-if="authError" class="error-message">
      {{ authError }}
    </div>

    <div class="user-type-selector">
      <button
        type="button"
        class="type-btn"
        :class="{ active: userType === 'user' }"
        @click="userType = 'user'"
      >
        <i class="bi bi-person"></i>
        Kullanıcı
      </button>
      <button
        type="button"
        class="type-btn"
        :class="{ active: userType === 'lawyer' }"
        @click="userType = 'lawyer'"
      >
        <i class="bi bi-briefcase"></i>
        Avukat
      </button>
    </div>

    <div class="name-group">
      <FormInput
        v-model="formData.name"
        label="Ad:"
        id="signupName"
        placeholder="Adınızı girin"
        :error="errors.name"
      />

      <FormInput
        v-model="formData.surname"
        label="Soyad:"
        id="signupSurname"
        placeholder="Soyadınızı girin"
        :error="errors.surname"
      />
    </div>

    <FormInput
      v-model="formData.email"
      type="email"
      label="E-posta:"
      id="signupEmail"
      placeholder="E-posta adresinizi girin"
      :error="errors.email"
    />

    <template v-if="userType === 'lawyer'">
      <BaroSicilInput
        v-model="formData.baro_sicil_no"
        label="Baro Sicil Numarası:"
        id="baroSicil"
        placeholder="5 haneli baro sicil numaranızı girin"
        :error="errors.baro_sicil_no"
      />

      <div class="form-group">
        <label class="form-label">Kimlik Kartı Fotoğrafı:</label>
        <div class="photo-upload-container">
          <input
            type="file"
            accept="image/*"
            @change="handlePhotoChange"
            class="photo-input"
            id="idCardPhoto"
          />
          <label for="idCardPhoto" class="photo-upload-btn">
            <i class="bi bi-upload"></i>
            Fotoğraf Yükle
          </label>
          <div v-if="photoPreview" class="photo-preview">
            <img :src="photoPreview" alt="Kimlik kartı önizleme" />
          </div>
        </div>
        <div v-if="errors.idCardPhoto" class="error-message">
          {{ errors.idCardPhoto }}
        </div>
      </div>
    </template>

    <PasswordInput
      v-model="formData.password"
      label="Şifre:"
      id="signupPassword"
      placeholder="Şifrenizi oluşturun"
      :error="errors.password"
      :show-toggle="true"
      :show-password="showPassword"
      @toggle-visibility="togglePasswordVisibility"
    />

    <PasswordInput
      v-model="formData.password_confirm"
      label="Şifreyi Onayla:"
      id="signupPasswordConfirm"
      placeholder="Şifrenizi tekrar girin"
      :error="errors.password_confirm"
      :show-password="showPassword"
    />

    <TermsCheckbox
      v-model="termsAccepted"
      id="termsCheckbox"
      label="Kullanıcı sözleşmesini kabul ediyorum"
      info-text="Kullanıcı Sözleşmesi"
      :terms-content="'Buraya kullanıcı sözleşmesi metni gelecek.'"
    />

    <button 
      type="submit" 
      class="btn btn-primary signup-button"
      :disabled="!isValid || !termsAccepted || isLoading"
    >
      <span v-if="isLoading" class="loading-spinner">
        <i class="bi bi-arrow-repeat"></i>
      </span>
      <span v-else>Hesap Oluştur</span>
    </button>
  </form>
</template>

<style scoped>
.signup-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.error-message {
  background-color: var(--accent-color);
  color: white;
  padding: 0.75rem;
  border-radius: 8px;
  font-size: 0.875rem;
}

.user-type-selector {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.type-btn {
  flex: 1;
  padding: 1rem;
  border: 2px solid var(--border-color);
  border-radius: 8px;
  background: var(--card-bg);
  color: var(--text-color);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.type-btn.active {
  border-color: var(--primary-color);
  background: var(--primary-color);
  color: white;
}

.type-btn i {
  font-size: 1.25rem;
}

.name-group {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.photo-upload-container {
  margin-top: 0.5rem;
}

.photo-input {
  display: none;
}

.photo-upload-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: var(--primary-color);
  color: white;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.photo-upload-btn:hover {
  background: var(--primary-hover);
}

.photo-preview {
  margin-top: 1rem;
  max-width: 300px;
}

.photo-preview img {
  width: 100%;
  height: auto;
  border-radius: 8px;
  border: 2px solid var(--border-color);
}

.signup-button {
  margin-top: 1rem;
  width: 100%;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
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
  .name-group {
    grid-template-columns: 1fr;
  }

  .user-type-selector {
    flex-direction: column;
  }
}
</style>