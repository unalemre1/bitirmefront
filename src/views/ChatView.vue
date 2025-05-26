<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useTitle } from '@vueuse/core'
import axios from 'axios' // Axios'u import ediyoruz

useTitle('AI Chat | LexAI')

const messages = ref<Array<{ role: 'user' | 'assistant', content: string }>>([
  { role: 'assistant', content: 'Merhaba! Size nasıl yardımcı olabilirim?' }
])
const newMessage = ref('')
const chatContainer = ref<HTMLDivElement | null>(null)

const showSidebar = ref(false)

// Backend API URL'ini buraya tanımlayın
// Kendi backend'inizin adresine göre bu URL'i değiştirmeniz gerekecek.
// Örneğin: 'http://localhost:3000/api/chat' veya 'https://your-backend-api.com/chat'
const API_URL = 'http://localhost:3000/api/chat'; // Burayı kendi backend URL'inizle değiştirin!

const sendMessage = async () => {
  if (!newMessage.value.trim()) return

  const userMessageContent = newMessage.value
  messages.value.push({
    role: 'user',
    content: userMessageContent
  })

  newMessage.value = ''

  // Yapay zeka yanıtı beklenirken geçici bir mesaj ekleyelim
  messages.value.push({
    role: 'assistant',
    content: 'Yapay zeka yanıtı bekleniyor...'
  })
  scrollToBottom()

  try {
    // Backend'e POST isteği gönderiyoruz
    const response = await axios.post(API_URL, {
      message: userMessageContent // Backend'e göndereceğimiz mesaj
    });

    // Son mesajı (bekleme mesajını) backend'den gelen yanıtla güncelliyoruz
    messages.value[messages.value.length - 1] = {
      role: 'assistant',
      content: response.data.reply || 'Yanıt alınamadı.' // Backend'den gelen 'reply' alanını kullanıyoruz
    };

  } catch (error) {
    console.error('Mesaj gönderirken hata oluştu:', error);
    // Hata durumunda kullanıcıya bilgi verelim
    messages.value[messages.value.length - 1] = {
      role: 'assistant',
      content: 'Üzgünüm, bir hata oluştu. Lütfen tekrar deneyin.'
    };
  } finally {
    scrollToBottom();
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
          <input
            v-model="newMessage"
            type="text"
            placeholder="Mesajınızı yazın..."
            class="message-input"
          />
          <button type="submit" class="send-button" :disabled="!newMessage.trim()">
            <i class="bi bi-send"></i>
          </button>
        </form>
      </div>
    </main>
  </div>
</template>

<style scoped>
/* Define CSS variables for easier theme management */
:root {
  --bg-color: #f0f2f5; /* Light grey background */
  --card-bg: #ffffff; /* White for cards/panels */
  --primary-color: #007bff; /* Blue for primary actions/highlights */
  --primary-dark-color: #0056b3; /* Darker blue for hover */
  --primary-disabled: #a0c3e8; /* Lighter blue for disabled buttons */
  --secondary-color: #6c757d; /* Grey for secondary elements */
  --text-color: #333; /* Dark text */
  --border-color: #e0e0e0; /* Light border */
  --shadow-color: rgba(0, 0, 0, 0.1); /* Subtle shadow */
  --hover-bg-color: #f5f5f5; /* Background on hover */
}

/* Base Styles */
.chat-page {
  height: 100vh; /* Use full viewport height */
  display: flex;
  background: var(--bg-color);
  overflow: hidden; /* Prevent body scroll */
}

/* --- Sidebar Styles --- */
.chat-sidebar {
  width: 280px;
  height: 100%;
  background: var(--card-bg);
  box-shadow: 2px 0 8px var(--shadow-color);
  z-index: 1000;
  flex-shrink: 0; /* Prevent shrinking */
  transition: transform 0.3s ease-out, margin-left 0.3s ease-out;
}

/* Desktop Sidebar Behavior: Pushes content */
@media (min-width: 769px) {
  .chat-sidebar {
    position: relative;
    margin-left: -280px; /* Hidden by default */
    transform: none; /* Reset transform */
  }

  .chat-sidebar.show-desktop {
    margin-left: 0; /* Shown when active */
  }
}

/* Mobile Sidebar Behavior: Overlays content */
@media (max-width: 768px) {
  .chat-sidebar {
    position: fixed; /* Fixed position */
    top: 0;
    left: 0;
    height: 100%;
    transform: translateX(-100%); /* Hidden by default */
    margin-left: 0; /* No margin on mobile */
  }

  .chat-sidebar.show-mobile {
    transform: translateX(0); /* Shown when active */
  }
}

.sidebar-header {
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--border-color);
  background: var(--card-bg); /* Ensure header has background */
}

.sidebar-header h2 {
  margin: 0;
  font-size: 1.25rem;
  color: var(--text-color);
}

/* Close button specifically for the mobile sidebar */
.close-sidebar-mobile-button {
  background: none;
  border: none;
  font-size: 1.5rem; /* Slightly larger for touch */
  color: var(--text-color);
  cursor: pointer;
  display: none; /* Hidden by default on desktop */
  padding: 0.5rem;
  border-radius: 50%;
  transition: background-color 0.2s ease;
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
  overflow-y: auto; /* Allow scrolling for many conversations */
  height: calc(100% - 61px); /* Account for header height */
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
  justify-content: center;
  font-size: 1rem;
  transition: background-color 0.2s ease, transform 0.1s ease;
}

.new-chat-button:hover {
  background-color: var(--primary-dark-color);
}

.new-chat-button:active {
  transform: scale(0.98); /* Visual feedback on tap */
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
  transition: background-color 0.2s ease, border-color 0.2s ease, transform 0.1s ease;
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis; /* Truncate long conversation names */
}

.conversation-item i {
  color: var(--primary-color);
}

.conversation-item:hover {
  background: var(--hover-bg-color);
  border-color: var(--primary-color);
}

.conversation-item:active {
  transform: scale(0.98); /* Visual feedback on tap */
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
  transition: opacity 0.3s ease, visibility 0.3s ease;
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
    display: none; /* Hide overlay on desktop */
  }
}

/* --- Main Chat Area Styles --- */
.chat-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 1rem;
  max-width: 100%;
  overflow: hidden; /* Important for preventing horizontal scroll */
  transition: margin-left 0.3s ease-out;
  margin-left: 0;
  width: 100%; /* Ensure it takes full width initially */
}

@media (min-width: 769px) {
  .chat-main.shifted-desktop {
    margin-left: 10px; /* Small gap when sidebar is open */
  }
}

/* Chat Header */
.chat-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: var(--card-bg);
  border-radius: 12px;
  padding: 1rem;
  margin-bottom: 1rem;
  box-shadow: 0 2px 4px var(--shadow-color);
  flex-shrink: 0; /* Prevent header from shrinking */
}

.header-content h1 {
  font-size: 1.5rem;
  margin: 0;
  color: var(--text-color);
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
  transition: background-color 0.2s ease, transform 0.1s ease;
}

.menu-toggle-button:hover {
  background-color: var(--hover-bg-color);
}
.menu-toggle-button:active {
  transform: scale(0.95);
}

/* Messages Area */
.messages-area {
  flex: 1;
  overflow-y: auto; /* Enable scrolling for messages */
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  background: var(--card-bg);
  border-radius: 12px;
  box-shadow: 0 2px 4px var(--shadow-color);
  position: relative; /* Needed for padding-bottom adjustment on mobile */
}

.message {
  display: flex;
  gap: 1rem;
  max-width: 80%; /* Limit message width */
}

.message.user {
  flex-direction: row-reverse; /* Align user messages to the right */
  align-self: flex-end; /* Push user messages to the end */
}

.message-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  flex-shrink: 0; /* Prevent avatar from shrinking */
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
  word-wrap: break-word; /* Ensure long words break */
  white-space: pre-wrap; /* Preserve whitespace and breaks */
  box-shadow: 0 1px 3px rgba(0,0,0,0.08); /* Subtle shadow for bubbles */
}

.message.assistant .message-bubble {
  background: var(--bg-color);
  color: var(--text-color);
  border-bottom-left-radius: 4px; /* Pointy bubble for assistant */
}

.message.user .message-bubble {
  background: var(--primary-color);
  color: white;
  border-bottom-right-radius: 4px; /* Pointy bubble for user */
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
  flex-shrink: 0; /* Prevent input area from shrinking */
}

.input-form {
  display: flex;
  gap: 0.5rem;
}

.message-input {
  flex: 1;
  padding: 0.75rem 1rem;
  border: 2px solid var(--border-color);
  border-radius: 8px;
  background: var(--bg-color);
  color: var(--text-color);
  font-size: 1rem;
  outline: none; /* Remove default outline */
  transition: border-color 0.2s ease;
}

.message-input:focus {
  border-color: var(--primary-color);
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
  font-size: 1.1rem;
  transition: background-color 0.2s ease, transform 0.1s ease;
}

.send-button:hover {
  background: var(--primary-dark-color);
}

.send-button:active {
  transform: scale(0.95);
}

.send-button:disabled {
  background: var(--primary-disabled);
  cursor: not-allowed;
  opacity: 0.8;
}

/* --- Responsive Adjustments for Mobile --- */
@media (max-width: 768px) {
  .chat-page {
    flex-direction: column; /* Stack sidebar and main content */
    height: 100dvh; /* Use dynamic viewport height for better mobile support */
  }

  .chat-main {
    padding: 0.5rem; /* Less padding on small screens */
    width: 100%;
    margin-left: 0; /* No margin on mobile */
  }

  .chat-header {
    padding: 0.75rem; /* Smaller header padding */
    margin-bottom: 0.75rem; /* Smaller margin */
    border-radius: 8px; /* Slightly smaller radius */
  }

  .header-content h1 {
    font-size: 1.3rem; /* Smaller title */
  }

  .menu-toggle-button {
    font-size: 1.3rem; /* Smaller toggle button */
  }

  .messages-area {
    padding: 0.75rem; /* Smaller padding */
    border-radius: 8px; /* Smaller radius */
    margin-bottom: 0; /* Remove bottom margin to accommodate fixed input */
    /* On mobile, we need space at the bottom for the fixed input area */
    padding-bottom: 100px; /* Adjust based on input-area height + padding */
  }

  .message {
    max-width: 95%; /* Allow messages to take up more width */
    gap: 0.75rem; /* Slightly smaller gap between avatar and bubble */
  }

  .message-avatar {
    width: 36px;
    height: 36px;
    font-size: 1.1rem;
  }

  .message-bubble {
    padding: 0.8rem; /* Slightly smaller bubble padding */
    font-size: 0.95rem; /* Slightly smaller text in bubbles */
    border-radius: 10px; /* Slightly smaller radius for bubbles */
  }

  /* Fixed input area for mobile */
  .input-area {
    position: fixed; /* Fixed at the bottom */
    bottom: 0;
    left: 0;
    width: 100%;
    border-radius: 0; /* No border radius on corners for full width */
    padding: 0.75rem 1rem; /* Adjust padding for mobile */
    box-shadow: 0 -2px 8px var(--shadow-color); /* Shadow on top */
    background: var(--card-bg); /* Ensure background is solid */
    z-index: 1002;
  }

  .input-form {
    gap: 0.75rem; /* Slightly larger gap in input form */
  }

  .message-input {
    padding: 0.65rem 0.9rem; /* Slightly smaller padding */
    font-size: 0.95rem; /* Smaller font size */
    border-radius: 6px; /* Smaller border radius */
  }

  .send-button {
    padding: 0.65rem 1.2rem; /* Adjusted padding */
    font-size: 1rem; /* Adjusted font size */
    border-radius: 6px; /* Smaller border radius */
  }
}

@media (max-width: 480px) {
  /* Further adjustments for very small mobile screens */
  .chat-header {
    padding: 0.6rem;
  }
  .header-content h1 {
    font-size: 1.2rem;
  }
  .messages-area {
    padding-bottom: 90px; /* Adjust if input area height changes */
  }
  .input-area {
    padding: 0.6rem 0.8rem;
  }
  .message-input {
    padding: 0.6rem 0.8rem;
    font-size: 0.9rem;
  }
  .send-button {
    padding: 0.6rem 1rem;
    font-size: 0.9rem;
  }
}
</style>