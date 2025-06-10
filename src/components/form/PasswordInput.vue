<script setup lang="ts">
import { ref, computed } from 'vue'
import { calculatePasswordStrength } from '../../utils/passwordStrength'
import { validatePassword } from '../../utils/passwordValidation'
import PasswordStrengthBar from './PasswordStrengthBar.vue'
import PasswordRequirements from './PasswordRequirements.vue'

// `props` değişkenini tanımlamadan doğrudan defineProps'ı çağırıyoruz.
// Props değerleri (modelValue, label, id, placeholder, error, showToggle, showPassword)
// şablonda ve script içindeki fonksiyonlarda doğrudan erişilebilir.
defineProps<{
  modelValue: string
  label: string
  id: string
  placeholder?: string
  error?: string
  showToggle?: boolean
  showPassword?: boolean
}>()

// `emit` değişkenini tanımlamadan doğrudan defineEmits'i çağırıyoruz.
// `$emit` fonksiyonuna şablonda doğrudan erişebiliriz.
defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'toggle-visibility'): void
}>()

const isFocused = ref(false)
const showRequirements = ref(false)

// Props değerlerine doğrudan erişiyoruz (props.modelValue yerine modelValue)
const inputType = computed(() => showPassword ? 'text' : 'password')
const toggleIcon = computed(() => showPassword ? 'bi bi-eye-slash' : 'bi bi-eye')
const strength = computed(() => calculatePasswordStrength(modelValue))
const validation = computed(() => validatePassword(modelValue))

const handleFocus = () => {
  isFocused.value = true
  // props.id yerine doğrudan id
  if (id === 'signupPassword') {
    showRequirements.value = true
  }
}

const handleBlur = () => {
  isFocused.value = false
  // props.modelValue yerine doğrudan modelValue
  if (!modelValue) {
    showRequirements.value = false
  }
}
</script>

<template>
  <div class="form-group" :class="{ 'is-focused': isFocused }">
    <label :for="id" class="form-label">{{ label }}</label>
    <div class="input-wrapper">
      <input
        :type="inputType"
        :id="id"
        class="form-control"
        :class="{ 'is-invalid': error }"
        :value="modelValue"
        @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
        @focus="handleFocus"
        @blur="handleBlur"
        :placeholder="placeholder"
      />
      <button
        v-if="showToggle"
        type="button"
        class="toggle-password"
        @click="$emit('toggle-visibility')"
        :aria-label="showPassword ? 'Şifreyi gizle' : 'Şifreyi göster'"
      >
        <i :class="toggleIcon"></i>
      </button>

      <div class="input-highlight"></div>
    </div>
    
    <transition name="fade">
      <PasswordRequirements
        v-if="id === 'signupPassword' && (showRequirements || modelValue)"
        :validation="validation"
        class="requirements-wrapper"
      />
    </transition>

    <PasswordStrengthBar 
      v-if="modelValue && showToggle && id === 'signupPassword'"
      :strength="strength"
    />

    <transition name="fade">
      <div v-if="error" class="error-message">
        {{ error }}
      </div>
    </transition>
  </div>
</template>

<style scoped>
.form-control {
  width: 100%;
  font-size: 1rem;
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-sizing: border-box;
}

.input-wrapper {
  position: relative;
  margin-top: 13px;
}

.toggle-password {
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.25rem;
  color: #666;
}

.input-highlight {
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 0;
  height: 2px;
  background: var(--primary-color);
  transition: width 0.3s ease, left 0.3s ease;
}

.is-focused .input-highlight {
  width: 100%;
  left: 0;
}

.error-message {
  font-size: 0.875rem;
  color: var(--accent-color);
  margin-top: 0.5rem;
}

.requirements-wrapper {
  margin-top: 0.5rem;
  padding: 0.5rem;
  border-radius: 4px;
  background-color: var(--card-bg);
  border: 1px solid var(--border-color);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>