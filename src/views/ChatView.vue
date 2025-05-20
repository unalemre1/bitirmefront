<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useTitle, useWindowSize } from '@vueuse/core'
import FooterComponent from '../components/footer/FooterComponent.vue'

useTitle('AI Chat | LexAI')

const messages = ref<Array<{ role: 'user' | 'assistant', content: string }>>([
  { role: 'assistant', content: 'Merhaba! Size nasıl yardımcı olabilirim?' }
])
const newMessage = ref('')
const chatContainer = ref<HTMLDivElement | null>(null)

const showSidebar = ref(false)

const sendMessage = async () => {
  if (!newMessage.value.trim()) return

  messages.value.push({
    role: 'user',
    content: newMessage.value
  })

  const userMessage = newMessage.value
  newMessage.value = ''

  messages.value.push({
    role: 'assistant',
    content: '...'
  })

  setTimeout(() => {
    messages.value[messages.value.length - 1] = {
      role: 'assistant',
      content: `Mesajınızı aldım: "${userMessage}". Bu bir örnek yanıttır.`
    }
    scrollToBottom()
  }, 1000)
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
  <div class="chat-page" :class="{ 'show-desktop': showSidebar }">
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
           <button class="conversation-item">
            <i class="bi bi-chat-left-text"></i>
            <span>Uzun Bir Sohbet Başlığı Burada Yer Alacak</span>
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
          <h1 class="chat-title">LexAI Chat</h1>
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

<style>
/* Reverted to original color variables */
:root {
  --primary-color: #007bff;
  --secondary-color: #6c757d;
  --accent-color: #ffc107;
  --text-color: #343a40;
  --bg-color: #f8f9fa;
  --card-bg: #ffffff;
  --border-color: #dee2e6;
  --shadow-color: rgba(0, 0, 0, 0.1);

  /* Keeping the helper variables for aesthetic enhancements */
  --primary-dark-color: #0056b3; /* Darker shade of primary for hover */
  --text-light-color: #6c757d; /* Lighter text/icon color */
  --hover-bg-color: #e9ecef; /* Light background for general hover */
  --primary-disabled: #a0c3f9; /* Lighter primary for disabled states */
}

/* Basic body styling for consistent font */
body {
  font-family: 'Arial', sans-serif;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  background-color: var(--bg-color);
  color: var(--text-color);
}
</style>

<style scoped>
.chat-page {
  height: 90vh;
  background: var(--bg-color);
  position: relative;
  display: flex;
  overflow: hidden;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

/* --- Sidebar Styles --- */
.chat-sidebar {
  width: 280px;
  height: 100%;
  background: var(--card-bg);
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.08);
  z-index: 1000;
  flex-shrink: 0;
  transition: transform 0.3s ease-out, margin-left 0.3s ease-out;
  border-right: 1px solid var(--border-color);
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
  background-color: var(--card-bg);
  z-index: 1;
}

.sidebar-header h2 {
  font-size: 1.25rem;
  color: var(--text-color);
  margin: 0;
}

/* Close button specifically for the mobile sidebar */
.close-sidebar-mobile-button {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: var(--text-light-color);
  cursor: pointer;
  display: none;
  padding: 0.5rem;
  border-radius: 50%;
  transition: background-color 0.2s ease;
}

@media (max-width: 768px) {
  .close-sidebar-mobile-button {
    display: block;
  }
}

.close-sidebar-mobile-button:hover {
  background-color: var(--hover-bg-color);
}

/* --- Sidebar Content Buttons --- */
.sidebar-content {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  overflow-y: auto;
  flex-grow: 1;
}

.new-chat-button {
  width: 100%;
  padding: 0.75rem 1rem;
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  justify-content: flex-start;
  font-size: 1rem;
  transition: background-color 0.2s ease, transform 0.1s ease, box-shadow 0.2s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
}

.new-chat-button:hover {
  background-color: var(--primary-dark-color);
  transform: translateY(-1px);
}

.new-chat-button:active {
  transform: translateY(0);
  box-shadow: none;
}

.conversations-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.conversation-item {
  background: none;
  border: none;
  border-radius: 8px;
  padding: 0.75rem 1rem;
  text-align: left;
  color: var(--text-color);
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.2s ease, color 0.2s ease;
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-weight: 400;
}

.conversation-item i {
  color: var(--text-light-color);
  font-size: 1.1rem;
}

.conversation-item:hover {
  background: var(--hover-bg-color);
  color: var(--text-color);
}

.conversation-item.active {
  background: var(--primary-color);
  color: white;
  font-weight: 500;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
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
  padding: 1.5rem;
  max-width: 100%;
  overflow: hidden;
  transition: margin-left 0.3s ease-out;
  margin-left: 0;
  width: 100%;
}

@media (min-width: 769px) {
  .chat-main.shifted-desktop {
    margin-left: 0;
  }

  .chat-page.show-desktop {
    gap: 1.5rem;
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
  padding: 0.75rem 1.25rem;
  margin-bottom: 1.25rem;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.08);
}

/* Style for the chat title */
.chat-title {
  font-size: 1.35rem;
  margin: 0;
  color: var(--text-color);
}


/* The main sidebar toggle button (in chat-header) */
.menu-toggle-button {
  background: none;
  border: none;
  font-size: 1.6rem;
  color: var(--text-light-color);
  cursor: pointer;
  padding: 0.6rem;
  border-radius: 50%;
  transition: background-color 0.2s ease, color 0.2s ease;
}

.menu-toggle-button:hover {
  background-color: var(--hover-bg-color);
  color: var(--text-color);
}

.messages-area {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  background: var(--card-bg);
  border-radius: 12px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.08);
}

.message {
  display: flex;
  gap: 0.75rem;
  max-width: 85%;
  align-items: flex-end;
}

.message.user {
  flex-direction: row-reverse;
  align-self: flex-end;
}

.message-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-size: 1.1rem;
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
  padding: 0.9rem 1.2rem;
  border-radius: 18px;
  line-height: 1.5;
  font-size: 0.95rem;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.message.assistant .message-bubble {
  background: var(--bg-color);
  color: var(--text-color);
  border: 1px solid var(--border-color);
}

.message.user .message-bubble {
  background: var(--primary-color);
  color: white;
}

/* --- Input Area Styles --- */
.input-area {
  padding: 1.25rem;
  background: var(--card-bg);
  border-radius: 12px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.08);
  position: relative;
  z-index: 1002;
  margin-top: 1.75rem;
}

.input-form {
  display: flex;
  gap: 0.75rem;
  align-items: center;
}

.message-input {
  flex: 1;
  padding: 0.9rem 1.2rem;
  border: 1px solid var(--border-color);
  border-radius: 24px;
  background: var(--bg-color);
  color: var(--text-color);
  font-size: 1rem;
  outline: none;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.message-input:focus {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.2);
}

.send-button {
  padding: 0.8rem 1.4rem;
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: 24px;
  cursor: pointer;
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s ease, transform 0.1s ease, box-shadow 0.2s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
}

.send-button:hover {
  background-color: var(--primary-dark-color);
  transform: translateY(-1px);
}

.send-button:active {
  transform: translateY(0);
  box-shadow: none;
}

.send-button:disabled {
  background: var(--primary-disabled);
  cursor: not-allowed;
  box-shadow: none;
  transform: none;
}

/* --- Responsive Adjustments --- */
@media (max-width: 768px) {
  .chat-main {
    padding: 0.75rem;
  }

  .chat-header {
    padding: 0.6rem 1rem;
  }

  /* Adjust chat title size for mobile if needed */
  .chat-title {
    font-size: 1.2rem;
  }

  .messages-area {
    padding: 1rem;
  }

  .message {
    max-width: 90%;
  }

  .input-area {
    padding: 0.75rem 1rem;
    border-radius: 0;
    margin-top: 0;
  }

  .messages-area {
    padding-bottom: 100px;
  }
}
</style>