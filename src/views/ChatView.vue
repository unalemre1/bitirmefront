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

<style>
/* Define a more cohesive color palette for the whole application */
:root {
  --primary-color: #4285F4; /* Google Blue */
  --primary-dark-color: #3367d6;
  --secondary-color: #EA4335; /* Google Red */
  --accent-color: #FBBC04; /* Google Yellow */
  --text-color: #3c4043; /* Dark Grey for text */
  --text-light-color: #6a6a6a; /* Lighter grey for secondary text */
  --bg-color: #f8f9fa; /* Light grey background */
  --card-bg: #ffffff; /* White for cards/containers */
  --border-color: #dadce0; /* Light grey border */
  --shadow-color: rgba(0, 0, 0, 0.1); /* Subtle shadow */
  --hover-bg-color: #f1f3f4; /* Light grey for hover */
  --primary-disabled: #a0c3f9; /* Lighter primary for disabled states */
}

/* Basic body styling for consistent font */
body {
  font-family: 'Roboto', sans-serif; /* Use Roboto or a similar sans-serif font */
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
  border-radius: 12px; /* Slightly rounded corners for the whole page if within a container */
  box-shadow: 0 4px 20px var(--shadow-color); /* More pronounced shadow for the main chat container */
}

/* --- Sidebar Styles --- */
.chat-sidebar {
  width: 280px;
  height: 100%;
  background: var(--card-bg); /* White background for the sidebar */
  box-shadow: 2px 0 8px var(--shadow-color);
  z-index: 1000;
  flex-shrink: 0;
  transition: transform 0.3s ease-out, margin-left 0.3s ease-out;
  border-right: 1px solid var(--border-color); /* Subtle border to separate from chat */
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
  background-color: var(--card-bg); /* Ensure header has white background */
  z-index: 1; /* Keep header above scrolling content if it were sticky */
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
  font-size: 1.5rem; /* Slightly larger icon */
  color: var(--text-light-color); /* Subtler color */
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
  gap: 0.75rem; /* Slightly reduced gap for a denser list */
  overflow-y: auto; /* Allow scrolling for conversations */
  flex-grow: 1; /* Allow content to take available space */
}

.new-chat-button {
  width: 100%;
  padding: 0.75rem 1rem; /* Added horizontal padding */
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 500; /* Slightly lighter weight */
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.75rem; /* Increased gap between icon and text */
  justify-content: flex-start; /* Align content to start */
  font-size: 1rem;
  transition: background-color 0.2s ease, transform 0.1s ease; /* Add transform for subtle click effect */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15); /* Subtle shadow for button */
}

.new-chat-button:hover {
  background-color: var(--primary-dark-color);
  transform: translateY(-1px); /* Slight lift on hover */
}

.new-chat-button:active {
  transform: translateY(0); /* Return on click */
  box-shadow: none; /* Remove shadow on active */
}

.conversations-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.conversation-item {
  background: none; /* Remove background on default for cleaner look */
  border: none; /* Remove border on default */
  border-radius: 8px;
  padding: 0.75rem 1rem; /* Consistent padding */
  text-align: left;
  color: var(--text-color);
  display: flex;
  align-items: center;
  gap: 0.75rem; /* Consistent gap */
  cursor: pointer;
  font-size: 0.9rem; /* Slightly smaller font for conversation items */
  transition: background-color 0.2s ease, color 0.2s ease; /* Smooth transition */
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-weight: 400; /* Regular font weight */
}

.conversation-item i {
  color: var(--text-light-color); /* Icon color, less dominant than text */
  font-size: 1.1rem; /* Slightly larger icon */
}

.conversation-item:hover {
  background: var(--hover-bg-color);
  color: var(--text-color); /* Keep text color consistent or slightly darker */
}

.conversation-item.active {
  background: var(--primary-color);
  color: white;
  font-weight: 500; /* Make active text slightly bolder */
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1); /* Subtle shadow for active item */
}

.conversation-item.active i {
  color: white; /* Active icon color */
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
  padding: 1.5rem; /* Increased padding around the chat area */
  max-width: 100%;
  overflow: hidden;
  transition: margin-left 0.3s ease-out;
  margin-left: 0;
  width: 100%;
}

@media (min-width: 769px) {
  .chat-main.shifted-desktop {
    margin-left: 280px; /* This shifts the entire main content right, making space for sidebar */
    /* To address the 'too far right' issue:
       The sidebar itself is 280px. If you want the chat area to start immediately after the sidebar,
       and then have its own padding, you need to rethink the `margin-left` here or
       adjust the `max-width` of the `chat-main` or the `chat-page` itself.

       However, if the `chat-page` is `display: flex;` and `.chat-sidebar` is `position: relative;`
       and `flex-shrink: 0;`, then `.chat-main` (with `flex: 1;`) should naturally fill the *remaining* space.
       The `margin-left` on `chat-main.shifted-desktop` is *redundant* if the sidebar is correctly pushing it.

       Let's remove `margin-left` from `.chat-main.shifted-desktop` and ensure `chat-page` handles the flex layout.
       The sidebar, when `show-desktop` is active, effectively changes its `margin-left` from -280px to 0,
       which means it now *occupies* space in the flex layout, pushing `chat-main` automatically.
    */
  }
}

/* Corrected logic for desktop shifting */
@media (min-width: 769px) {
  .chat-main {
    /* When sidebar is hidden, chat-main takes full width */
    margin-left: 0;
  }
  .chat-main.shifted-desktop {
    /* When sidebar is shown, chat-main will be pushed by sidebar's width.
       We don't need margin-left on chat-main itself if chat-sidebar is part of flex.
       The "too far right" issue likely stemmed from this redundancy.
       Let's confirm the visual by *removing* the `margin-left` from `shifted-desktop` here,
       and let the flex layout handle it. If you want a small gap, add `gap` to `.chat-page`.
    */
    /* margin-left: 0;  <--- Remove this line or set to 0 if it's there */
  }

  /* To add a small visual gap between sidebar and chat-main */
  .chat-page.show-desktop { /* Assuming .chat-page also gets this class when sidebar is open */
    gap: 1rem; /* Add a 16px gap between sidebar and chat-main */
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
  padding: 0.75rem 1.25rem; /* Slightly refined padding */
  margin-bottom: 1.25rem; /* More space below header */
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.08); /* Lighter, more subtle shadow */
}

/* The main sidebar toggle button (in chat-header) */
.menu-toggle-button {
  background: none;
  border: none;
  font-size: 1.6rem; /* Slightly larger for prominence */
  color: var(--text-light-color); /* Subtler default color */
  cursor: pointer;
  padding: 0.6rem; /* More padding for better click area */
  border-radius: 50%;
  transition: background-color 0.2s ease, color 0.2s ease;
}

.menu-toggle-button:hover {
  background-color: var(--hover-bg-color);
  color: var(--text-color); /* Darken icon on hover */
}

.messages-area {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem; /* Consistent padding */
  display: flex;
  flex-direction: column;
  gap: 0.75rem; /* Consistent message spacing */
  background: var(--card-bg);
  border-radius: 12px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.08);
}

.message {
  display: flex;
  gap: 0.75rem; /* Consistent gap between avatar and bubble */
  max-width: 85%; /* Allow messages to be a bit wider */
  align-items: flex-end; /* Align avatars to bottom of message bubble */
}

.message.user {
  flex-direction: row-reverse;
  align-self: flex-end;
}

.message-avatar {
  width: 36px; /* Slightly smaller avatar */
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0; /* Prevent shrinking */
  font-size: 1.1rem; /* Adjust icon size in avatar */
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
  padding: 0.9rem 1.2rem; /* Refined padding for bubble */
  border-radius: 18px; /* More rounded bubbles */
  line-height: 1.5;
  font-size: 0.95rem; /* Slightly smaller message font */
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05); /* Very subtle bubble shadow */
}

.message.assistant .message-bubble {
  background: var(--bg-color); /* Use light background for assistant */
  color: var(--text-color);
  border: 1px solid var(--border-color); /* Subtle border for assistant bubble */
}

.message.user .message-bubble {
  background: var(--primary-color);
  color: white;
}

/* --- Input Area Styles --- */
.input-area {
  padding: 1.25rem; /* More generous padding */
  background: var(--card-bg);
  border-radius: 12px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.08); /* Consistent shadow */
  position: relative;
  z-index: 1002;
  margin-top: 1.25rem; /* Space above input area */
}

.input-form {
  display: flex;
  gap: 0.75rem; /* Consistent gap */
  align-items: center; /* Vertically align items */
}

.message-input {
  flex: 1;
  padding: 0.9rem 1.2rem; /* Refined padding for input */
  border: 1px solid var(--border-color); /* Thinner border */
  border-radius: 24px; /* More rounded input field */
  background: var(--bg-color);
  color: var(--text-color);
  font-size: 1rem;
  outline: none; /* Remove default outline */
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.message-input:focus {
  border-color: var(--primary-color); /* Highlight border on focus */
  box-shadow: 0 0 0 3px rgba(66, 133, 244, 0.2); /* Subtle blue glow on focus */
}

.send-button {
  padding: 0.8rem 1.4rem; /* Refined padding for send button */
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: 24px; /* Rounded button */
  cursor: pointer;
  font-size: 1.1rem; /* Larger icon */
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s ease, transform 0.1s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15); /* Subtle shadow */
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
    padding: 0.75rem; /* Adjust padding for mobile */
  }

  .chat-header {
    padding: 0.6rem 1rem;
  }

  .messages-area {
    padding: 1rem;
  }

  .message {
    max-width: 90%;
  }

  .input-area {
    padding: 0.75rem 1rem; /* Adjust padding for mobile fixed input */
    border-radius: 0;
    margin-top: 0; /* No margin-top when fixed */
  }

  .messages-area {
    padding-bottom: 100px; /* Space for the fixed input area on mobile */
  }
}
</style>