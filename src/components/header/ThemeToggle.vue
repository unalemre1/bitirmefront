<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  isDarkMode: boolean
}>()

const emit = defineEmits<{
  (e: 'toggle'): void
}>()

const themeIcon = computed(() => props.isDarkMode ? 'bi bi-sun' : 'bi bi-moon')
</script>

<template>
  <button 
    class="theme-btn"
    aria-label="Tema Değiştir"
    @click="$emit('toggle')"
  >
    <i :class="themeIcon"></i>
  </button>
</template>

<style scoped>
.theme-btn {
  background-color: transparent;
  padding: 0.5rem;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  color: var(--text-color);
  border: 2px solid transparent;
  cursor: pointer;
}

.theme-btn:hover {
  background-color: var(--primary-color);
  color: white;
  transform: rotate(15deg);
}

.theme-btn i {
  font-size: 1.25rem;
  transition: transform 0.3s ease;
}

.theme-btn:hover i {
  transform: scale(1.1);
}
</style>