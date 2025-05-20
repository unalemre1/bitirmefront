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

onMounted(() => {
  scrollToBottom()
})
</script>

<template>
  <div class="chat-page">
    <aside class="chat-sidebar" :class="{ 'show-desktop': showSidebar, 'show-mobile': showSidebar }">
      <div class="sidebar-header">
        <h2>Sohbetler</h2>
        <button class="close-button" @click="showSidebar = false">
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
        </div>
      </div>
    </aside>

    <div
      class="sidebar-overlay"
      :class="{ 'show-mobile': showSidebar }"
      @click="showSidebar = false"
    ></div>

    <main class="chat-main" :class="{ 'shifted-desktop': showSidebar }">
      <header class="chat-header">
        <button class="menu-button" @click="showSidebar = !showSidebar">
          <i class="bi bi-list"></i>
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
.chat-page {
  height: 90vh;
  background: var(--bg-color);
  position: relative;
  display: flex; /* Flex container */
  overflow: hidden;
}

/* --- Sidebar Styles --- */
.chat-sidebar {
  width: 280px;
  height: 100%;
  background: var(--card-bg);
  box-shadow: 2px 0 8px var(--shadow-color);
  z-index: 1000; /* Higher than main content */
  flex-shrink: 0;
  transition: transform 0.3s ease-out; /* For desktop animation */
  
  /* Default: Hidden on desktop initially */
  transform: translateX(-100%);
  position: absolute; /* Default for mobile overlap */
}

/* Sidebar behavior for desktop */
@media (min-width: 769px) {
  .chat-sidebar {
    position: relative; /* Make it part of the flex flow on desktop */
    transform: translateX(-100%); /* Hidden by default */
  }

  .chat-sidebar.show-desktop {
    transform: translateX(0); /* Show by sliding into view */
  }
}

/* Sidebar behavior for mobile (still overlays) */
@media (max-width: 768px) {
  .chat-sidebar {
    position: fixed; /* Keep it fixed on mobile */
    top: 0;
    left: 0;
    height: 100%;
    transform: translateX(-100%);
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
}

.conversations-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.conversation-item {
  background: none;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 0.75rem;
  text-align: left;
  color: var(--text-color);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.conversation-item.active {
  background: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
}

.close-button {
  background: none;
  border: none;
  font-size: 1.25rem;
  color: var(--text-color);
}

/* --- Overlay Styles --- */
.sidebar-overlay {
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background: rgba(0, 0, 0, 0.5); /* Dimming effect */
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
  z-index: 999;
}

/* Only show overlay on mobile when sidebar is active */
@media (max-width: 768px) {
  .sidebar-overlay.show-mobile {
    opacity: 1;
    visibility: visible;
  }
}

/* Hide overlay completely on desktop */
@media (min-width: 769px) {
  .sidebar-overlay {
    display: none; /* Never show overlay on desktop */
  }
}


/* --- Main Chat Area Styles --- */
.chat-main {
  flex: 1; /* Take remaining space */
  display: flex;
  flex-direction: column;
  padding: 1rem;
  max-width: 100%;
  overflow: hidden;
  transition: margin-left 0.3s ease-out; /* Animate margin-left */
  margin-left: 0; /* Default margin-left */
  width: 100%; /* Ensure it takes full width initially */
}

/* Shift main content on desktop when sidebar is open */
@media (min-width: 769px) {
  .chat-main.shifted-desktop {
    margin-left: 0; /* Reset margin-left because sidebar is now part of flex flow */
    /* If you want chat-main to shrink, you'd adjust flex-grow or max-width here */
    /* Example: max-width: calc(100% - 280px); */
  }
}

/* On mobile, main content does not shift, it's overlaid */
@media (max-width: 768px) {
  .chat-main.shifted-desktop { /* This class name is ignored on mobile */
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

.menu-button {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: var(--text-color);
  cursor: pointer;
}

.messages-area {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
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
  padding: 1rem;
  background: var(--card-bg);
  border-radius: 12px;
  box-shadow: 0 2px 4px var(--shadow-color);
  position: relative; /* Needed for z-index */
  z-index: 1002; /* Ensure it's above everything else */
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
}

.send-button {
  padding: 0.75rem 1.5rem;
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

.send-button:disabled {
  background: var(--primary-disabled);
  cursor: not-allowed;
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
    width: 100%;
    border-radius: 0;
    padding: 0.75rem 1rem; /* Adjust padding for mobile */
    box-shadow: 0 -2px 8px var(--shadow-color);
  }

  .messages-area {
    padding-bottom: 100px; /* Space for the fixed input area on mobile */
  }
}
</style>