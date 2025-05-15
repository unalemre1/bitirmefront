import { ref, computed } from 'vue'

export function usePasswordVisibility() {
  const showPassword = ref(false)

  const inputType = computed(() => showPassword.value ? 'text' : 'password')
  const toggleIcon = computed(() => showPassword.value ? 'bi bi-eye-slash' : 'bi bi-eye')

  const togglePasswordVisibility = () => {
    showPassword.value = !showPassword.value
  }

  return {
    showPassword,
    inputType,
    toggleIcon,
    togglePasswordVisibility
  }
}