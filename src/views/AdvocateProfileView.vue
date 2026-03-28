<template>
  <main class="profile-page">
    <div class="container">
      <h1>Advocate Profile</h1>
      <p class="subtitle">Complete your profile so clients can find you.</p>

      <form class="profile-form" @submit.prevent="saveProfile">
        <div class="form-group">
          <label>Full Name</label>
          <input v-model="name" required />
        </div>

        <div class="form-group">
          <label>Location</label>
          <input v-model="location" required />
        </div>

        <div class="form-group">
          <label>Specialization</label>
          <select v-model="specialization" required>
            <option value="Criminal">Criminal</option>
            <option value="Civil">Civil</option>
            <option value="Corporate">Corporate</option>
            <option value="Public Interest">Public Interest</option>
            <option value="Immigration">Immigration</option>
            <option value="Intellectual Property">Intellectual Property</option>
            <option value="Family">Family</option>
            <option value="Labour">Labour</option>
          </select>
        </div>

        <div class="form-group">
          <label>Years Experience</label>
          <input type="number" v-model.number="experience" min="0" required />
        </div>

        <div class="form-group">
          <label>Consultation Fee (₹)</label>
          <input type="number" v-model.number="consultationFee" min="0" required />
        </div>

        <div class="form-group">
          <label>Languages (comma separated)</label>
          <input v-model="languagesInput" placeholder="Tamil, English" required />
        </div>

        <div class="form-group">
          <label>Bio</label>
          <textarea v-model="bio" rows="4" required />
        </div>

        <div class="form-group checkbox-group">
          <label><input type="checkbox" v-model="available" /> Available for booking</label>
        </div>

        <div class="form-actions">
          <button type="submit" class="btn-primary" :disabled="isLoading">
            {{ isEditing ? 'Update Profile' : 'Save Profile' }}
          </button>
          <router-link to="/dashboard" class="btn-ghost">Back to dashboard</router-link>
        </div>

        <p v-if="error" class="error">{{ error }}</p>
        <p v-if="successMessage" class="success">{{ successMessage }}</p>
      </form>
    </div>
  </main>
</template>

<script setup lang="ts">
import { computed, ref, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useLawyersStore } from '@/stores/lawyers'
import type { Lawyer } from '@/types'

const auth = useAuthStore()
const lawyers = useLawyersStore()
const router = useRouter()

const isLoading = ref(false)

onMounted(() => {
  if (!auth.isAdvocate) {
    router.replace('/dashboard')
  }
})
const error = ref('')
const successMessage = ref('')

const profile = computed<Lawyer | undefined>(() => {
  if (!auth.user) return undefined
  return lawyers.getAdvocateByUserId(auth.user.id)
})

const name = ref(auth.user?.name ?? '')
const location = ref(profile.value?.location ?? '')
const specialization = ref(profile.value?.specialization ?? 'Criminal')
const experience = ref(profile.value?.experience ?? 0)
const consultationFee = ref(profile.value?.consultationFee ?? 0)
const languagesInput = ref(profile.value?.languages.join(', ') ?? 'Tamil, English')
const bio = ref(profile.value?.bio ?? '')
const available = ref(profile.value?.available ?? true)

const isEditing = computed(() => Boolean(profile.value))

watch(profile, (p) => {
  if (p) {
    name.value = p.name
    location.value = p.location
    specialization.value = p.specialization
    experience.value = p.experience
    consultationFee.value = p.consultationFee
    languagesInput.value = p.languages.join(', ')
    bio.value = p.bio
    available.value = p.available
  }
})

async function saveProfile() {
  if (!auth.user || auth.user.role !== 'advocate') {
    error.value = 'Only advocates can save advocate profiles.'
    return
  }

  isLoading.value = true
  error.value = ''
  successMessage.value = ''

  const profileData: Lawyer = {
    id: auth.user.id,
    name: name.value,
    avatar: '/images/default-avatar.png',
    specialization: specialization.value as any,
    experience: experience.value,
    rating: profile.value?.rating ?? 4.8,
    reviewCount: profile.value?.reviewCount ?? 0,
    location: location.value,
    languages: languagesInput.value.split(',').map((x) => x.trim()).filter(Boolean),
    consultationFee: consultationFee.value,
    bio: bio.value,
    available: available.value,
    badge: profile.value?.badge,
  }

  try {
    let ok = false
    if (isEditing.value) {
      ok = await lawyers.updateAdvocateProfile(profileData)
    } else {
      ok = await lawyers.createAdvocateProfile(profileData)
    }
    if (ok) {
      successMessage.value = 'Profile saved successfully. Redirecting to dashboard...'
      setTimeout(() => router.push('/dashboard'), 1200)
    } else {
      error.value = 'Could not save profile. Please try again.'
    }
  } catch (err) {
    error.value = 'Error saving profile.'
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.profile-page { padding: 100px 0 64px; }
.container { max-width: 720px; margin: 0 auto; }
.subtitle { margin-bottom: 20px; color: var(--mist); }
.profile-form { display: grid; gap: 16px; }
.form-group { display: flex; flex-direction: column; gap: 6px; }
.form-group input,
.form-group select,
.form-group textarea { padding: 10px 12px; border: 1px solid var(--ink-30); border-radius: var(--radius-sm); background: var(--ink-90); color: var(--parchment); }
.checkbox-group { align-items: center; }
.form-actions { display: flex; gap: 12px; align-items: center; }
.error { color: #ef5350; }
.success { color: #36b37e; }
</style>
