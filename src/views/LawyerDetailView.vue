<template>
  <main class="detail-page" v-if="lawyer">
    <div class="detail-hero">
      <div class="container detail-hero-inner">
        <router-link to="/lawyers" class="back-link">← Back to Advocates</router-link>

        <div class="detail-header">
          <img :src="lawyer.avatar" :alt="lawyer.name" class="detail-avatar" />
          <div class="detail-info">
            <div class="detail-tags">
              <span class="specialization-tag tag">{{ lawyer.specialization }}</span>
              <span v-if="lawyer.badge" class="badge-tag tag" :class="badgeClass">{{ lawyer.badge }}</span>
            </div>
            <h1 class="detail-name">{{ lawyer.name }}</h1>
            <div class="detail-meta">
              <span>📍 {{ lawyer.location }}</span>
              <span>{{ lawyer.experience }} years experience</span>
              <span class="avail-status" :class="{ available: lawyer.available }">
                {{ lawyer.available ? '● Available' : '● Busy' }}
              </span>
            </div>
            <div class="detail-langs">
              <span v-for="lang in lawyer.languages" :key="lang" class="lang-chip">{{ lang }}</span>
            </div>
            <div class="detail-rating-row">
              <div class="rating-big">
                <span class="stars">★</span>
                <span class="rating-val">{{ lawyer.rating }}</span>
                <span class="review-count">{{ lawyer.reviewCount }} reviews</span>
              </div>
              <div class="fee-big">
                <span v-if="lawyer.consultationFee === 0" class="free-big">Free Consultation</span>
                <span v-else>
                  ₹{{ lawyer.consultationFee.toLocaleString('en-IN') }}
                  <span class="fee-unit">/ session</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="container detail-body">
      <!-- Left: bio + reviews -->
      <div class="detail-content">
        <section class="detail-section">
          <h2 class="section-heading">About</h2>
          <p class="bio-text">{{ lawyer.bio }}</p>
        </section>

        <section class="detail-section">
          <h2 class="section-heading">Area of Expertise</h2>
          <div class="expertise-grid">
            <div class="expertise-item" v-for="item in expertiseItems" :key="item.label">
              <span class="exp-icon">{{ item.icon }}</span>
              <span>{{ item.label }}</span>
            </div>
          </div>
        </section>

        <section class="detail-section">
          <h2 class="section-heading">Client Reviews</h2>
          <div class="reviews-list">
            <div class="review-card" v-for="r in mockReviews" :key="r.name">
              <div class="review-header">
                <div class="review-avatar">{{ r.name.charAt(0) }}</div>
                <div>
                  <div class="review-name">{{ r.name }}</div>
                  <div class="review-stars">{{ '★'.repeat(r.rating) }}{{ '☆'.repeat(5 - r.rating) }}</div>
                </div>
                <span class="review-date">{{ r.date }}</span>
              </div>
              <p class="review-text">{{ r.text }}</p>
            </div>
          </div>
        </section>
      </div>

      <!-- Right: booking card -->
      <aside class="booking-card">
        <h3 class="booking-title">Book a Consultation</h3>

        <div v-if="booking.successMessage" class="booking-success">
          <span class="success-icon">✓</span>
          <p>{{ booking.successMessage }}</p>
          <button class="btn-ghost" style="margin-top:12px; width:100%; justify-content:center" @click="booking.clearSuccess()">
            Book Another
          </button>
        </div>

        <form v-else class="booking-form" @submit.prevent="handleBook">
          <div class="form-group">
            <label class="form-label">Consultation Type</label>
            <div class="mode-toggle">
              <button
                type="button"
                class="mode-btn"
                :class="{ active: bookMode === 'chat' }"
                @click="bookMode = 'chat'"
              >💬 Chat</button>
              <button
                type="button"
                class="mode-btn"
                :class="{ active: bookMode === 'video' }"
                @click="bookMode = 'video'"
              >📹 Video</button>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Select Date</label>
            <input
              v-model="bookDate"
              type="date"
              class="form-input"
              :min="minDate"
              required
            />
          </div>

          <div class="form-group">
            <label class="form-label">Select Time</label>
            <select v-model="bookTime" class="form-input" required>
              <option value="">Choose a slot</option>
              <option v-for="slot in timeSlots" :key="slot" :value="slot">{{ slot }}</option>
            </select>
          </div>

          <div class="fee-summary">
            <span>Consultation Fee</span>
            <span class="fee-amount">
              {{ lawyer.consultationFee === 0 ? 'Free' : '₹' + lawyer.consultationFee.toLocaleString('en-IN') }}
            </span>
          </div>

          <div v-if="!auth.isAuthenticated" class="login-prompt">
            <router-link to="/auth" class="btn-primary" style="width:100%;justify-content:center">
              Sign in to Book →
            </router-link>
          </div>
          <button v-else type="submit" class="btn-primary booking-submit" :disabled="booking.isLoading">
            <span v-if="booking.isLoading" class="spinner"></span>
            <span v-else>Confirm Booking →</span>
          </button>
        </form>
      </aside>
    </div>
  </main>

  <div v-else class="not-found container">
    <h2>Advocate not found</h2>
    <router-link to="/lawyers" class="btn-ghost">← Back to Advocates</router-link>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useLawyersStore } from '@/stores/lawyers'
import { useBookingStore } from '@/stores/booking'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const lawyersStore = useLawyersStore()
const booking = useBookingStore()
const auth = useAuthStore()

const lawyer = computed(() => lawyersStore.getLawyerById(route.params.id as string))

const bookMode = ref<'chat' | 'video'>('chat')
const bookDate = ref('')
const bookTime = ref('')

const minDate = new Date().toISOString().split('T')[0]

const timeSlots = [
  '9:00 AM', '10:00 AM', '11:00 AM',
  '12:00 PM', '2:00 PM', '3:00 PM',
  '4:00 PM', '5:00 PM', '6:00 PM',
]

const badgeClass = computed(() => ({
  'badge-gold': lawyer.value?.badge === 'Top Rated',
  'badge-sage': lawyer.value?.badge === 'Rising Star',
  'badge-mist': lawyer.value?.badge === 'Pro Bono',
}))

const expertiseItems = computed(() => {
  const map: Record<string, { icon: string; label: string }[]> = {
    Criminal: [
      { icon: '⚖', label: 'Criminal Defense' },
      { icon: '📋', label: 'Bail Applications' },
      { icon: '🏛', label: 'Trial Proceedings' },
      { icon: '📝', label: 'Appeals' },
    ],
    Corporate: [
      { icon: '🏢', label: 'Company Formation' },
      { icon: '📑', label: 'Contract Drafting' },
      { icon: '🤝', label: 'M&A Due Diligence' },
      { icon: '📊', label: 'Compliance' },
    ],
    Family: [
      { icon: '👨‍👩‍👧', label: 'Divorce Proceedings' },
      { icon: '👶', label: 'Child Custody' },
      { icon: '💰', label: 'Maintenance Claims' },
      { icon: '🏠', label: 'Domestic Violence' },
    ],
    Civil: [
      { icon: '🏠', label: 'Property Disputes' },
      { icon: '⚡', label: 'Injunctions' },
      { icon: '💵', label: 'Recovery Suits' },
      { icon: '📜', label: 'Title Disputes' },
    ],
  }
  const spec = lawyer.value?.specialization ?? 'Civil'
  return map[spec] ?? [
    { icon: '⚖', label: 'Legal Consultation' },
    { icon: '📋', label: 'Case Analysis' },
    { icon: '🏛', label: 'Court Representation' },
    { icon: '📝', label: 'Documentation' },
  ]
})

const mockReviews = [
  { name: 'Ranjith Kumar', rating: 5, date: 'Jan 2025', text: 'Exceptional advocate. Explained everything clearly and fought hard for my case. Highly recommended.' },
  { name: 'Anitha S.', rating: 5, date: 'Dec 2024', text: 'Very professional and knowledgeable. Resolved my issue faster than I expected.' },
  { name: 'Mohammed Farhan', rating: 4, date: 'Nov 2024', text: 'Good communication and transparent about fees. Would use again.' },
]

async function handleBook() {
  if (!lawyer.value || !bookDate.value || !bookTime.value) return
  await booking.bookConsultation(
    lawyer.value.id,
    lawyer.value.name,
    bookDate.value,
    bookTime.value,
    bookMode.value,
    lawyer.value.consultationFee
  )
}
</script>

<style scoped>
.detail-page { padding-top: 70px; min-height: 100vh; }

.detail-hero {
  background: var(--ink-80);
  border-bottom: 1px solid var(--ink-40);
  padding: 40px 0;
}
.detail-hero-inner { display: flex; flex-direction: column; gap: 24px; }
.back-link {
  color: var(--mist); font-size: 0.85rem; text-decoration: none;
  transition: color 0.2s;
}
.back-link:hover { color: var(--gold); }

.detail-header {
  display: flex;
  gap: 28px;
  align-items: flex-start;
  flex-wrap: wrap;
}
.detail-avatar {
  width: 100px; height: 100px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid var(--ink-40);
  background: var(--ink-60);
  flex-shrink: 0;
}
.detail-info { flex: 1; min-width: 260px; }

.detail-tags { display: flex; gap: 8px; margin-bottom: 10px; }
.specialization-tag {
  background: rgba(201,146,42,0.12); color: var(--gold);
  border: 1px solid rgba(201,146,42,0.25); font-size: 0.72rem; letter-spacing: 0.06em;
}
.badge-tag { font-size: 0.72rem; letter-spacing: 0.06em; }
.badge-gold { background: rgba(201,146,42,0.12); color: var(--gold); border: 1px solid rgba(201,146,42,0.3); }
.badge-sage { background: rgba(74,124,111,0.12); color: #6bbfa9; border: 1px solid rgba(74,124,111,0.3); }
.badge-mist { background: rgba(139,150,168,0.12); color: var(--mist); border: 1px solid rgba(139,150,168,0.3); }

.detail-name {
  font-size: 2rem; font-weight: 900; color: var(--parchment); margin-bottom: 10px;
}
.detail-meta {
  display: flex; gap: 20px; flex-wrap: wrap;
  font-size: 0.85rem; color: var(--mist); margin-bottom: 12px;
}
.avail-status { color: var(--mist); }
.avail-status.available { color: #4caf7d; }

.detail-langs { display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 16px; }
.lang-chip {
  font-size: 0.75rem; padding: 4px 10px;
  background: var(--ink-60); border-radius: 999px; color: var(--mist);
}

.detail-rating-row {
  display: flex; gap: 32px; align-items: center; flex-wrap: wrap;
}
.rating-big { display: flex; align-items: center; gap: 6px; }
.stars { color: var(--gold); font-size: 1.2rem; }
.rating-val { font-size: 1.4rem; font-weight: 700; color: var(--parchment); }
.review-count { font-size: 0.82rem; color: var(--mist); }
.fee-big { font-size: 1.5rem; font-weight: 700; color: var(--gold); }
.fee-unit { font-size: 0.8rem; font-weight: 400; color: var(--mist); }
.free-big { color: #4caf7d; }

/* Body */
.detail-body {
  display: grid;
  grid-template-columns: 1fr 340px;
  gap: 36px;
  padding: 40px 0 80px;
  align-items: start;
}
@media (max-width: 900px) { .detail-body { grid-template-columns: 1fr; } }

.detail-section { margin-bottom: 40px; }
.section-heading {
  font-size: 1.1rem; font-weight: 700; color: var(--parchment);
  margin-bottom: 16px;
  padding-bottom: 10px;
  border-bottom: 1px solid var(--ink-40);
}
.bio-text { color: var(--mist); line-height: 1.8; font-size: 0.95rem; }

.expertise-grid {
  display: grid; grid-template-columns: 1fr 1fr; gap: 10px;
}
.expertise-item {
  display: flex; align-items: center; gap: 10px;
  padding: 12px 16px;
  background: var(--ink-80); border: 1px solid var(--ink-40);
  border-radius: var(--radius-md);
  font-size: 0.85rem; color: var(--mist);
}
.exp-icon { font-size: 1.1rem; }

.reviews-list { display: flex; flex-direction: column; gap: 16px; }
.review-card {
  padding: 20px;
  background: var(--ink-80); border: 1px solid var(--ink-40);
  border-radius: var(--radius-md);
}
.review-header { display: flex; align-items: center; gap: 12px; margin-bottom: 10px; }
.review-avatar {
  width: 36px; height: 36px;
  background: linear-gradient(135deg, var(--gold), var(--gold-light));
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-weight: 700; color: var(--ink); font-size: 0.85rem;
  flex-shrink: 0;
}
.review-name { font-size: 0.88rem; font-weight: 500; color: var(--parchment); }
.review-stars { font-size: 0.75rem; color: var(--gold); }
.review-date { margin-left: auto; font-size: 0.75rem; color: var(--mist); }
.review-text { font-size: 0.85rem; color: var(--mist); line-height: 1.65; }

/* Booking card */
.booking-card {
  background: var(--ink-80);
  border: 1px solid var(--ink-40);
  border-radius: var(--radius-lg);
  padding: 28px;
  position: sticky;
  top: 90px;
}
.booking-title {
  font-size: 1.1rem; font-weight: 700; color: var(--parchment);
  margin-bottom: 24px;
}
.booking-form { display: flex; flex-direction: column; gap: 18px; }

.form-group { display: flex; flex-direction: column; gap: 7px; }
.form-label { font-size: 0.8rem; color: var(--mist); font-weight: 500; letter-spacing: 0.03em; }
.form-input {
  padding: 11px 14px;
  background: var(--ink-60); border: 1px solid var(--ink-40);
  border-radius: var(--radius-md); color: var(--parchment); font-size: 0.9rem;
  outline: none; transition: border-color 0.2s;
}
.form-input:focus { border-color: var(--gold); }
.form-input option { background: var(--ink-60); }

.mode-toggle { display: flex; gap: 8px; }
.mode-btn {
  flex: 1; padding: 9px 12px;
  background: var(--ink-60); border: 1px solid var(--ink-40);
  border-radius: var(--radius-sm); color: var(--mist);
  font-size: 0.85rem; cursor: pointer; transition: all 0.2s;
}
.mode-btn.active {
  background: rgba(201,146,42,0.12);
  border-color: var(--gold); color: var(--gold);
}

.fee-summary {
  display: flex; justify-content: space-between; align-items: center;
  padding: 14px 0; border-top: 1px solid var(--ink-40);
  font-size: 0.88rem; color: var(--mist);
}
.fee-amount { font-size: 1.1rem; font-weight: 700; color: var(--gold); }

.booking-submit {
  width: 100%; justify-content: center;
  padding: 14px;
}
.booking-submit:disabled { opacity: 0.6; cursor: not-allowed; }

.booking-success {
  text-align: center; padding: 20px 0;
}
.success-icon {
  display: inline-flex; align-items: center; justify-content: center;
  width: 52px; height: 52px;
  background: rgba(76,175,125,0.15); border: 2px solid rgba(76,175,125,0.4);
  border-radius: 50%; color: #4caf7d; font-size: 1.5rem;
  margin-bottom: 14px;
}
.booking-success p { color: var(--mist); font-size: 0.9rem; line-height: 1.6; }

.login-prompt { margin-top: 4px; }

.spinner {
  width: 18px; height: 18px;
  border: 2px solid rgba(0,0,0,0.2);
  border-top-color: var(--ink);
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
  display: inline-block;
}

.not-found {
  padding: 120px 24px; text-align: center;
  display: flex; flex-direction: column; align-items: center; gap: 20px;
}
</style>
