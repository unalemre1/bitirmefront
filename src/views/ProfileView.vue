<script setup lang="ts">
import { ref, computed } from 'vue'
import { calculatePasswordStrength } from '../../utils/passwordStrength'
import { validatePassword } from '../../utils/passwordValidation'
import PasswordStrengthBar from './PasswordStrengthBar.vue'
import PasswordRequirements from './PasswordRequirements.vue'

// Props'u bir değişkene atayarak kullanılabilir hale getiriyoruz
const props = defineProps<{
  modelValue: string
  label: string
  id: string
  placeholder?: string
  error?: string
  showToggle?: boolean
  showPassword?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'toggle-visibility'): void
}>()

const isFocused = ref(false)
const showRequirements = ref(false)

// Artık props.showPassword şeklinde erişiyoruz
const inputType = computed(() => props.showPassword ? 'text' : 'password')
const toggleIcon = computed(() => props.showPassword ? 'bi bi-eye-slash' : 'bi bi-eye')
const strength = computed(() => calculatePasswordStrength(props.modelValue))
const validation = computed(() => validatePassword(props.modelValue))

const handleFocus = () => {
  isFocused.value = true
  if (props.id === 'signupPassword') {
    showRequirements.value = true
  }
}

const handleBlur = () => {
  isFocused.value = false
  if (!props.modelValue) {
    showRequirements.value = false
  }
}
</script>

<template>
  <!-- Template kısmı aynı kalabilir çünkü $emit ve props otomatik olarak şablonda erişilebilir -->
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

    <div v-if="error" class="error-message">
      {{ error }}
    </div>
  </div>
</template>