<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useTitle } from '@vueuse/core'
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
    <!-- Main Chat Area -->
    <main class="chat-main" :class="{ 'sidebar-open': showSidebar }">
      <!-- Chat Header -->
      <header class="chat-header">
        <button class="menu-button" @click="showSidebar = !showSidebar">
          <i class="bi bi-list"></i>
        </button>
        <div class="header-content">
          <h1>LexAI Chat</h1>
        </div>
      </header>

      <!-- Messages Area -->
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

      <!-- Input Area -->
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

    <!-- Sidebar -->
    <aside class="chat-sidebar" :class="{ 'show': showSidebar }">
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

    <!-- Sidebar Overlay -->
    <div 
      class="sidebar-overlay" 
      :class="{ 'show': showSidebar }"
      @click="showSidebar = false"
    ></div>
  </div>
</template>

<style scoped>
.chat-page {
  height: calc(100vh - 100px);
  background: var(--bg-color);
  position: relative;
  overflow: hidden;
}

/* Main Chat Area */
.chat-main {
  height: 100%;
  display: flex;
  flex-direction: column;
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
  transition: margin-left 0.3s ease, width 0.3s ease;
  margin-left: 0;
  width: 100%;
}

.chat-main.sidebar-open {
  margin-left: 280px;
  width: calc(100% - 280px);
}

/* Chat Header */
.chat-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: var(--card-bg);
  border-radius: 12px;
  margin-bottom: 1rem;
  box-shadow: 0 2px 4px var(--shadow-color);
}

.menu-button {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: var(--text-color);
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 8px;
  transition: background-color 0.3s ease;
}

.menu-button:hover {
  background-color: var(--border-color);
}

.header-content {
  flex: 1;
}

.header-content h1 {
  font-size: 1.5rem;
  margin: 0;
  color: var(--text-color);
}

/* Messages Area */
.messages-area {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  background: var(--card-bg);
  border-radius: 12px;
  margin-bottom: 1rem;
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
  flex-shrink: 0;
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

/* Input Area */
.input-area {
  padding: 1rem;
  background: var(--card-bg);
  border-radius: 12px;
  box-shadow: 0 2px 4px var(--shadow-color);
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
  transition: all 0.3s ease;
}

.message-input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(66, 184, 131, 0.2);
}

.send-button {
  padding: 0.75rem 1.5rem;
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.send-button:hover:not(:disabled) {
  background: var(--primary-hover);
}

.send-button:disabled {
  background: var(--primary-disabled);
  cursor: not-allowed;
}

/* Sidebar */
.chat-sidebar {
  position: fixed;
  top: 0;
  left: 0;
  width: 280px;
  height: 100%;
  background: var(--card-bg);
  transform: translateX(-100%);
  transition: transform 0.3s ease;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  box-shadow: 2px 0 8px var(--shadow-color);
}

.chat-sidebar.show {
  transform: translateX(0);
}

.sidebar-header {
  padding: 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid var(--border-color);
}

.sidebar-header h2 {
  margin: 0;
  font-size: 1.25rem;
  color: var(--text-color);
}

.close-button {
  background: none;
  border: none;
  font-size: 1.25rem;
  color: var(--text-color);
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 8px;
  transition: background-color 0.3s ease;
}

.close-button:hover {
  background-color: var(--border-color);
}

.sidebar-content {
  flex: 1;
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
  transition: background-color 0.3s ease;
}

.new-chat-button:hover {
  background: var(--primary-hover);
}

.conversations-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.conversation-item {
  width: 100%;
  padding: 0.75rem;
  background: none;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  color: var(--text-color);
  text-align: left;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
}

.conversation-item:hover {
  background: rgba(66, 184, 131, 0.1);
}

.conversation-item.active {
  background: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
}

/* Sidebar Overlay */
.sidebar-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
  z-index: 999;
}

.sidebar-overlay.show {
  opacity: 1;
  visibility: visible;
}

/* Mobil Uyum */
@media (max-width: 768px) {
  .chat-main {
    padding: 0.5rem;
  }

  .chat-main.sidebar-open {
    margin-left: 0;
    width: 100%;
  }

  .message {
    max-width: 90%;
  }

  .chat-sidebar {
    width: 100%;
    max-width: 320px;
  }
}
</style>
