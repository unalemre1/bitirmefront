<script setup lang="ts">
import { PASSWORD_MESSAGES } from '../../constants/passwordRequirements'
import type { PasswordValidationResult } from '../../utils/passwordValidation'

defineProps<{
  validation: PasswordValidationResult
}>()
</script>

<template>
  <div class="password-requirements">
    <ul class="requirements-list">
      <li :class="{ met: validation.requirements.minLength }">
        <i :class="validation.requirements.minLength ? 'bi bi-check-circle-fill' : 'bi bi-circle'"></i>
        {{ PASSWORD_MESSAGES.minLength }}
      </li>
      <li :class="{ met: validation.requirements.hasUppercase }">
        <i :class="validation.requirements.hasUppercase ? 'bi bi-check-circle-fill' : 'bi bi-circle'"></i>
        {{ PASSWORD_MESSAGES.uppercase }}
      </li>
      <li :class="{ met: validation.requirements.hasLowercase }">
        <i :class="validation.requirements.hasLowercase ? 'bi bi-check-circle-fill' : 'bi bi-circle'"></i>
        {{ PASSWORD_MESSAGES.lowercase }}
      </li>
      <li :class="{ met: validation.requirements.hasNumber }">
        <i :class="validation.requirements.hasNumber ? 'bi bi-check-circle-fill' : 'bi bi-circle'"></i>
        {{ PASSWORD_MESSAGES.number }}
      </li>
      <li :class="{ met: validation.requirements.hasSpecial }">
        <i :class="validation.requirements.hasSpecial ? 'bi bi-check-circle-fill' : 'bi bi-circle'"></i>
        {{ PASSWORD_MESSAGES.special }}
      </li>
    </ul>
  </div>
</template>

<style scoped>
.password-requirements {
  font-size: 0.875rem;
}

.requirements-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.requirements-list li {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.25rem;
  color: var(--text-color);
  opacity: 0.7;
  transition: all 0.2s ease;
}

.requirements-list li.met {
  color: var(--primary-color);
  opacity: 1;
}

.requirements-list li i {
  font-size: 1rem;
}
</style>