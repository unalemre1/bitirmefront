<script setup lang="ts">
import { ref } from 'vue'
import FormInput from '../form/FormInput.vue'
import PasswordInput from '../form/PasswordInput.vue'
import { useSharedPasswordVisibility } from '../../composables/useSharedPasswordVisibility'
import { useLoginForm } from '../../composables/useLoginForm'
import { useAuth } from '../../composables/useAuth'

const { formData, errors, handleBlur, validateForm, isValid } = useLoginForm()
const { showPassword, togglePasswordVisibility } = useSharedPasswordVisibility()
const { login, isLoading, error: authError } = useAuth()

const handleSubmit = async () => {
  try {
    console.log('Form submission started');
    validateForm();
    
    if (!isValid.value) {
      console.log('Form validation failed');
      return;
    }
    
    if (isLoading.value) {
      console.log('Already processing login request');
      return;
    }

    console.log('Attempting login with:', {
      email: formData.value.email,
      password: '********'
    });

    await login({
      email: formData.value.email,
      password: formData.value.password
    });

    console.log('Login process completed successfully');
  } catch (error) {
    console.error('Login form submission error:', error);
  }
};
</script>

<template>
  <form @submit.prevent="handleSubmit" novalidate class="login-form">
    <div v-if="authError" class="error-message">
      {{ authError }}
    </div>

    <div class="form-group">
      <FormInput
        v-model="formData.email"
        type="text"
        label="Kullanıcı Adı:"
        id="loginEmail"
        placeholder="Kullanıcı adınızı girin"
        :error="errors.email"
        @blur="handleBlur('email')"
      />
    </div>

    <div class="form-group">
      <PasswordInput
        v-model="formData.password"
        label="Şifre:"
        id="loginPassword"
        placeholder="Şifrenizi girin"
        :error="errors.password"
        :show-toggle="true"
        :show-password="showPassword"
        @toggle-visibility="togglePasswordVisibility"
        @blur="handleBlur('password')"
      />
    </div>

    <button 
      type="submit" 
      class="btn btn-primary login-button"
      :disabled="isLoading"
    >
      <span v-if="isLoading" class="loading-spinner">
        <i class="bi bi-arrow-repeat"></i>
      </span>
      <span v-else>Giriş Yap</span>
    </button>
  </form>
</template>

<style scoped>
.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  position: relative;
}

.error-message {
  background-color: var(--accent-color);
  color: white;
  padding: 0.75rem;
  border-radius: 8px;
  font-size: 0.875rem;
  margin-bottom: 1rem;
}

.login-button {
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
</style>