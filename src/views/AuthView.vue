<template>
  <main class="auth-page">
    <div class="auth-bg">
      <div class="auth-orb orb-1"></div>
      <div class="auth-orb orb-2"></div>
    </div>

    <div class="auth-container">
      <!-- Left panel -->
      <div class="auth-left">
        <router-link to="/" class="auth-logo">
          <span class="logo-icon">⚖</span>
          <span>Urimaigal</span>
        </router-link>
        <div class="auth-left-content">
          <h2 class="auth-left-title">Justice, at your fingertips.</h2>
          <p class="auth-left-sub">
            Access 500+ verified advocates across Tamil Nadu. AI-powered guidance, affordable consultations, real results.
          </p>
          <div class="auth-features">
            <div class="auth-feature" v-for="f in features" :key="f">
              <span class="check">✓</span>
              <span>{{ f }}</span>
            </div>
          </div>
        </div>
        <div class="auth-quote">
          <p>"The law is reason, free from passion."</p>
          <span>— Aristotle</span>
        </div>
      </div>

      <!-- Right panel: form -->
      <div class="auth-right">
        <div class="auth-card">
          <div class="auth-tabs">
            <button
              class="auth-tab"
              :class="{ active: mode === 'login' }"
              @click="mode = 'login'; auth.clearError()"
            >Sign In</button>
            <button
              class="auth-tab"
              :class="{ active: mode === 'register' }"
              @click="mode = 'register'; auth.clearError()"
            >Create Account</button>
          </div>

          <!-- Login form -->
          <form v-if="mode === 'login'" class="auth-form" @submit.prevent="handleLogin">
            <div class="form-group">
              <label class="form-label">Email Address</label>
              <input
                v-model="loginEmail"
                type="email"
                class="form-input"
                placeholder="you@example.com"
                required
              />
            </div>
            <div class="form-group">
              <label class="form-label">Password</label>
              <input
                v-model="loginPassword"
                type="password"
                class="form-input"
                placeholder="••••••••"
                required
              />
            </div>
            <div v-if="auth.error" class="form-error">{{ auth.error }}</div>
            <button type="submit" class="btn-primary form-submit" :disabled="auth.isLoading">
              <span v-if="auth.isLoading" class="spinner"></span>
              <span v-else>Sign In →</span>
            </button>
            <p class="form-hint">
              Don't have an account?
              <button type="button" class="link-btn" @click="mode = 'register'">Create one free</button>
            </p>
          </form>

          <!-- Register form -->
          <form v-else class="auth-form" @submit.prevent="handleRegister">
            <div class="form-group">
              <label class="form-label">Full Name</label>
              <input
                v-model="regName"
                type="text"
                class="form-input"
                placeholder="Arjun Subramaniam"
                required
              />
            </div>
            <div class="form-group">
              <label class="form-label">Email Address</label>
              <input
                v-model="regEmail"
                type="email"
                class="form-input"
                placeholder="you@example.com"
                required
              />
            </div>
            <div class="form-group">
              <label class="form-label">Password</label>
              <input
                v-model="regPassword"
                type="password"
                class="form-input"
                placeholder="Min. 6 characters"
                required
                minlength="6"
              />
            </div>
            <div class="form-group">
              <label class="form-label">Register As</label>
              <select v-model="regRole" class="form-input" required>
                <option value="client">Client</option>
                <option value="advocate">Advocate</option>
              </select>
            </div>
            <div v-if="auth.error" class="form-error">{{ auth.error }}</div>
            <button type="submit" class="btn-primary form-submit" :disabled="auth.isLoading">
              <span v-if="auth.isLoading" class="spinner"></span>
              <span v-else>Create Account →</span>
            </button>
            <p class="form-hint">
              Already have an account?
              <button type="button" class="link-btn" @click="mode = 'login'">Sign in</button>
            </p>
          </form>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const router = useRouter()

const mode = ref<'login' | 'register'>('login')
const loginEmail = ref('')
const loginPassword = ref('')
const regName = ref('')
const regEmail = ref('')
const regPassword = ref('')
const regRole = ref<'client' | 'advocate'>('client')

const features = [
  'AI-powered instant legal guidance',
  'Verified advocates across Tamil Nadu',
  'Affordable & pro bono options',
  'Secure consultation booking',
  'Case history tracking',
]

async function handleLogin() {
  const ok = await auth.login(loginEmail.value, loginPassword.value)
  if (ok) {
    router.push(auth.isAdvocate ? '/advocate/dashboard' : '/dashboard')
  }
}

async function handleRegister() {
  const ok = await auth.register(regName.value, regEmail.value, regPassword.value, regRole.value)
  if (ok) {
    router.push(auth.isAdvocate ? '/advocate/dashboard' : '/dashboard')
  }
}
</script>

<style scoped>
.auth-page {
  min-height: 100vh;
  position: relative;
  display: flex;
  align-items: stretch;
}
.auth-bg {
  position: fixed; inset: 0;
  pointer-events: none; z-index: 0;
  overflow: hidden;
}
.auth-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(100px);
  opacity: 0.08;
}
.orb-1 { width: 500px; height: 500px; background: var(--gold); top: -150px; left: -150px; }
.orb-2 { width: 400px; height: 400px; background: #3a5a8c; bottom: -100px; right: -100px; }

.auth-container {
  position: relative; z-index: 1;
  display: flex;
  width: 100%;
  min-height: 100vh;
}

/* Left panel */
.auth-left {
  display: none;
  flex-direction: column;
  justify-content: space-between;
  padding: 48px 56px;
  background: var(--ink-80);
  border-right: 1px solid var(--ink-40);
  width: 45%;
  flex-shrink: 0;
}
@media (min-width: 960px) { .auth-left { display: flex; } }

.auth-logo {
  display: flex;
  align-items: center;
  gap: 10px;
  font-family: var(--font-display);
  font-size: 1.4rem;
  font-weight: 700;
  color: var(--gold);
  text-decoration: none;
}
.logo-icon { font-size: 1.5rem; }

.auth-left-content { flex: 1; display: flex; flex-direction: column; justify-content: center; padding: 40px 0; }
.auth-left-title {
  font-size: 2.4rem;
  font-weight: 900;
  color: var(--parchment);
  line-height: 1.2;
  margin-bottom: 16px;
}
.auth-left-sub {
  color: var(--mist);
  font-size: 0.95rem;
  line-height: 1.7;
  margin-bottom: 36px;
}
.auth-features { display: flex; flex-direction: column; gap: 12px; }
.auth-feature {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.88rem;
  color: var(--mist);
}
.check {
  width: 20px; height: 20px;
  background: rgba(201,146,42,0.15);
  border: 1px solid rgba(201,146,42,0.3);
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  color: var(--gold);
  font-size: 0.7rem;
  flex-shrink: 0;
}
.auth-quote {
  font-style: italic;
  color: var(--ink-20);
  font-size: 0.85rem;
}
.auth-quote span { display: block; margin-top: 4px; font-style: normal; font-size: 0.78rem; }

/* Right panel */
.auth-right {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 24px;
  padding-top: 110px;
}

.auth-card {
  width: 100%;
  max-width: 440px;
  animation: fadeUp 0.5s both;
}

.auth-tabs {
  display: flex;
  gap: 4px;
  background: var(--ink-80);
  border: 1px solid var(--ink-40);
  border-radius: var(--radius-md);
  padding: 4px;
  margin-bottom: 32px;
}
.auth-tab {
  flex: 1;
  padding: 10px;
  background: transparent;
  border: none;
  border-radius: 8px;
  color: var(--mist);
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}
.auth-tab.active {
  background: var(--ink-60);
  color: var(--parchment);
}

.auth-form { display: flex; flex-direction: column; gap: 20px; }

.form-group { display: flex; flex-direction: column; gap: 6px; }
.form-label { font-size: 0.82rem; color: var(--mist); font-weight: 500; letter-spacing: 0.03em; }
.form-input {
  padding: 12px 16px;
  background: var(--ink-80);
  border: 1px solid var(--ink-40);
  border-radius: var(--radius-md);
  color: var(--parchment);
  font-size: 0.95rem;
  outline: none;
  transition: border-color 0.2s;
}
.form-input::placeholder { color: var(--ink-20); }
.form-input:focus { border-color: var(--gold); box-shadow: 0 0 0 3px rgba(201,146,42,0.08); }

.form-error {
  padding: 10px 14px;
  background: rgba(192,57,43,0.1);
  border: 1px solid rgba(192,57,43,0.3);
  border-radius: var(--radius-sm);
  color: #e07060;
  font-size: 0.85rem;
}
.form-submit {
  width: 100%;
  justify-content: center;
  padding: 14px;
  font-size: 0.95rem;
  margin-top: 4px;
}
.form-submit:disabled { opacity: 0.6; cursor: not-allowed; }

.spinner {
  width: 18px; height: 18px;
  border: 2px solid rgba(0,0,0,0.2);
  border-top-color: var(--ink);
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
  display: inline-block;
}

.form-hint { font-size: 0.83rem; color: var(--mist); text-align: center; }
.link-btn {
  background: none; border: none;
  color: var(--gold);
  cursor: pointer;
  font-size: inherit;
  text-decoration: underline;
}
</style>
