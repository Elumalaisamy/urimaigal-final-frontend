<template>
  <main class="advocate-dashboard">
    <div class="dash-header">
      <div class="container">
        <div class="dash-welcome">
          <div class="dash-avatar">{{ initials }}</div>
          <div>
            <p class="dash-greeting">Welcome back,</p>
            <h1 class="dash-name">{{ auth.userName }}</h1>
            <p class="advocate-badge">Advocate</p>
          </div>
        </div>
        <div class="dash-quick-actions">
          <router-link to="/advocate/profile" class="btn-primary">Edit Profile →</router-link>
          <button class="btn-ghost" @click="toggleVisibility()">
            {{ profile?.available ? 'Hide Profile' : 'Show Profile' }}
          </button>
          <button class="btn-ghost" @click="fetchDashboardData()" :disabled="isLoadingData">
            {{ isLoadingData ? 'Refreshing...' : 'Refresh Data' }}
          </button>
        </div>
      </div>
    </div>

    <div class="container dash-body">
      <!-- Profile Status -->
      <div class="profile-status-card">
        <div class="status-header">
          <h3>Profile Status</h3>
          <div class="status-indicator" :class="{ complete: profileComplete }">
            {{ profileComplete ? '✓ Complete' : '⚠ Incomplete' }}
          </div>
        </div>
        <div class="status-progress">
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: profileProgress + '%' }"></div>
          </div>
          <span>{{ profileProgress }}% Complete</span>
        </div>
        <div v-if="!profileComplete" class="status-actions">
          <router-link to="/advocate/profile" class="btn-ghost">Complete Profile</router-link>
        </div>
      </div>

      <!-- Stats row -->
      <div class="dash-stats">
        <div class="dash-stat-card" v-for="s in statCards" :key="s.label">
          <div class="stat-icon">{{ s.icon }}</div>
          <div class="stat-info">
            <div class="stat-value" v-if="!isLoadingData">{{ s.value }}</div>
            <div class="stat-value loading" v-else>...</div>
            <div class="stat-label">{{ s.label }}</div>
          </div>
        </div>
      </div>

      <div class="dash-grid">
        <!-- Upcoming Consultations -->
        <section class="dash-section consultations-section">
          <div class="section-head">
            <h2 class="section-title">Upcoming Consultations</h2>
            <button class="link-btn" @click="viewAllConsultations()">View All</button>
          </div>

          <div v-if="upcomingConsultations.length === 0" class="empty-box">
            <div class="empty-icon">📅</div>
            <p>No upcoming consultations.</p>
            <p class="empty-sub">Clients will book consultations through your profile.</p>
          </div>

          <div v-else class="consultation-list">
            <div
              class="consultation-item"
              v-for="c in upcomingConsultations"
              :key="c.id"
            >
              <div class="consultation-item-left">
                <div class="consultation-mode-icon">{{ c.mode === 'video' ? '📹' : '💬' }}</div>
                <div>
                  <div class="consultation-client">Client: {{ c.clientName || 'Anonymous' }}</div>
                  <div class="consultation-datetime">{{ c.date }} · {{ c.time }}</div>
                  <div class="consultation-mode">{{ c.mode === 'video' ? 'Video Call' : 'Chat Session' }}</div>
                </div>
              </div>
              <div class="consultation-item-right">
                <span class="status-badge scheduled">{{ c.status }}</span>
                <div class="consultation-fee">₹{{ c.fee.toLocaleString('en-IN') }}</div>
                <div class="consultation-actions">
                  <button class="action-btn" @click="startConsultation(c)">Start</button>
                  <button class="action-btn cancel" @click="cancelConsultation(c.id)">Cancel</button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Sidebar: Earnings & Analytics -->
        <aside class="dash-sidebar">
          <section class="dash-section">
            <h2 class="section-title">Earnings This Month</h2>
            <div class="earnings-summary">
              <div class="earnings-amount" v-if="!isLoadingData">₹{{ monthlyEarnings.toLocaleString('en-IN') }}</div>
              <div class="earnings-amount loading" v-else>...</div>
              <div class="earnings-breakdown">
                <div class="earning-item">
                  <span>Completed: {{ isLoadingData ? '...' : completedThisMonth }}</span>
                  <span>₹{{ isLoadingData ? '...' : completedEarnings.toLocaleString('en-IN') }}</span>
                </div>
                <div class="earning-item">
                  <span>Upcoming: {{ isLoadingData ? '...' : upcomingThisMonth }}</span>
                  <span>₹{{ isLoadingData ? '...' : upcomingEarnings.toLocaleString('en-IN') }}</span>
                </div>
              </div>
            </div>
          </section>

          <section class="dash-section" style="margin-top: 28px">
            <h2 class="section-title">Profile Analytics</h2>
            <div class="analytics-list">
              <div class="analytic-item">
                <span class="analytic-label">Profile Views</span>
                <span class="analytic-value">{{ isLoadingData ? '...' : profileViews }}</span>
              </div>
              <div class="analytic-item">
                <span class="analytic-label">Booking Requests</span>
                <span class="analytic-value">{{ isLoadingData ? '...' : bookingRequests }}</span>
              </div>
              <div class="analytic-item">
                <span class="analytic-label">Conversion Rate</span>
                <span class="analytic-value">{{ isLoadingData ? '...' : conversionRate }}%</span>
              </div>
            </div>
          </section>

          <section class="dash-section" style="margin-top: 28px">
            <h2 class="section-title">Quick Actions</h2>
            <div class="quick-actions">
              <button class="quick-action-btn" @click="updateAvailability()">
                {{ profile?.available ? 'Set Unavailable' : 'Set Available' }}
              </button>
              <button class="quick-action-btn" @click="viewPublicProfile()">View Public Profile</button>
              <button class="quick-action-btn" @click="exportConsultations()">Export Records</button>
            </div>
          </section>
        </aside>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useLawyersStore } from '@/stores/lawyers'
import { useBookingStore } from '@/stores/booking'

interface AdvocateConsultation {
  id: string
  clientName?: string
  date: string
  time: string
  mode: 'chat' | 'video'
  status: string
  fee: number
}

interface AdvocateConsultation {
  id: string
  clientName?: string
  date: string
  time: string
  mode: 'chat' | 'video'
  status: string
  fee: number
}

const auth = useAuthStore()
const lawyers = useLawyersStore()
const booking = useBookingStore()
const router = useRouter()

// Real data from APIs
const upcomingConsultations = ref<AdvocateConsultation[]>([])
const earningsData = ref({
  monthlyEarnings: 0,
  completedThisMonth: 0,
  completedEarnings: 0,
  upcomingThisMonth: 0,
  upcomingEarnings: 0,
})
const analyticsData = ref({
  profileViews: 0,
  bookingRequests: 0,
  conversionRate: 0,
})
const isLoadingData = ref(false)

const profile = computed(() => {
  if (!auth.user) return null
  return lawyers.getAdvocateByUserId(auth.user.id)
})

const initials = computed(() =>
  auth.userName
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
)

const profileComplete = computed(() => {
  if (!profile.value) return false
  return Boolean(
    profile.value.name &&
    profile.value.location &&
    profile.value.specialization &&
    profile.value.experience > 0 &&
    profile.value.consultationFee >= 0 &&
    profile.value.languages.length > 0 &&
    profile.value.bio
  )
})

const profileProgress = computed(() => {
  if (!profile.value) return 0
  let completed = 0
  const total = 7
  if (profile.value.name) completed++
  if (profile.value.location) completed++
  if (profile.value.specialization) completed++
  if (profile.value.experience > 0) completed++
  if (profile.value.consultationFee >= 0) completed++
  if (profile.value.languages.length > 0) completed++
  if (profile.value.bio) completed++
  return Math.round((completed / total) * 100)
})

// Reactive computed properties for earnings and analytics
const monthlyEarnings = computed(() => earningsData.value.monthlyEarnings)
const completedThisMonth = computed(() => earningsData.value.completedThisMonth)
const completedEarnings = computed(() => earningsData.value.completedEarnings)
const upcomingThisMonth = computed(() => earningsData.value.upcomingThisMonth)
const upcomingEarnings = computed(() => earningsData.value.upcomingEarnings)
const profileViews = computed(() => analyticsData.value.profileViews)
const bookingRequests = computed(() => analyticsData.value.bookingRequests)
const conversionRate = computed(() => analyticsData.value.conversionRate)

async function fetchDashboardData() {
  if (!auth.user || auth.user.role !== 'advocate') return

  isLoadingData.value = true
  try {
    // Fetch consultations
    const consultations = await booking.fetchAdvocateConsultations()
    upcomingConsultations.value = consultations.filter(c => c.status === 'scheduled')

    // Fetch earnings
    const earnings = await lawyers.fetchAdvocateEarnings()
    if (earnings) {
      earningsData.value = earnings
    }

    // Fetch analytics
    const analytics = await lawyers.fetchAdvocateAnalytics()
    if (analytics) {
      analyticsData.value = analytics
    }
  } catch (error) {
    console.error('Error fetching dashboard data:', error)
  } finally {
    isLoadingData.value = false
  }
}

// Watch for profile changes to update completion status
watch(profile, () => {
  // Profile completion will automatically update via computed properties
}, { immediate: true })

// Watch for lawyers store changes (when profile is updated)
watch(() => lawyers.lawyers, () => {
  // Refresh dashboard data when lawyers list changes (profile updates)
  fetchDashboardData()
}, { deep: true })

onMounted(() => {
  fetchDashboardData()
})

const statCards = computed(() => [
  {
    icon: '📅',
    value: upcomingConsultations.value.length,
    label: 'Upcoming',
  },
  {
    icon: '✅',
    value: completedThisMonth.value,
    label: 'Completed',
  },
  {
    icon: '💰',
    value: '₹' + monthlyEarnings.value.toLocaleString('en-IN'),
    label: 'This Month',
  },
  {
    icon: '👁',
    value: profileViews.value,
    label: 'Profile Views',
  },
])

async function toggleVisibility() {
  if (!profile.value) return

  const updated = { ...profile.value, available: !profile.value.available }
  const success = await lawyers.updateAdvocateProfile(updated)
  if (success) {
    // Profile will be updated in the store automatically
  }
}

function viewAllConsultations() {
  // Navigate to a full consultations management page
  router.push('/advocate/consultations')
}

function startConsultation(consultation: any) {
  // Open consultation interface or start the session
  console.log('Starting consultation:', consultation)
  // TODO: Implement consultation start logic
  // This could open a chat/video interface
}

async function cancelConsultation(id: string) {
  // Cancel consultation logic with API call
  try {
    const response = await fetch(`http://localhost:8080/api/advocate/consultations/${id}/cancel`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${auth.token}`,
      },
    })
    const result = await response.json()
    if (result.success) {
      // Remove from local list
      upcomingConsultations.value = upcomingConsultations.value.filter(c => c.id !== id)
    } else {
      console.error('Failed to cancel consultation:', result.message)
    }
  } catch (error) {
    console.error('Error cancelling consultation:', error)
  }
}

function updateAvailability() {
  toggleVisibility()
}

function viewPublicProfile() {
  if (!profile.value) return
  router.push(`/lawyers/${profile.value.id}`)
}

function exportConsultations() {
  // Export functionality
  console.log('Exporting consultations')
}
</script>

<style scoped>
.advocate-dashboard { padding-top: 70px; min-height: 100vh; }

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
.advocate-badge {
  font-size: 0.75rem; color: var(--gold); font-weight: 600;
  text-transform: uppercase; letter-spacing: 0.08em;
  margin-top: 4px;
}

.dash-quick-actions { display: flex; gap: 12px; }

.dash-body { padding: 36px 0 72px; }

/* Profile Status */
.profile-status-card {
  background: var(--ink-80); border: 1px solid var(--ink-40);
  border-radius: var(--radius-md); padding: 24px; margin-bottom: 28px;
}
.status-header {
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 16px;
}
.status-header h3 {
  font-size: 1.1rem; font-weight: 700; color: var(--parchment);
}
.status-indicator {
  font-size: 0.85rem; font-weight: 600; padding: 4px 12px;
  border-radius: 20px;
}
.status-indicator.complete {
  background: rgba(54, 179, 126, 0.15); color: #36b37e;
}
.status-indicator:not(.complete) {
  background: rgba(239, 83, 80, 0.15); color: #ef5350;
}
.status-progress {
  display: flex; align-items: center; gap: 12px;
}
.progress-bar {
  flex: 1; height: 8px; background: var(--ink-60);
  border-radius: 4px; overflow: hidden;
}
.progress-fill {
  height: 100%; background: var(--gold);
  transition: width 0.3s ease;
}
.status-actions { margin-top: 16px; }

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

/* Consultations */
.consultation-list { display: flex; flex-direction: column; gap: 12px; }
.consultation-item {
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
.consultation-item:hover { border-color: rgba(201,146,42,0.3); }

.consultation-item-left { display: flex; align-items: center; gap: 14px; }
.consultation-mode-icon { font-size: 1.2rem; }
.consultation-client { font-weight: 600; color: var(--parchment); }
.consultation-datetime { font-size: 0.85rem; color: var(--mist); }
.consultation-mode { font-size: 0.8rem; color: var(--gold); }

.consultation-item-right {
  display: flex; align-items: center; gap: 16px;
  flex-wrap: wrap;
}
.status-badge {
  padding: 4px 12px; border-radius: 20px; font-size: 0.75rem;
  font-weight: 600; text-transform: uppercase;
}
.status-badge.scheduled { background: rgba(201,146,42,0.15); color: var(--gold); }
.consultation-fee { font-weight: 700; color: var(--parchment); }
.consultation-actions { display: flex; gap: 8px; }
.action-btn {
  padding: 6px 12px; border: 1px solid var(--ink-40);
  background: var(--ink-60); color: var(--parchment);
  border-radius: var(--radius-sm); font-size: 0.8rem; cursor: pointer;
  transition: all 0.2s;
}
.action-btn:hover { border-color: var(--gold); color: var(--gold); }
.action-btn.cancel:hover { border-color: #ef5350; color: #ef5350; }

/* Sidebar */
.dash-sidebar .dash-section { margin-bottom: 0; }

.earnings-summary {
  background: var(--ink-60); border-radius: var(--radius-md);
  padding: 20px; text-align: center;
}
.earnings-amount {
  font-size: 2rem; font-weight: 900; color: var(--gold);
  margin-bottom: 16px;
}
.earnings-breakdown { display: flex; flex-direction: column; gap: 8px; }
.earning-item {
  display: flex; justify-content: space-between;
  font-size: 0.85rem; color: var(--mist);
}

.analytics-list { display: flex; flex-direction: column; gap: 12px; }
.analytic-item {
  display: flex; justify-content: space-between; align-items: center;
  padding: 12px 0; border-bottom: 1px solid var(--ink-40);
}
.analytic-item:last-child { border-bottom: none; }
.analytic-label { color: var(--mist); }
.analytic-value { font-weight: 700; color: var(--parchment); }

.quick-actions { display: flex; flex-direction: column; gap: 8px; }
.quick-action-btn {
  width: 100%; padding: 12px; text-align: left;
  background: var(--ink-60); border: 1px solid var(--ink-40);
  border-radius: var(--radius-sm); color: var(--parchment);
  cursor: pointer; transition: all 0.2s;
}
.quick-action-btn:hover {
  border-color: var(--gold); color: var(--gold);
}

.stat-value.loading,
.earnings-amount.loading {
  opacity: 0.6;
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 0.6; }
  50% { opacity: 1; }
}
</style>