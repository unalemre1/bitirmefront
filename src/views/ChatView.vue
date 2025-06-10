<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useTitle } from '@vueuse/core'
import axios from 'axios'

useTitle('AI Chat | LexAI')

// -------------------------
// 1) State / Reaktif Değişkenler
// -------------------------
const conversations = ref<Array<{
  conversation_id: number
  created_at: string
  messages: Array<{ id: number; sender: 'user' | 'assistant'; content: string; timestamp: string }>
}>>([])

const activeConversationId = ref<number | null>(null)
// messages'ın tipi conversation'daki messages'tan farklı olduğu için ayrı tutuldu.
// Rol ve içerik doğrudan uyumlu
const messages = ref<Array<{ role: 'user' | 'assistant'; content: string }>>([])

const newMessage = ref('')
const chatContainer = ref<HTMLDivElement | null>(null)

const showSidebar = ref(false)
const uploadedFiles = ref<File[]>([])
const fileInput = ref<HTMLInputElement | null>(null)

// -------------------------
// 2) API URL’leri
// -------------------------
const BASE_URL = 'http://localhost:3000' // Kendi backend ana URL’iniz
const API_CHAT_NEW = `${BASE_URL}/chat/history/new`
const API_CHAT_SEND = (convId: number) => `${BASE_URL}/chat/history/${convId}/send`
const API_CHAT_HISTORY = `${BASE_URL}/chat/history/`
const API_ASK = `${BASE_URL}/api/ask`
const API_CHAT_DELETE = (convId: number) => `${BASE_URL}/chat/history/${convId}`
const API_UPLOAD_FILE = (convId: number) => `${BASE_URL}/upload/conversation/${convId}`;

// -------------------------
// 3) JWT’den Auth Header Alma
// -------------------------
const getAuthHeaders = () => {
  const token = localStorage.getItem('access_token') || ''
  return { Authorization: `Bearer ${token}` }
}

// -------------------------
// 4) Yardımcı Fonksiyonlar
// -------------------------
const scrollToBottom = () => {
  setTimeout(() => {
    if (chatContainer.value) {
      chatContainer.value.scrollTop = chatContainer.value.scrollHeight
    }
  }, 100)
}

// -------------------------
// 5) Tüm Conversation’ları Çek ve Otomatik Başlatma/Seçme
// -------------------------
const fetchAllConversations = async () => {
  try {
    const res = await axios.get(API_CHAT_HISTORY, {
      headers: getAuthHeaders()
    })
    conversations.value = res.data
    conversations.value.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    // DEĞİŞİKLİK BURADA: Yeni konuşma oluşturma mantığı güçlendirildi
    if (conversations.value.length > 0) {
      // Eğer konuşmalar varsa ve aktif bir konuşma seçili değilse, ilkini seç
      if (activeConversationId.value === null) {
        selectConversation(conversations.value[0].conversation_id);
      }
    } else {
      // Hiç konuşma yoksa, yeni bir tane oluştur
      console.log('Hiç konuşma bulunamadı, yeni bir tane oluşturuluyor...');
      await createNewConversation();
    }
  } catch (err) {
    console.error('Konuşma geçmişi alınırken hata:', err);
    // Hata durumunda da yeni bir konuşma oluşturmayı deneyebiliriz
    // Böylece kullanıcı takılmaz.
    console.log('Hata oluştu, yine de yeni bir konuşma oluşturuluyor...');
    await createNewConversation(); // Hata olsa bile yeni sohbet başlatmaya çalış
  }
}

// -------------------------
// 6) Bir Conversation’ı Seçmek
// -------------------------
const selectConversation = (convId: number) => {
  activeConversationId.value = convId

  const found = conversations.value.find(c => c.conversation_id === convId)
  if (found) {
    messages.value = found.messages.map(m => ({
      role: m.sender,
      content: m.content
    }))
    scrollToBottom()
    showSidebar.value = false; // Mobil görünümde sohbet seçilince sidebar'ı kapat
    return
  }
  // Eğer bulunamazsa (örneğin henüz eklenmediyse) listeyi yeniden çek:
  fetchAllConversations()
}

// -------------------------
// 7) Yeni Conversation Oluşturmak
// -------------------------
const createNewConversation = async () => {
  try {
    const res = await axios.post(API_CHAT_NEW, null, {
      headers: getAuthHeaders()
    })
    const newConvId = res.data.conversation_id
    const newConvCreatedAt = res.data.created_at

    // Add new conversation to the beginning of the list
    conversations.value.unshift({
      conversation_id: newConvId,
      created_at: newConvCreatedAt,
      messages: []
    })
    selectConversation(newConvId) // Yeni oluşturulanı seç
    console.log('Yeni konuşma başarıyla oluşturuldu ve seçildi:', newConvId);
  } catch (err) {
    console.error('Yeni konuşma oluşturulamadı:', err)
    alert('Yeni bir konuşma başlatılırken hata oluştu. Lütfen sayfayı yenileyin veya tekrar deneyin.')
  }
}

// -------------------------
// 8) Mesaj Gönderme Mantığı (SADECE Metin Mesajları İçin)
// -------------------------
const sendMessage = async () => {
  if (!newMessage.value.trim()) return // Sadece metin mesajı varsa gönder

  // GÜÇLENDİRİLMİŞ KONTROL
  if (activeConversationId.value === null) {
    // Bu noktaya gelinmemesi gerekir, ancak garanti için
    alert('Mesaj göndermek için aktif bir konuşma bulunamadı. Lütfen sayfayı yenileyin veya yeni sohbet başlatın.')
    return
  }

  const convId = activeConversationId.value
  const userMessageContent = newMessage.value // Kullanıcının mesajını sakla

  // 8.1) Kullanıcı Mesajını Ekrana Ekleyelim (Optimistic UI)
  messages.value.push({
    role: 'user',
    content: userMessageContent
  })
  scrollToBottom()
  newMessage.value = '' // Input'u temizle

  // 8.2) "user" Mesajını Database’e Kaydet (/chat/{id}/send)
  try {
    const formDataUser = new FormData()
    formDataUser.append('sender', 'user')
    formDataUser.append('content', userMessageContent)

    await axios.post(API_CHAT_SEND(convId), formDataUser, {
      headers: getAuthHeaders()
    })
  } catch (err) {
    console.error('Kullanıcı mesajı kaydedilemedi:', err)
    messages.value.push({
      role: 'assistant',
      content: 'Mesajınız kaydedilemedi. Lütfen tekrar deneyin.'
    })
    scrollToBottom()
    return
  }

  // 8.3) AI Modelinden Cevabı Almak İçin
  let aiAnswer = ''
  try {
    const askPayload = {
      question: userMessageContent
    }
    const aiRes = await axios.post(API_ASK, askPayload, {
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'application/json'
      }
    })
    aiAnswer = aiRes.data.answer || 'Yanıt alınamadı.'

    // Arayüze ekleyelim
    messages.value.push({
      role: 'assistant',
      content: aiAnswer
    })
    scrollToBottom()
  } catch (err) {
    console.error('AI cevabı alınamadı:', err)
    aiAnswer = 'Üzgünüm, bir hata oluştu. Lütfen tekrar deneyin.'
    messages.value.push({
      role: 'assistant',
      content: aiAnswer
    })
    scrollToBottom()
  }

  // 8.4) AI Cevabını Da Database’e Kaydet (/chat/{id}/send) – sender="assistant"
  try {
    if (aiAnswer) {
      const formDataAI = new FormData()
      formDataAI.append('sender', 'assistant')
      formDataAI.append('content', aiAnswer)
      await axios.post(API_CHAT_SEND(convId), formDataAI, {
        headers: getAuthHeaders()
      })

      const idx = conversations.value.findIndex(c => c.conversation_id === convId)
      if (idx !== -1) {
        conversations.value[idx].messages.push({
          id: Date.now(),
          sender: 'assistant',
          content: aiAnswer,
          timestamp: new Date().toISOString()
        })
      }
    }
  } catch (err) {
    console.error('AI cevabı veritabanına kaydedilemedi:', err)
  }
}

// -------------------------
// YENİ FONKSİYON: Dosyaları Yükleme Mantığı
// -------------------------
const uploadFiles = async () => {
  if (uploadedFiles.value.length === 0) return // Yüklenecek dosya yoksa dur

  // GÜÇLENDİRİLMİŞ KONTROL
  if (activeConversationId.value === null) {
    // Bu noktaya gelinmemesi gerekir, ancak garanti için
    alert('Dosya yüklemek için aktif bir konuşma bulunamadı. Lütfen sayfayı yenileyin veya yeni sohbet başlatın.')
    return
  }

  const convId = activeConversationId.value
  const formData = new FormData()

  uploadedFiles.value.forEach(file => {
    formData.append('files', file)
  })

  messages.value.push({
    role: 'user',
    content: `Yüklenen ${uploadedFiles.value.length} adet dosya: ${uploadedFiles.value.map(f => f.name).join(', ')}`
  });
  scrollToBottom();

  try {
    const res = await axios.post(API_UPLOAD_FILE(convId), formData, {
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'multipart/form-data'
      }
    })

    console.log('Dosya yükleme başarılı:', res.data)
    messages.value.push({
      role: 'assistant',
      content: res.data.message || 'Dosyalar başarıyla yüklendi ve işleniyor.'
    })
    scrollToBottom()

    uploadedFiles.value = []
  } catch (err) {
    console.error('Dosya yüklenirken hata oluştu:', err)
    messages.value.push({
      role: 'assistant',
      content: 'Dosyalar yüklenirken bir hata oluştu. Lütfen tekrar deneyin.'
    })
    scrollToBottom()
  }
}

// -------------------------
// 9) Conversation Silme Fonksiyonu
// -------------------------
const deleteConversation = async (convId: number) => {
  if (confirm('Bu konuşmayı silmek istediğinizden emin misiniz?')) {
    try {
      await axios.delete(API_CHAT_DELETE(convId), {
        headers: getAuthHeaders()
      })
      conversations.value = conversations.value.filter(c => c.conversation_id !== convId)

      if (activeConversationId.value === convId) {
        if (conversations.value.length > 0) {
          selectConversation(conversations.value[0].conversation_id)
        } else {
          activeConversationId.value = null
          messages.value = []
          // Eğer hiç konuşma kalmazsa, otomatik olarak yeni bir sohbet başlat
          await createNewConversation();
        }
      }
      console.log(`Konuşma ${convId} başarıyla silindi.`)
    } catch (err) {
      console.error('Konuşma silinirken hata:', err)
      alert('Konuşma silinirken bir hata oluştu. Lütfen tekrar deneyin.')
    }
  }
}


// -------------------------
// 10) Dosya Yükleme Fonksiyonları
// -------------------------
const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files) {
    const newFiles = Array.from(target.files).filter(file => file.type === 'application/pdf')
    uploadedFiles.value.push(...newFiles)
    target.value = ''
  }
}

const triggerFileInput = () => {
  fileInput.value?.click()
}

const removeFile = (index: number) => {
  uploadedFiles.value.splice(index, 1)
}

const handleSubmit = () => {
  if (uploadedFiles.value.length > 0) {
    uploadFiles();
  } else if (newMessage.value.trim()) {
    sendMessage();
  } else {
    // Hem metin hem de dosya yoksa ve göndermeye çalışılıyorsa
    // Bu durum disable button ile önleniyor ama ekstra kontrol
    console.warn('Gönderilecek mesaj veya dosya yok.');
  }
}

// -------------------------
// 11) Component Yüklendiğinde
// -------------------------
onMounted(async () => { // onMounted'ı async yapalım
  await fetchAllConversations(); // Konuşmaların tamamen yüklendiğinden/oluşturulduğundan emin ol
  scrollToBottom();
});
</script>

<template>
  <div class="chat-page">
    <aside class="chat-sidebar" :class="{ 'show-desktop': showSidebar, 'show-mobile': showSidebar }">
      <div class="sidebar-header">
        <h2>Sohbetler</h2>
        <button class="close-sidebar-mobile-button" @click="showSidebar = false">
          <i class="bi bi-x-lg"></i>
        </button>
      </div>
      <div class="sidebar-content">
        <button class="new-chat-button" @click="createNewConversation">
          <i class="bi bi-plus-lg"></i>
          Yeni Sohbet
        </button>

        <div class="conversations-list">
          <button
            v-for="(conv) in conversations" :key="conv.conversation_id"
            @click="selectConversation(conv.conversation_id)"
            class="conversation-item"
            :class="{ active: conv.conversation_id === activeConversationId }"
          >
            <i class="bi bi-chat-left-text"></i>
            <span>Konuşma </span> <small class="created-at"></small>
            <button @click.stop="deleteConversation(conv.conversation_id)" class="delete-conversation-button">
              <i class="bi bi-trash"></i>
            </button>
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
        <button class="menu-toggle-button" @click="showSidebar = !showSidebar">
          <i :class=" showSidebar ? 'bi bi-x-lg' : 'bi bi-list' "></i>
        </button>
        <div class="header-content">
          <h1>LexAI Chat</h1>
        </div>
      </header>

      <div class="messages-area" ref="chatContainer">
        <div v-if="activeConversationId === null && messages.length === 0" class="no-conversation-message">
          <p>Bir sohbet başlatmak için soldaki "Yeni Sohbet" butonuna tıklayın veya bekleyin.</p>
          <p>Sohbet geçmişiniz yüklendiğinde otomatik olarak devam edecektir.</p>
        </div>

        <div
          v-for="(message, index) in messages"
          :key="index" class="message"
          :class="message.role"
        >
          <div class="message-avatar">
            <i :class=" message.role === 'assistant' ? 'bi bi-robot' : 'bi bi-person' "></i>
          </div>
          <div class="message-bubble">
            {{ message.content }}
          </div>
        </div>
      </div>

      <div class="input-area">
        <div v-if="uploadedFiles.length > 0" class="uploaded-files-preview">
          <div v-for="(file, index) in uploadedFiles" :key="index" class="uploaded-file-tag">
            <i class="bi bi-file-earmark-pdf"></i>
            <span>{{ file.name }}</span>
            <button @click="removeFile(index)" class="remove-file-button">
              <i class="bi bi-x"></i>
            </button>
          </div>
          <span class="file-count">{{ uploadedFiles.length }} PDF</span>
        </div>

        <form @submit.prevent="handleSubmit" class="input-form">
          <input
            type="file"
            ref="fileInput"
            @change="handleFileUpload"
            accept=".pdf"
            multiple
            hidden
          />
          <button type="button" class="attach-button" @click="triggerFileInput" :disabled="activeConversationId === null">
            <i class="bi bi-paperclip"></i>
          </button>
          <input
            v-model="newMessage"
            type="text"
            placeholder="Mesajınızı yazın..."
            class="message-input"
            :disabled="uploadedFiles.length > 0 || activeConversationId === null"
          />
          <button
            type="submit"
            class="send-button"
            :disabled="(!newMessage.trim() && uploadedFiles.length === 0) || activeConversationId === null"
          >
            <i class="bi bi-send"></i>
          </button>
        </form>
      </div>
    </main>
  </div>
</template>

<style scoped>
/* Mevcut stilleri koruyun ve aşağıdaki eklemeleri yapın */

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
  position: relative; /* Needed for positioning the delete button */
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
  width: 100%; /* Bu satır kesilmiş, tamamladım */
}
</style>