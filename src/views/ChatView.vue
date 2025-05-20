<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useTitle, useWindowSize } from '@vueuse/core'
import FooterComponent from '../components/footer/FooterComponent.vue' // Assuming you still want this component for your full app

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

// Function to toggle sidebar and potentially close it if clicking outside (on overlay)
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
        <button class="toggle-sidebar-button" @click="toggleSidebar">
          <i :class="showSidebar ? 'bi bi-x-lg' : 'bi bi-list'"></i>
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
      @click="closeSidebar"
    ></div>

    <main class="chat-main" :class="{ 'shifted-desktop': showSidebar }">
      <header class="chat-header">
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
  transition: transform 0.3s ease-out, margin-left 0.3s ease-out; /* Add margin-left transition */
  
  /* Default: Hidden on desktop initially, overlays on mobile */
  transform: translateX(0); /* Start at 0, use margin-left to hide/show on desktop */
  margin-left: -280px; /* Hidden off-screen by default */
  position: relative; /* Default to relative for desktop pushing */
}

/* Sidebar behavior for desktop */
@media (min-width: 769px) {
  .chat-sidebar {
    margin-left: -280px; /* Hidden by default on desktop */
    position: relative; /* Ensure it's part of the flex flow */
  }

  .chat-sidebar.show-desktop {
    margin-left: 0; /* Show by moving it into view */
  }
}

/* Sidebar behavior for mobile (still overlays) */
@media (max-width: 768px) {
  .chat-sidebar {
    position: fixed; /* Keep it fixed on mobile */
    top: 0;
    left: 0;
    height: 100%;
    margin-left: 0; /* Override desktop margin-left */
    transform: translateX(-100%); /* Hidden off-screen on mobile */
  }

  .chat-sidebar.show-mobile {
    transform: translateX(0); /* Show by sliding into view on mobile */
  }
}

.sidebar-header {
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--border-color);
}

/* New style for the toggle button inside sidebar header */
.toggle-sidebar-button {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: var(--text-color);
  cursor: pointer;
  display: none; /* Hidden by default on desktop */
}

/* Show the toggle button on mobile only */
@media (max-width: 768px) {
  .toggle-sidebar-button {
    display: block; /* Show the button on mobile */
  }
}
/* On desktop, the menu button will implicitly appear if it's placed in chat-header as before.
   If you want a dedicated close button on desktop sidebar, add it back to sidebar-header.
   For Gemini-like behavior, the main content's menu button should toggle it.
*/
/* If you want the toggle button for desktop sidebar also, move it from chat-header here: */
@media (min-width: 769px) {
  .toggle-sidebar-button {
    display: block; /* Show the button on desktop as well */
  }
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
  max-width: 100%; /* Default max-width */
  overflow: hidden;
  transition: margin-left 0.3s ease-out; /* Animate margin-left */
  margin-left: 0; /* Default margin-left */
  width: 100%; /* Ensure it takes full width initially */
}

/* Shift main content on desktop when sidebar is open */
@media (min-width: 769px) {
  .chat-main.shifted-desktop {
    margin-left: 280px; /* Push chat-main to the right by sidebar's width */
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

/* Remove the old menu-button as it's now in the sidebar header */
.menu-button {
  display: none;
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
  position: relative;
  z-index: 1002;
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
    padding: 0.75rem 1rem;
    box-shadow: 0 -2px 8px var(--shadow-color);
  }

  .messages-area {
    padding-bottom: 100px; /* Space for the fixed input area on mobile */
  }
}
</style>