<script setup lang="ts">
import { ref } from 'vue'

// `props` değişkenini tanımlamadan doğrudan defineProps'ı çağırıyoruz.
// Props değerleri (modelValue, id, label, infoText, termsContent)
// şablonda doğrudan erişilebilir.
defineProps<{
  modelValue: boolean
  id: string
  label: string
  infoText?: string
  termsContent: string
}>()

// `emit` değişkenini tanımlamadan doğrudan defineEmits'i çağırıyoruz.
// `handleCheckboxChange` fonksiyonunda `emit`'e doğrudan erişebiliriz.
const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

const showModal = ref(false)

const toggleModal = () => {
  showModal.value = !showModal.value
}

const handleCheckboxChange = (event: Event) => {
  // event.target'ın bir HTMLInputElement olduğunu TypeScript'e bildiriyoruz
  if (event.target instanceof HTMLInputElement) {
    emit('update:modelValue', event.target.checked); // `emit` fonksiyonuna doğrudan erişim
  }
};
</script>

<template>
  <div class="terms-info">
    <p>
      {{ infoText }} <-- props.infoText yerine doğrudan infoText
      <button type="button" class="btn-link" @click="toggleModal">
        Daha fazla bilgi
      </button>
    </p>
  </div>

  <div class="terms-checkbox">
    <input
      type="checkbox"
      :id="id" <-- props.id yerine doğrudan id
      :checked="modelValue" <-- props.modelValue yerine doğrudan modelValue
      @change="handleCheckboxChange" />
    <label :for="id"> <-- props.id yerine doğrudan id
      {{ label }} <-- props.label yerine doğrudan label
    </label>
  </div>

  <Teleport to="body">
    <div v-if="showModal" class="modal-overlay" @click.self="toggleModal">
      <div class="modal">
        <header class="modal-header">
          <h2>Kullanıcı Sözleşmesi</h2>
          <button type="button" class="close-button" @click="toggleModal">×</button>
        </header>
        <main class="modal-content">
          <p>{{ termsContent }}</p> <-- props.termsContent yerine doğrudan termsContent
        </main>
        <footer class="modal-footer">
          <button type="button" class="btn-primary" @click="toggleModal">Tamam</button>
        </footer>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
/* Genel stil tanımlamaları */
.terms-info {
  font-size: 0.9rem;
  color: var(--text-color);
  margin-bottom: 0.5rem;
  transition: color 0.3s ease;
}

.btn-link {
  background: none;
  border: none;
  color: var(--primary-color);
  text-decoration: underline;
  cursor: pointer;
  font-size: inherit;
  padding: 0;
  margin: 0;
  transition: color 0.3s ease;
}

.btn-link:hover {
  color: var(--primary-hover);
}

.terms-checkbox {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.terms-checkbox label {
  color: var(--text-color);
  font-size: 0.9rem;
  user-select: none;
  transition: color 0.3s ease;
}

/* Modal stilleri */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
}

.modal {
  background: var(--card-bg);
  color: var(--text-color);
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 4px 6px var(--shadow-color);
  transition: background-color 0.3s ease, color 0.3s ease;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid var(--border-color);
  transition: border-color 0.3s ease;
}

.modal-header h2 {
  margin: 0;
  font-size: 1.25rem;
  color: var(--text-color);
  transition: color 0.3s ease;
}

.close-button {
  background: none;
  border: none;
  font-size: 1.5rem;
  line-height: 1;
  cursor: pointer;
  color: var(--text-color);
  padding: 0;
  opacity: 0.7;
  transition: opacity 0.2s ease, color 0.3s ease;
}

.close-button:hover {
  opacity: 1;
}

.modal-content {
  padding: 1.5rem;
  max-height: 60vh;
  overflow-y: auto;
  color: var(--text-color);
  font-size: 0.9rem;
  line-height: 1.5;
  transition: color 0.3s ease;
}

.modal-footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid var(--border-color);
  text-align: right;
  transition: border-color 0.3s ease;
}

.btn-primary {
  background-color: var(--primary-color);
  border: none;
  color: white;
  padding: 0.5rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.3s ease;
}

.btn-primary:hover {
  background-color: var(--primary-hover);
}

/* Medya sorguları */
@media (max-width: 480px) {
  .modal {
    width: 95%;
  }
  
  .modal-header,
  .modal-content,
  .modal-footer {
    padding: 1rem;
  }
}
</style>