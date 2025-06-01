<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useTitle } from '@vueuse/core'
import axios from 'axios'

useTitle('AI Chat | LexAI')

const messages = ref<Array<{ role: 'user' | 'assistant', content: string }>>([
  { role: 'assistant', content: 'Merhaba! Size nasıl yardımcı olabilirim?' }
])
const newMessage = ref('')
const chatContainer = ref<HTMLDivElement | null>(null)
const showSidebar = ref(false)
const attachedFiles = ref<File[]>([]) // Array to store attached files

// Backend API URL'ini buraya tanımlayın
const API_URL = 'http://localhost:3000/api/chat'; // Burayı kendi backend URL'inizle değiştirin!

const sendMessage = async () => {
  if (!newMessage.value.trim() && attachedFiles.value.length === 0) return

  const userMessageContent = newMessage.value
  messages.value.push({
    role: 'user',
    content: userMessageContent || 'Dosya gönderildi.' // If only files are sent
  })

  newMessage.value = ''

  messages.value.push({
    role: 'assistant',
    content: 'Yapay zeka yanıtı bekleniyor...'
  })
  scrollToBottom()

  try {
    const formData = new FormData();
    formData.append('message', userMessageContent);

    attachedFiles.value.forEach((file, index) => {
      formData.append(`file${index}`, file); // Append each file
    });

    const response = await axios.post(API_URL, formData, {
      headers: {
        'Content-Type': 'multipart/form-data' // Important for file uploads
      }
    });

    messages.value[messages.value.length - 1] = {
      role: 'assistant',
      content: response.data.reply || 'Yanıt alınamadı.'
    };
    attachedFiles.value = []; // Clear attached files after sending

  } catch (error) {
    console.error('Mesaj gönderirken hata oluştu:', error);
    messages.value[messages.value.length - 1] = {
      role: 'assistant',
      content: 'Üzgünüm, bir hata oluştu. Lütfen tekrar deneyin.'
    };
  } finally {
    scrollToBottom();
  }
}

const handleFileChange = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input.files) {
    // Convert FileList to Array and filter for PDFs
    attachedFiles.value = Array.from(input.files).filter(file => file.type === 'application/pdf');
    // Optionally, you can add a message to the user if non-PDF files are selected.
    if (input.files.length > attachedFiles.value.length) {
      alert('Sadece PDF dosyaları yüklenebilir. Diğer dosya türleri yoksayıldı.');
    }
  }
}

const scrollToBottom = () => {
  setTimeout(() => {
    if (chatContainer.value) {
      chatContainer.value.scrollTop = chatContainer.value.scrollHeight
    }
  }, 100)
}

const toggleSidebar = () => {
  showSidebar.value = !showSidebar.value
}

const closeSidebar = () => {
  showSidebar.value = false
}

onMounted(() => {
  scrollToBottom()
})
</script>

<template>
  <div class="chat-page">
    <aside class="chat-sidebar" :class="{ 'show-desktop': showSidebar, 'show-mobile': showSidebar }">
      <div class="sidebar-header">
        <h2>Sohbetler</h2>
        <button class="close-sidebar-mobile-button" @click="closeSidebar">
          <i class="bi bi-x-lg"></i>
        </button>
      </div>
      <div class="sidebar-content">
        <button class="new-chat-button">
          <i class="bi bi-plus-lg"></i>
          Yeni Sohbet
        </button>
        <div class="conversations-list">
          <button class="conversation-item active">
            <i class="bi bi-chat-left-text"></i>
            <span>Mevcut Sohbet</span>
          </button>
          <button class="conversation-item">
            <i class="bi bi-chat-left-text"></i>
            <span>Önceki Sohbet 1</span>
          </button>
        </div>
      </div>
    </aside>

    <div
      class="sidebar-overlay"
      :class="{ 'show-mobile': showSidebar }"
      @click="closeSidebar"
    ></div>

    <main class="chat-main" :class="{ 'shifted-desktop': showSidebar }">
      <header class="chat-header">
        <button class="menu-toggle-button" @click="toggleSidebar">
          <i :class="showSidebar ? 'bi bi-x-lg' : 'bi bi-list'"></i>
        </button>
        <div class="header-content">
          <h1>LexAI Chat</h1>
        </div>
      </header>

      <div class="messages-area" ref="chatContainer">
        <div
          v-for="(message, index) in messages"
          :key="index"
          class="message"
          :class="message.role"
        >
          <div class="message-avatar">
            <i :class="message.role === 'assistant' ? 'bi bi-robot' : 'bi bi-person'"></i>
          </div>
          <div class="message-bubble">
            {{ message.content }}
          </div>
        </div>
      </div>

      <div class="input-area">
        <form @submit.prevent="sendMessage" class="input-form">
          <label for="pdf-upload" class="attach-button">
            <i class="bi bi-paperclip"></i>
            <input
              type="file"
              id="pdf-upload"
              accept="application/pdf"
              multiple
              @change="handleFileChange"
              style="display: none;"
            />
          </label>
          <span v-if="attachedFiles.length > 0" class="file-count">
            {{ attachedFiles.length }} PDF
          </span>
          <input
            v-model="newMessage"
            type="text"
            placeholder="Mesajınızı yazın..."
            class="message-input"
          />
          <button type="submit" class="send-button" :disabled="!newMessage.trim() && attachedFiles.length === 0">
            <i class="bi bi-send"></i>
          </button>
        </form>
      </div>
    </main>
  </div>
</template>

<style scoped>
.chat-page {
  height: 90vh;
  background: var(--bg-color);
  position: relative;
  display: flex;
  overflow: hidden;
}

/* --- Sidebar Styles --- */
.chat-sidebar {
  width: 280px;
  height: 100%;
  background: var(--card-bg);
  box-shadow: 2px 0 8px var(--shadow-color);
  z-index: 1000;
  flex-shrink: 0;
  transition: transform 0.3s ease-out, margin-left 0.3s ease-out;
}

/* Desktop Sidebar Behavior: Pushes content */
@media (min-width: 769px) {
  .chat-sidebar {
    position: relative;
    margin-left: -280px;
    transform: none;
  }

  .chat-sidebar.show-desktop {
    margin-left: 0;
  }
}

/* Mobile Sidebar Behavior: Overlays content */
@media (max-width: 768px) {
  .chat-sidebar {
    position: fixed;
    top: 0;
    left: 0;
    height: 100%;
    transform: translateX(-100%);
    margin-left: 0;
  }

  .chat-sidebar.show-mobile {
    transform: translateX(0);
  }
}

.sidebar-header {
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--border-color);
}

/* Close button specifically for the mobile sidebar */
.close-sidebar-mobile-button {
  background: none;
  border: none;
  font-size: 1.25rem;
  color: var(--text-color);
  cursor: pointer;
  display: none; /* Hidden by default */
  padding: 0.5rem; /* Add padding for better click area */
  border-radius: 50%; /* Make it circular */
}

@media (max-width: 768px) {
  .close-sidebar-mobile-button {
    display: block; /* Show on mobile */
  }
}

/* --- Sidebar Content Buttons --- */
.sidebar-content {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.new-chat-button {
  width: 100%;
  padding: 0.75rem;
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  justify-content: center; /* Center content */
  font-size: 1rem; /* Ensure readable font size */
  transition: background-color 0.2s ease; /* Smooth hover effect */
}

.new-chat-button:hover {
  background-color: var(--primary-dark-color, #0056b3);
}

.conversations-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.conversation-item {
  background: var(--bg-color);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 0.75rem;
  text-align: left;
  color: var(--text-color);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  font-size: 0.95rem;
  transition: background-color 0.2s ease, border-color 0.2s ease;
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.conversation-item i {
  color: var(--primary-color);
}

.conversation-item:hover {
  background: var(--hover-bg-color, #e0e0e0);
  border-color: var(--primary-color);
}

.conversation-item.active {
  background: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
}

.conversation-item.active i {
  color: white;
}

/* --- Overlay Styles --- */
.sidebar-overlay {
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background: rgba(0, 0, 0, 0.5);
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
  z-index: 999;
}

@media (max-width: 768px) {
  .sidebar-overlay.show-mobile {
    opacity: 1;
    visibility: visible;
  }
}

@media (min-width: 769px) {
  .sidebar-overlay {
    display: none;
  }
}

/* --- Main Chat Area Styles --- */
.chat-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 1rem;
  max-width: 100%;
  overflow: hidden;
  transition: margin-left 0.3s ease-out;
  margin-left: 0;
  width: 100%;
}

@media (min-width: 769px) {
  .chat-main.shifted-desktop {
    margin-left: 10px;
  }
}

@media (max-width: 768px) {
  .chat-main.shifted-desktop {
    margin-left: 0;
  }
}

.chat-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: var(--card-bg);
  border-radius: 12px;
  padding: 1rem;
  margin-bottom: 1rem;
  box-shadow: 0 2px 4px var(--shadow-color);
}

.header-content h1 {
  font-size: 1.5rem;
  margin: 0;
}

/* The main sidebar toggle button (in chat-header) */
.menu-toggle-button {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: var(--text-color);
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  transition: background-color 0.2s ease;
}

.menu-toggle-button:hover {
  background-color: var(--hover-bg-color, rgba(0, 0, 0, 0.05));
}

.messages-area {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  background: var(--card-bg);
  border-radius: 12px;
  box-shadow: 0 2px 4px var(--shadow-color);
}

.message {
  display: flex;
  gap: 1rem;
  max-width: 80%;
}

.message.user {
  flex-direction: row-reverse;
  align-self: flex-end;
}

.message-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.message.assistant .message-avatar {
  background: var(--primary-color);
  color: white;
}

.message.user .message-avatar {
  background: var(--secondary-color);
  color: white;
}

.message-bubble {
  padding: 1rem;
  border-radius: 12px;
  line-height: 1.5;
}

.message.assistant .message-bubble {
  background: var(--bg-color);
  color: var(--text-color);
}

.message.user .message-bubble {
  background: var(--primary-color);
  color: white;
}

/* --- Input Area Styles --- */
.input-area {
  padding: 1.5rem 1rem;
  margin-top: 10px;
  background: var(--card-bg);
  border-radius: 12px;
  box-shadow: 0 2px 4px var(--shadow-color);
  position: relative;
  z-index: 1002;
}

.input-form {
  display: flex;
  gap: 0.5rem;
  align-items: center; /* Align items vertically in the center */
}

.message-input {
  flex: 1;
  padding: 0.75rem 1rem;
  border: 2px solid var(--border-color);
  border-radius: 8px;
  background: var(--bg-color);
  color: var(--text-color);
  font-size: 1rem;
}

.send-button {
  padding: 0.75rem 1.5rem;
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.send-button:disabled {
  background: var(--primary-disabled);
  cursor: not-allowed;
}

.attach-button {
  background: var(--secondary-color);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.75rem 1rem;
  cursor: pointer;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s ease;
}

.attach-button:hover {
  background-color: var(--secondary-dark-color, #336699);
}

.file-count {
  margin-left: 0.5rem;
  font-size: 0.9rem;
  color: var(--text-color);
  background-color: var(--bg-color);
  padding: 0.3rem 0.6rem;
  border-radius: 5px;
  border: 1px solid var(--border-color);
  white-space: nowrap; /* Prevent text wrapping */
}

/* --- Responsive Adjustments --- */
@media (max-width: 768px) {
  .chat-main {
    padding: 0.5rem;
  }

  .message {
    max-width: 90%;
  }

  /* Fixed input area for mobile */
  .input-area {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 90%;
    border-radius: 0;
    padding: 1rem 1rem;
    box-shadow: 0 -2px 8px var(--shadow-color);
  }

  .messages-area {
    padding-bottom: 110px;
  }
}
</style>