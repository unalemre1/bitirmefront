<script setup lang="ts">
import { computed } from 'vue'
import type { PasswordStrength } from '../../utils/passwordStrength'

const props = defineProps<{
  strength: PasswordStrength
}>()

const barStyle = computed(() => ({
  width: `${props.strength.score}%`,
  backgroundColor: props.strength.color,
}))
</script>

<template>
  <div class="password-strength">
    <div class="strength-bar-container">
      <div class="strength-bar" :style="barStyle">
        <div class="strength-bar-fill"></div>
      </div>
    </div>
    <div class="strength-label" :style="{ color: strength.color }">
      {{ strength.label }}
    </div>
  </div>
</template>

<style scoped>
.password-strength {
  margin-top: 0.5rem;
}

.strength-bar-container {
  height: 4px;
  background-color: var(--border-color);
  border-radius: 2px;
  overflow: hidden;
}

.strength-bar {
  height: 100%;
  transition: all 0.3s ease;
}

.strength-label {
  font-size: 0.75rem;
  margin-top: 0.25rem;
  text-align: right;
  transition: color 0.3s ease;
}
</style>