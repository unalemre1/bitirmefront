<script setup lang="ts">
import { ref } from 'vue'

// `props` değişkenini tanımlamadan doğrudan defineProps'ı çağırıyoruz.
// Props değerleri şablonda ve handleInput içinde doğrudan erişilebilir.
defineProps<{
  modelValue: string
  label: string
  id: string
  placeholder?: string
  error?: string
}>()

// `emit` değişkenini tanımlamadan doğrudan defineEmits'i çağırıyoruz.
// `handleInput` içinde `emit` fonksiyonuna doğrudan erişebiliriz.
const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const isFocused = ref(false)

const handleInput = (event: Event) => {
  const input = event.target as HTMLInputElement
  // Yalnızca sayıları kabul et ve 5 hane ile sınırla
  let value = input.value.replace(/\D/g, '').slice(0, 5)
  emit('update:modelValue', value) // `emit` fonksiyonuna doğrudan erişim
}
</script>

<template>
  <div class="form-group" :class="{ 'is-focused': isFocused }">
    <label :for="id" class="form-label">{{ label }}</label>
    <div class="input-wrapper">
      <input
        type="text"
        inputmode="numeric"
        pattern="[0-9]*"
        maxlength="5"
        :id="id"
        class="form-control"
        :class="{ 'is-invalid': error }"
        :value="modelValue"  <-- props.modelValue yerine doğrudan modelValue
        @input="handleInput"
        @focus="isFocused = true"
        @blur="isFocused = false"
        :placeholder="placeholder" <-- props.placeholder yerine doğrudan placeholder
      />
      <div class="input-highlight"></div>
    </div>
    <transition name="fade">
      <div v-if="error" class="error-message"> <-- props.error yerine doğrudan error
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