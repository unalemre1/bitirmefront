<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  modelValue: string
  label: string
  type?: string
  id: string
  placeholder?: string
  error?: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const isFocused = ref(false)

</script>

<template>
  <div class="form-group" :class="{ 'is-focused': isFocused }">
    <label :for="id" class="form-label">{{ label }}</label>
    <div class="input-wrapper">
      <input
        :type="type || 'text'"
        :id="id"
        class="form-control"
        :class="{ 'is-invalid': error }"
        :value="modelValue"
        @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
        @focus="isFocused = true"
        @blur="isFocused = false"
        :placeholder="placeholder"
      />
      <div class="input-highlight"></div>
    </div>
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
</style>
