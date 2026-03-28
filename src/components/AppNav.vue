<template>
  <nav class="nav" :class="{ scrolled: isScrolled }">
    <div class="nav-inner container">
      <router-link to="/" class="logo">
        <span class="logo-icon">⚖</span>
        <span class="logo-text">Urimaigal</span>
        <span class="logo-tagline">Justice Unified</span>
      </router-link>

      <div class="nav-links">
        <router-link to="/lawyers" class="nav-link">Find Advocates</router-link>
        <router-link v-if="auth.isAuthenticated" to="/dashboard" class="nav-link">My Cases</router-link>
        <button v-if="auth.isAuthenticated" class="btn-ghost nav-btn" @click="auth.logout(); router.push('/')">
          Sign Out
        </button>
        <router-link v-else to="/auth" class="btn-primary nav-btn">
          Get Started
        </router-link>
      </div>

      <button class="hamburger" @click="mobileOpen = !mobileOpen">
        <span></span><span></span><span></span>
      </button>
    </div>

    <!-- Mobile menu -->
    <transition name="slide-down">
      <div v-if="mobileOpen" class="mobile-menu">
        <router-link to="/lawyers" class="mobile-link" @click="mobileOpen = false">Find Advocates</router-link>
        <router-link v-if="auth.isAuthenticated" to="/dashboard" class="mobile-link" @click="mobileOpen = false">My Cases</router-link>
        <button v-if="auth.isAuthenticated" class="mobile-link" @click="auth.logout(); router.push('/'); mobileOpen = false">
          Sign Out
        </button>
        <router-link v-else to="/auth" class="mobile-link gold" @click="mobileOpen = false">Get Started →</router-link>
      </div>
    </transition>
  </nav>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const router = useRouter()
const isScrolled = ref(false)
const mobileOpen = ref(false)

function onScroll() { isScrolled.value = window.scrollY > 40 }
onMounted(() => window.addEventListener('scroll', onScroll))
onUnmounted(() => window.removeEventListener('scroll', onScroll))
</script>

<style scoped>
.nav {
  position: fixed;
  top: 0; left: 0; right: 0;
  z-index: 100;
  transition: background 0.3s ease, box-shadow 0.3s ease;
}
.nav.scrolled {
  background: rgba(13,15,20,0.95);
  backdrop-filter: blur(12px);
  box-shadow: 0 1px 0 rgba(201,146,42,0.15);
}
.nav-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 70px;
}
.logo {
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
}
.logo-icon {
  font-size: 1.5rem;
  filter: drop-shadow(0 0 8px rgba(201,146,42,0.5));
}
.logo-text {
  font-family: var(--font-display);
  font-size: 1.4rem;
  font-weight: 700;
  color: var(--gold);
}
.logo-tagline {
  font-size: 0.7rem;
  color: var(--mist);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin-left: 4px;
  display: none;
}
@media (min-width: 768px) { .logo-tagline { display: inline; } }

.nav-links {
  display: none;
  align-items: center;
  gap: 24px;
}
@media (min-width: 768px) { .nav-links { display: flex; } }

.nav-link {
  color: var(--mist);
  font-size: 0.9rem;
  font-weight: 400;
  text-decoration: none;
  transition: color 0.2s;
}
.nav-link:hover, .nav-link.router-link-active { color: var(--parchment); }
.nav-btn { font-size: 0.88rem; padding: 9px 20px; }

.hamburger {
  display: flex;
  flex-direction: column;
  gap: 5px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
}
@media (min-width: 768px) { .hamburger { display: none; } }
.hamburger span {
  display: block;
  width: 22px; height: 2px;
  background: var(--parchment);
  border-radius: 2px;
  transition: 0.3s;
}

.mobile-menu {
  background: var(--ink-80);
  border-top: 1px solid var(--ink-40);
  display: flex;
  flex-direction: column;
  padding: 12px 0;
}
.mobile-link {
  padding: 14px 24px;
  color: var(--mist);
  font-size: 0.95rem;
  background: none;
  border: none;
  text-align: left;
  cursor: pointer;
  transition: color 0.2s;
  width: 100%;
}
.mobile-link:hover { color: var(--parchment); }
.mobile-link.gold { color: var(--gold); font-weight: 500; }

.slide-down-enter-active, .slide-down-leave-active {
  transition: all 0.25s ease;
}
.slide-down-enter-from, .slide-down-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
