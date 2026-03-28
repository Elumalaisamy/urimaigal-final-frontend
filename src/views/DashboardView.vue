<template>
  <main class="dashboard-page">
    <div class="dash-header">
      <div class="container">
        <div class="dash-welcome">
          <div class="dash-avatar">{{ initials }}</div>
          <div>
            <p class="dash-greeting">Welcome back,</p>
            <h1 class="dash-name">{{ auth.userName }}</h1>
          </div>
        </div>
        <div class="dash-quick-actions">
          <router-link to="/lawyers" class="btn-primary">Find Advocate →</router-link>
          <button class="btn-ghost" @click="chat.toggleChat()">AI Legal Help</button>
        </div>
      </div>
    </div>

    <div class="container dash-body">
      <!-- Stats row -->
      <div class="dash-stats">
        <div class="dash-stat-card" v-for="s in statCards" :key="s.label">
          <div class="stat-icon">{{ s.icon }}</div>
          <div class="stat-info">
            <div class="stat-value">{{ s.value }}</div>
            <div class="stat-label">{{ s.label }}</div>
          </div>
        </div>
      </div>

      <div class="dash-grid">
        <!-- Bookings -->
        <section class="dash-section bookings-section">
          <div class="section-head">
            <h2 class="section-title">My Consultations</h2>
            <router-link to="/lawyers" class="link-btn">+ Book New</router-link>
          </div>

          <div v-if="booking.bookings.length === 0" class="empty-box">
            <div class="empty-icon">📋</div>
            <p>No consultations yet.</p>
            <router-link to="/lawyers" class="btn-primary" style="margin-top:12px">Find an Advocate</router-link>
          </div>

          <div v-else class="booking-list">
            <div
              class="booking-item"
              v-for="b in booking.bookings"
              :key="b.id"
              :class="b.status"
            >
              <div class="booking-item-left">
                <div class="booking-mode-icon">{{ b.mode === 'video' ? '📹' : '💬' }}</div>
                <div>
                  <div class="booking-lawyer">{{ b.lawyerName }}</div>
                  <div class="booking-datetime">{{ b.date }} · {{ b.time }}</div>
                  <div class="booking-mode">{{ b.mode === 'video' ? 'Video Call' : 'Chat Session' }}</div>
                </div>
              </div>
              <div class="booking-item-right">
                <span class="status-badge" :class="b.status">{{ b.status }}</span>
                <div class="booking-fee">{{ b.fee === 0 ? 'Free' : '₹' + b.fee.toLocaleString('en-IN') }}</div>
                <button
                  v-if="b.status === 'scheduled'"
                  class="cancel-btn"
                  @click="booking.cancelBooking(b.id)"
                >Cancel</button>
              </div>
            </div>
          </div>
        </section>

        <!-- Sidebar: Recent AI chats & Tips -->
        <aside class="dash-sidebar">
          <section class="dash-section">
            <h2 class="section-title">Quick Legal Tips</h2>
            <div class="tips-list">
              <div class="tip-card" v-for="tip in legalTips" :key="tip.title">
                <div class="tip-icon">{{ tip.icon }}</div>
                <div>
                  <div class="tip-title">{{ tip.title }}</div>
                  <div class="tip-text">{{ tip.text }}</div>
                </div>
              </div>
            </div>
          </section>

          <section class="dash-section" style="margin-top: 28px">
            <h2 class="section-title">AI Chat Summary</h2>
            <div class="chat-summary">
              <div class="chat-stat">
                <span class="cs-num">{{ chat.messageCount }}</span>
                <span class="cs-label">Messages in session</span>
              </div>
              <button class="btn-ghost chat-open-btn" @click="chat.toggleChat()">
                Open AI Chat →
              </button>
            </div>
          </section>
        </aside>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useBookingStore } from '@/stores/booking'
import { useChatStore } from '@/stores/chat'

const auth = useAuthStore()
const booking = useBookingStore()
const chat = useChatStore()

const initials = computed(() =>
  auth.userName
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
)

const statCards = computed(() => [
  {
    icon: '📅',
    value: booking.bookings.filter((b) => b.status === 'scheduled').length,
    label: 'Upcoming',
  },
  {
    icon: '✅',
    value: booking.bookings.filter((b) => b.status === 'completed').length,
    label: 'Completed',
  },
  {
    icon: '💬',
    value: chat.messageCount,
    label: 'AI Messages',
  },
  {
    icon: '⚖',
    value: booking.bookings.length,
    label: 'Total Cases',
  },
])

const legalTips = [
  {
    icon: '📌',
    title: 'Document Everything',
    text: 'Always keep copies of agreements, notices, and communications for any potential legal matter.',
  },
  {
    icon: '⏱',
    title: 'Limitation Periods',
    text: 'Most civil suits must be filed within 3 years of the cause. Don\'t delay seeking legal advice.',
  },
  {
    icon: '🔒',
    title: 'Know Your Rights',
    text: 'You have the right to legal representation and bail in most cases under the Indian Constitution.',
  },
  {
    icon: '📞',
    title: 'Free Legal Aid',
    text: 'Eligible persons can get free legal services under the Legal Services Authorities Act, 1987.',
  },
]
</script>

<style scoped>
.dashboard-page { padding-top: 70px; min-height: 100vh; }

.dash-header {
  background: var(--ink-80);
  border-bottom: 1px solid var(--ink-40);
  padding: 36px 0;
}
.dash-header .container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 20px;
}
.dash-welcome { display: flex; align-items: center; gap: 16px; }
.dash-avatar {
  width: 56px; height: 56px;
  background: linear-gradient(135deg, var(--gold), var(--gold-light));
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-weight: 700; color: var(--ink); font-size: 1.2rem;
}
.dash-greeting { font-size: 0.8rem; color: var(--mist); margin-bottom: 2px; }
.dash-name { font-size: 1.6rem; font-weight: 900; color: var(--parchment); }

.dash-quick-actions { display: flex; gap: 12px; }

.dash-body { padding: 36px 0 72px; }

/* Stats */
.dash-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 16px;
  margin-bottom: 36px;
}
.dash-stat-card {
  display: flex; align-items: center; gap: 14px;
  background: var(--ink-80); border: 1px solid var(--ink-40);
  border-radius: var(--radius-md); padding: 20px;
  transition: border-color 0.2s;
}
.dash-stat-card:hover { border-color: rgba(201,146,42,0.3); }
.stat-icon { font-size: 1.5rem; }
.stat-value { font-size: 1.6rem; font-weight: 900; color: var(--gold); line-height: 1; }
.stat-label { font-size: 0.75rem; color: var(--mist); margin-top: 2px; }

/* Grid */
.dash-grid {
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: 28px;
  align-items: start;
}
@media (max-width: 900px) { .dash-grid { grid-template-columns: 1fr; } }

.dash-section { }
.section-head {
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 18px;
}
.section-title {
  font-size: 1rem; font-weight: 700; color: var(--parchment);
}
.link-btn {
  background: none; border: none;
  color: var(--gold); font-size: 0.82rem; cursor: pointer;
  text-decoration: none;
}

/* Bookings */
.booking-list { display: flex; flex-direction: column; gap: 12px; }
.booking-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
  padding: 18px 20px;
  background: var(--ink-80); border: 1px solid var(--ink-40);
  border-radius: var(--radius-md);
  transition: border-color 0.2s;
}
.booking-item:hover { border-color: rgba(201,146,42,0.3); }
.booking-item.cancelled { opacity: 0.5; }

.booking-item-left { display: flex; align-items: center; gap: 14px; }
.booking-mode-icon {
  font-size: 1.4rem;
  width: 40px; height: 40px;
  background: var(--ink-60);
  border-radius: var(--radius-sm);
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.booking-lawyer { font-weight: 600; color: var(--parchment); font-size: 0.9rem; margin-bottom: 2px; }
.booking-datetime { font-size: 0.78rem; color: var(--mist); }
.booking-mode { font-size: 0.75rem; color: var(--ink-20); margin-top: 2px; }

.booking-item-right {
  display: flex; flex-direction: column; align-items: flex-end; gap: 6px;
}
.status-badge {
  font-size: 0.7rem; font-weight: 600; letter-spacing: 0.05em;
  text-transform: uppercase; padding: 3px 10px; border-radius: 999px;
}
.status-badge.scheduled { background: rgba(74,124,111,0.15); color: #6bbfa9; border: 1px solid rgba(74,124,111,0.3); }
.status-badge.completed { background: rgba(201,146,42,0.12); color: var(--gold); border: 1px solid rgba(201,146,42,0.3); }
.status-badge.cancelled { background: rgba(192,57,43,0.1); color: #e07060; border: 1px solid rgba(192,57,43,0.3); }

.booking-fee { font-size: 0.9rem; font-weight: 600; color: var(--parchment); }
.cancel-btn {
  background: none; border: none;
  color: var(--mist); font-size: 0.75rem; cursor: pointer;
  transition: color 0.2s;
}
.cancel-btn:hover { color: #e07060; }

.empty-box {
  text-align: center; padding: 48px 20px;
  background: var(--ink-80); border: 1px solid var(--ink-40);
  border-radius: var(--radius-lg);
  display: flex; flex-direction: column; align-items: center;
}
.empty-icon { font-size: 2.5rem; margin-bottom: 12px; opacity: 0.4; }
.empty-box p { color: var(--mist); font-size: 0.9rem; }

/* Tips */
.tips-list { display: flex; flex-direction: column; gap: 12px; }
.tip-card {
  display: flex; gap: 12px;
  padding: 14px 16px;
  background: var(--ink-80); border: 1px solid var(--ink-40);
  border-radius: var(--radius-md);
}
.tip-icon { font-size: 1.1rem; flex-shrink: 0; margin-top: 2px; }
.tip-title { font-size: 0.85rem; font-weight: 600; color: var(--parchment); margin-bottom: 3px; }
.tip-text { font-size: 0.78rem; color: var(--mist); line-height: 1.5; }

/* Chat summary */
.chat-summary {
  background: var(--ink-80); border: 1px solid var(--ink-40);
  border-radius: var(--radius-md); padding: 20px;
  display: flex; flex-direction: column; gap: 14px;
}
.chat-stat { display: flex; align-items: center; gap: 10px; }
.cs-num { font-size: 2rem; font-weight: 900; color: var(--gold); }
.cs-label { font-size: 0.78rem; color: var(--mist); }
.chat-open-btn { width: 100%; justify-content: center; }
</style>
