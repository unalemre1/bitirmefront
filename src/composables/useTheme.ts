import { ref, watch } from 'vue'

export function useTheme() {
  const isDarkMode = ref(false)

  // Initialize theme from localStorage if available
  const storedTheme = localStorage.getItem('theme')
  if (storedTheme) {
    isDarkMode.value = storedTheme === 'dark'
    applyTheme(isDarkMode.value)
  }

  // Watch for theme changes and update localStorage
  watch(isDarkMode, (newValue) => {
    localStorage.setItem('theme', newValue ? 'dark' : 'light')
    applyTheme(newValue)
  })

  function applyTheme(isDark: boolean) {
    document.body.classList.toggle('dark-mode', isDark)
  }

  function toggleTheme() {
    isDarkMode.value = !isDarkMode.value
  }

  return {
    isDarkMode,
    toggleTheme
  }
}