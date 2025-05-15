import { ref, computed } from 'vue'

// Create a shared state for password visibility
const showPassword = ref(false)

export function useSharedPasswordVisibility() {
  const togglePasswordVisibility = () => {
    showPassword.value = !showPassword.value
  }

  return {
    showPassword,
    togglePasswordVisibility
  }
}