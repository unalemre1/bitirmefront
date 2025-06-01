<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useTitle } from '@vueuse/core'
import axios from 'axios'

useTitle('AI Chat | LexAI')

const messages = ref<Array<{ role: 'user' | 'assistant', content: string }>>([
  { role: 'assistant', content: 'Merhaba! Size nasıl yardımcı olabilirim?' }
])

const chatContainer = ref<HTMLDivElement | null>(null)
const showSidebar = ref(false)
const uploadedFile = ref<File | null>(null)
const uploadProgress = ref(0)

// Backend API URL'i
const API_URL = 'http://localhost:3000/api/upload-pdf'

// PDF yükleme fonksiyonu
const handleFileUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement
  if (!target.files || target.files.length === 0) return
  const file = target.files[0]
  uploadedFile.value = file
  uploadProgress.value = 0

  const formData = new FormData()
  formData.append('pdf', file)

  try {
    const response = await axios.post(API_URL, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total) {
          uploadProgress.value = Math.round((progressEvent.loaded * 100) / progressEvent.total)
        }
      }
    })
    messages.value.push({
      role: 'user',
      content: `PDF (${file.name}) yüklendi! Yanıt: ${response.data.reply || 'Yanıt alınamadı.'}`
    })
  } catch (error) {
    console.error('PDF yüklerken hata:', error)
    messages.value.push({
      role: 'assistant',
      content: 'Üzgünüm, PDF yükleme sırasında hata oluştu.'
    })
  }
  scrollToBottom()
}

const scrollToBottom = () => {
  setTimeout(() => {
    if (chatContainer.value) {
      chatContainer.value.scrollTop = chatContainer.value.scrollHeight
    }
  }, 100)
}

const toggleSidebar = () => showSidebar.value = !showSidebar.value
const closeSidebar = () => showSidebar.value = false

onMounted(() => scrollToBottom())
</script>

<template>
  <div class="chat-page">
    <aside class="chat-sidebar" :class="{ 'show-desktop': showSidebar, 'show-mobile': showSidebar }">
      <div class="sidebar-header">
        <h2>Sohbetler</h2>
        <button class="close-sidebar-mobile-button" @click="closeSidebar"><i class="bi bi-x-lg"></i></button>
      </div>
      <div class="sidebar-content">
        <button class="new-chat-button"><i class="bi bi-plus-lg"></i>Yeni Sohbet</button>
        <div class="conversations-list">
          <button class="conversation-item active"><i class="bi bi-chat-left-text"></i><span>Mevcut</span></button>
        </div>
      </div>
    </aside>

    <div class="sidebar-overlay" :class="{ 'show-mobile': showSidebar }" @click="closeSidebar"></div>

    <main class="chat-main" :class="{ 'shifted-desktop': showSidebar }">
      <header class="chat-header">
        <button class="menu-toggle-button" @click="toggleSidebar"><i :class="showSidebar ? 'bi bi-x-lg' : 'bi bi-list'"></i></button>
        <div class="header-content"><h1>LexAI Chat</h1></div>
      </header>

      <div class="messages-area" ref="chatContainer">
        <div v-for="(message, index) in messages" :key="index" class="message" :class="message.role">
          <div class="message-avatar">
            <i :class="message.role === 'assistant' ? 'bi bi-robot' : 'bi bi-person'"></i>
          </div>
          <div class="message-bubble">{{ message.content }}</div>
        </div>
      </div>

      <div class="input-area">
        <form class="input-form">
          <label class="file-upload-button">
            <i class="bi bi-paperclip"></i> PDF Yükle
            <input type="file" accept="application/pdf" @change="handleFileUpload" hidden />
          </label>
          <div v-if="uploadedFile" class="file-info">
            <span>{{ uploadedFile.name }}</span>
            <progress :value="uploadProgress" max="100">{{ uploadProgress }}%</progress>
          </div>
        </form>
      </div>
    </main>
  </div>
</template>

<style scoped>
.chat-page {
  height: 90vh; background: var(--bg-color); display: flex; overflow: hidden;
}
/* Sidebar ve diğer stiller eski haliyle bırakıldı */
.chat-sidebar { width: 280px; background: var(--card-bg); box-shadow: 2px 0 8px var(--shadow-color); }
.chat-sidebar.show-desktop { margin-left: 0; }
.chat-sidebar.show-mobile { transform: translateX(0); }
.sidebar-header { padding: 1rem; display: flex; justify-content: space-between; align-items: center; }
.close-sidebar-mobile-button { display: none; background: none; border: none; font-size: 1.25rem; cursor: pointer; }
@media (max-width: 768px) { .close-sidebar-mobile-button { display: block; } }
.sidebar-content { padding: 1rem; display: flex; flex-direction: column; gap: 1rem; }
.new-chat-button { width: 100%; padding: 0.75rem; background: var(--primary-color); color: white; border: none; border-radius: 8px; cursor: pointer; display: flex; align-items: center; gap: 0.5rem; }
.messages-area { flex: 1; overflow-y: auto; padding: 1rem; display: flex; flex-direction: column; gap: 1.5rem; background: var(--card-bg); border-radius: 12px; }
.message { display: flex; gap: 1rem; max-width: 80%; }
.message.user { flex-direction: row-reverse; align-self: flex-end; }
.message-avatar { width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; border-radius: 50%; }
.message.assistant .message-avatar { background: var(--primary-color); color: white; }
.message.user .message-avatar { background: var(--secondary-color); color: white; }
.message-bubble { padding: 1rem; border-radius: 12px; }
.message.assistant .message-bubble { background: var(--bg-color); }
.message.user .message-bubble { background: var(--primary-color); color: white; }
.input-area { padding: 1.5rem 1rem; background: var(--card-bg); border-radius: 12px; box-shadow: 0 2px 4px var(--shadow-color); position: relative; z-index: 1002; }
.input-form { display: flex; align-items: center; gap: 1rem; }
.file-upload-button { background: var(--primary-color); color: white; padding: 0.75rem 1rem; border-radius: 8px; cursor: pointer; display: flex; align-items: center; gap: 0.5rem; }
.file-info { display: flex; flex-direction: column; gap: 0.5rem; margin-left: 1rem; }
progress { width: 100%; height: 10px; border-radius: 5px; }
@media (max-width: 768px) {
  .input-area { position: fixed; bottom: 0; left: 0; width: 100%; border-radius: 0; }
  .messages-area { padding-bottom: 120px; }
}
</style>
