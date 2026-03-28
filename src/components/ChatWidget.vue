<template>
  <!-- FAB -->
  <button class="chat-fab" @click="chat.toggleChat()" :class="{ open: chat.isOpen }">
    <span class="fab-icon">{{ chat.isOpen ? '✕' : '⚖' }}</span>
    <span v-if="!chat.isOpen" class="fab-label">Legal Help</span>
  </button>

  <!-- Chat panel -->
  <transition name="chat-slide">
    <div v-if="chat.isOpen" class="chat-panel">
      <div class="chat-header">
        <div class="chat-header-info">
          <div class="chat-avatar">AI</div>
          <div>
            <div class="chat-name">Urimaigal Assistant</div>
            <div class="chat-status">
              <span class="status-dot" :class="{ typing: chat.isTyping }"></span>
              {{ chat.isTyping ? 'Typing...' : 'Online' }}
            </div>
          </div>
        </div>
        <button class="chat-close" @click="chat.toggleChat()">✕</button>
      </div>

      <div class="chat-messages" ref="messagesEl">
        <div
          v-for="msg in chat.messages"
          :key="msg.id"
          class="msg-wrap"
          :class="msg.role"
        >
          <div class="msg-bubble">{{ msg.content }}</div>
          <div v-if="msg.suggestions && msg.role === 'bot'" class="msg-suggestions">
            <button
              v-for="s in msg.suggestions"
              :key="s"
              class="suggestion-chip"
              @click="sendSuggestion(s)"
            >{{ s }}</button>
          </div>
        </div>

        <!-- Typing indicator -->
        <div v-if="chat.isTyping" class="msg-wrap bot">
          <div class="msg-bubble typing-bubble">
            <span></span><span></span><span></span>
          </div>
        </div>
      </div>

      <div class="chat-input-area">
        <input
          v-model="inputText"
          placeholder="Describe your legal issue..."
          class="chat-input"
          @keydown.enter="sendMessage"
        />
        <button class="chat-send" @click="sendMessage" :disabled="!inputText.trim() || chat.isTyping">
          ➤
        </button>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'
import { useChatStore } from '@/stores/chat'

const chat = useChatStore()
const inputText = ref('')
const messagesEl = ref<HTMLElement | null>(null)

async function scrollToBottom() {
  await nextTick()
  if (messagesEl.value) messagesEl.value.scrollTop = messagesEl.value.scrollHeight
}

async function sendMessage() {
  const text = inputText.value.trim()
  if (!text || chat.isTyping) return
  inputText.value = ''
  await chat.sendMessage(text)
  scrollToBottom()
}

async function sendSuggestion(s: string) {
  await chat.sendMessage(s)
  scrollToBottom()
}

watch(() => chat.messages.length, scrollToBottom)
watch(() => chat.isOpen, (v) => { if (v) scrollToBottom() })
</script>

<style scoped>
.chat-fab {
  position: fixed;
  bottom: 28px;
  right: 28px;
  z-index: 200;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 14px 20px;
  background: linear-gradient(135deg, var(--gold), var(--gold-light));
  border: none;
  border-radius: 50px;
  color: var(--ink);
  font-weight: 600;
  font-size: 0.9rem;
  box-shadow: 0 4px 20px rgba(201,146,42,0.4);
  transition: all 0.3s var(--ease-out);
  cursor: pointer;
}
.chat-fab:hover { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(201,146,42,0.5); }
.chat-fab.open { padding: 14px 18px; }
.fab-icon { font-size: 1.1rem; }

.chat-panel {
  position: fixed;
  bottom: 90px;
  right: 28px;
  z-index: 200;
  width: 360px;
  max-height: 520px;
  background: var(--ink-80);
  border: 1px solid var(--ink-40);
  border-radius: var(--radius-xl);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: var(--shadow-lg);
}
@media (max-width: 420px) {
  .chat-panel { width: calc(100vw - 24px); right: 12px; bottom: 80px; }
}

.chat-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  background: var(--ink-60);
  border-bottom: 1px solid var(--ink-40);
}
.chat-header-info { display: flex; align-items: center; gap: 12px; }
.chat-avatar {
  width: 38px; height: 38px;
  background: linear-gradient(135deg, var(--gold), var(--gold-light));
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--ink);
}
.chat-name { font-size: 0.9rem; font-weight: 500; }
.chat-status {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 0.75rem;
  color: var(--mist);
}
.status-dot {
  width: 7px; height: 7px;
  background: var(--sage);
  border-radius: 50%;
}
.status-dot.typing { animation: pulse 1.2s infinite; }
.chat-close {
  background: none;
  border: none;
  color: var(--mist);
  font-size: 1rem;
  cursor: pointer;
  transition: color 0.2s;
}
.chat-close:hover { color: var(--parchment); }

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.msg-wrap { display: flex; flex-direction: column; }
.msg-wrap.user { align-items: flex-end; }
.msg-wrap.bot { align-items: flex-start; }

.msg-bubble {
  max-width: 85%;
  padding: 10px 14px;
  border-radius: 16px;
  font-size: 0.875rem;
  line-height: 1.5;
  white-space: pre-line;
}
.msg-wrap.user .msg-bubble {
  background: linear-gradient(135deg, var(--gold), var(--gold-light));
  color: var(--ink);
  border-bottom-right-radius: 4px;
}
.msg-wrap.bot .msg-bubble {
  background: var(--ink-60);
  color: var(--parchment);
  border-bottom-left-radius: 4px;
}

.typing-bubble {
  display: flex;
  gap: 5px;
  align-items: center;
  padding: 12px 16px;
}
.typing-bubble span {
  width: 7px; height: 7px;
  background: var(--mist);
  border-radius: 50%;
  animation: pulse 1.2s infinite;
}
.typing-bubble span:nth-child(2) { animation-delay: 0.2s; }
.typing-bubble span:nth-child(3) { animation-delay: 0.4s; }

.msg-suggestions {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 8px;
  max-width: 85%;
}
.suggestion-chip {
  padding: 5px 12px;
  background: transparent;
  border: 1px solid rgba(201,146,42,0.4);
  border-radius: 999px;
  color: var(--gold);
  font-size: 0.78rem;
  cursor: pointer;
  transition: all 0.2s;
}
.suggestion-chip:hover {
  background: rgba(201,146,42,0.12);
  border-color: var(--gold);
}

.chat-input-area {
  display: flex;
  gap: 8px;
  padding: 14px 16px;
  border-top: 1px solid var(--ink-40);
}
.chat-input {
  flex: 1;
  background: var(--ink-60);
  border: 1px solid var(--ink-40);
  border-radius: 24px;
  padding: 10px 16px;
  color: var(--parchment);
  font-size: 0.875rem;
  outline: none;
  transition: border-color 0.2s;
}
.chat-input::placeholder { color: var(--mist); }
.chat-input:focus { border-color: var(--gold); }
.chat-send {
  width: 40px; height: 40px;
  background: linear-gradient(135deg, var(--gold), var(--gold-light));
  border: none;
  border-radius: 50%;
  color: var(--ink);
  font-size: 1rem;
  display: flex; align-items: center; justify-content: center;
  transition: all 0.2s;
  flex-shrink: 0;
}
.chat-send:hover:not(:disabled) { transform: scale(1.08); }
.chat-send:disabled { opacity: 0.4; cursor: not-allowed; }

.chat-slide-enter-active, .chat-slide-leave-active {
  transition: all 0.35s var(--ease-out);
}
.chat-slide-enter-from { opacity: 0; transform: translateY(16px) scale(0.97); }
.chat-slide-leave-to  { opacity: 0; transform: translateY(10px) scale(0.97); }
</style>
