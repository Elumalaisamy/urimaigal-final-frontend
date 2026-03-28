<template>
  <main class="home">
    <!-- Hero -->
    <section class="hero">
      <div class="hero-bg">
        <div class="hero-orb orb-1"></div>
        <div class="hero-orb orb-2"></div>
        <div class="noise"></div>
      </div>
      <div class="container hero-content">
        <div class="hero-eyebrow">
          <span class="dot"></span>
          <span>Live In Lab III · Sri Sairam Engineering College</span>
        </div>
        <h1 class="hero-title">
          Justice Should Be<br />
          <em>Accessible to All.</em>
        </h1>
        <p class="hero-desc">
          Urimaigal connects citizens with verified advocates through AI-powered guidance.
          Find the right lawyer, get instant legal advice, book consultations — all in one place.
        </p>
        <div class="hero-actions">
          <router-link to="/lawyers" class="btn-primary">
            Find an Advocate →
          </router-link>
          <button class="btn-ghost" @click="chat.toggleChat()">
            Try AI Legal Help
          </button>
        </div>
        <div class="hero-stats">
          <div class="stat" v-for="s in stats" :key="s.label">
            <div class="stat-val">{{ s.value }}</div>
            <div class="stat-label">{{ s.label }}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Categories -->
    <section class="section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">Areas of Practice</h2>
          <p class="section-sub">Find advocates specializing in your area of need</p>
        </div>
        <div class="categories-grid">
          <router-link
            v-for="cat in categories"
            :key="cat.name"
            :to="`/lawyers?category=${cat.name}`"
            class="cat-card"
          >
            <span class="cat-icon">{{ cat.icon }}</span>
            <span class="cat-name">{{ cat.name }}</span>
          </router-link>
        </div>
      </div>
    </section>

    <!-- How it works -->
    <section class="section section-alt">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">How It Works</h2>
          <p class="section-sub">Three steps to justice</p>
        </div>
        <div class="steps-grid">
          <div class="step" v-for="(step, i) in steps" :key="i">
            <div class="step-num">{{ String(i + 1).padStart(2, '0') }}</div>
            <h3 class="step-title">{{ step.title }}</h3>
            <p class="step-desc">{{ step.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- SDG Banner -->
    <section class="section sdg-section">
      <div class="container">
        <div class="sdg-card">
          <div class="sdg-content">
            <div class="sdg-badges">
              <span class="sdg-badge sdg-16">SDG 16</span>
              <span class="sdg-badge sdg-8">SDG 8</span>
              <span class="sdg-badge sdg-4">SDG 4</span>
            </div>
            <h2 class="sdg-title">Advancing the UN Sustainable Development Goals</h2>
            <p class="sdg-desc">
              Urimaigal is built in alignment with SDG 16 (Peace, Justice & Strong Institutions),
              SDG 8 (Decent Work & Economic Growth), and SDG 4 (Quality Education) —
              making legal help accessible, creating opportunities for advocates, and educating citizens.
            </p>
          </div>
          <div class="sdg-icons">
            <div class="sdg-circle c16">16</div>
            <div class="sdg-circle c8">8</div>
            <div class="sdg-circle c4">4</div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="cta-section">
      <div class="container cta-content">
        <h2 class="cta-title">Ready to find your advocate?</h2>
        <p class="cta-sub">Join thousands of citizens who found legal help through Urimaigal.</p>
        <div class="hero-actions">
          <router-link to="/auth" class="btn-primary">Get Started Free →</router-link>
          <router-link to="/lawyers" class="btn-ghost">Browse Advocates</router-link>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { useChatStore } from '@/stores/chat'

const chat = useChatStore()

const stats = [
  { value: '500+', label: 'Verified Advocates' },
  { value: '10K+', label: 'Cases Resolved' },
  { value: '4.8★', label: 'Average Rating' },
  { value: '24/7', label: 'AI Assistance' },
]

const categories = [
  { name: 'Criminal', icon: '⚖' },
  { name: 'Civil', icon: '🏛' },
  { name: 'Corporate', icon: '🏢' },
  { name: 'Family', icon: '👨‍👩‍👧' },
  { name: 'Labour', icon: '👷' },
  { name: 'Immigration', icon: '✈️' },
  { name: 'Intellectual Property', icon: '💡' },
  { name: 'Public Interest', icon: '🌱' },
]

const steps = [
  {
    title: 'Describe Your Issue',
    desc: 'Chat with our AI legal assistant. It understands your situation and suggests what kind of legal help you need.',
  },
  {
    title: 'Browse & Choose',
    desc: 'Explore verified advocate profiles with ratings, experience, fees, and specializations. Filter to find the perfect match.',
  },
  {
    title: 'Consult & Resolve',
    desc: 'Book a paid or pro bono consultation via chat or video. Get actionable legal advice and track your case.',
  },
]
</script>

<style scoped>
.home { overflow-x: hidden; }

/* Hero */
.hero {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  padding-top: 70px;
}
.hero-bg {
  position: absolute; inset: 0;
  overflow: hidden;
  pointer-events: none;
}
.hero-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.12;
}
.orb-1 {
  width: 600px; height: 600px;
  background: var(--gold);
  top: -200px; right: -100px;
}
.orb-2 {
  width: 400px; height: 400px;
  background: #3a5a8c;
  bottom: 0; left: -100px;
}
.noise {
  position: absolute; inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
  opacity: 0.3;
}

.hero-content {
  position: relative;
  z-index: 1;
  padding-top: 60px;
  padding-bottom: 80px;
  max-width: 780px;
}

.hero-eyebrow {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.82rem;
  color: var(--mist);
  letter-spacing: 0.04em;
  margin-bottom: 28px;
  animation: fadeUp 0.6s both;
}
.dot {
  width: 6px; height: 6px;
  background: var(--gold);
  border-radius: 50%;
}

.hero-title {
  font-size: clamp(2.8rem, 6vw, 5rem);
  font-weight: 900;
  line-height: 1.1;
  color: var(--parchment);
  margin-bottom: 24px;
  animation: fadeUp 0.6s 0.1s both;
}
.hero-title em {
  font-style: italic;
  color: var(--gold);
  display: block;
}

.hero-desc {
  font-size: 1.1rem;
  line-height: 1.7;
  color: var(--mist);
  max-width: 560px;
  margin-bottom: 36px;
  animation: fadeUp 0.6s 0.2s both;
}

.hero-actions {
  display: flex;
  gap: 14px;
  flex-wrap: wrap;
  margin-bottom: 56px;
  animation: fadeUp 0.6s 0.3s both;
}

.hero-stats {
  display: flex;
  gap: 40px;
  flex-wrap: wrap;
  animation: fadeUp 0.6s 0.4s both;
}
.stat-val {
  font-family: var(--font-display);
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--gold);
}
.stat-label { font-size: 0.8rem; color: var(--mist); margin-top: 2px; }

/* Sections */
.section {
  padding: 96px 0;
}
.section-alt {
  background: var(--ink-80);
}
.section-header {
  text-align: center;
  margin-bottom: 52px;
}
.section-title {
  font-size: 2.2rem;
  font-weight: 700;
  color: var(--parchment);
  margin-bottom: 10px;
}
.section-sub { color: var(--mist); font-size: 1rem; }

/* Categories */
.categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 16px;
}
.cat-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 28px 16px;
  background: var(--ink-80);
  border: 1px solid var(--ink-40);
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: all 0.3s var(--ease-out);
  text-decoration: none;
  color: inherit;
}
.cat-card:hover {
  border-color: rgba(201,146,42,0.4);
  background: var(--ink-60);
  transform: translateY(-3px);
}
.cat-icon { font-size: 1.8rem; }
.cat-name { font-size: 0.82rem; font-weight: 500; text-align: center; color: var(--mist); }
.cat-card:hover .cat-name { color: var(--parchment); }

/* Steps */
.steps-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 32px;
}
.step {
  padding: 36px;
  background: var(--ink);
  border: 1px solid var(--ink-40);
  border-radius: var(--radius-lg);
  position: relative;
}
.step-num {
  font-family: var(--font-display);
  font-size: 3.5rem;
  font-weight: 900;
  color: rgba(201,146,42,0.12);
  line-height: 1;
  margin-bottom: 16px;
}
.step-title {
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--parchment);
  margin-bottom: 10px;
}
.step-desc { font-size: 0.9rem; color: var(--mist); line-height: 1.65; }

/* SDG */
.sdg-section { padding: 80px 0; }
.sdg-card {
  background: linear-gradient(135deg, var(--ink-80), var(--ink-60));
  border: 1px solid rgba(201,146,42,0.2);
  border-radius: var(--radius-xl);
  padding: 56px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 40px;
  flex-wrap: wrap;
}
.sdg-content { flex: 1; min-width: 280px; }
.sdg-badges { display: flex; gap: 10px; margin-bottom: 20px; }
.sdg-badge {
  font-size: 0.72rem; font-weight: 700; letter-spacing: 0.06em;
  padding: 4px 12px; border-radius: 999px;
}
.sdg-16 { background: rgba(0,100,149,0.2); color: #5bb5e0; border: 1px solid rgba(0,100,149,0.4); }
.sdg-8  { background: rgba(162,25,66,0.2); color: #e07090; border: 1px solid rgba(162,25,66,0.4); }
.sdg-4  { background: rgba(197,40,54,0.2); color: #e08088; border: 1px solid rgba(197,40,54,0.4); }

.sdg-title { font-size: 1.7rem; font-weight: 700; color: var(--parchment); margin-bottom: 14px; }
.sdg-desc { font-size: 0.9rem; color: var(--mist); line-height: 1.7; }

.sdg-icons { display: flex; gap: 16px; }
.sdg-circle {
  width: 72px; height: 72px;
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: 1.6rem; font-weight: 900;
  font-family: var(--font-display);
}
.c16 { background: rgba(0,100,149,0.2); color: #5bb5e0; border: 2px solid rgba(0,100,149,0.4); }
.c8  { background: rgba(162,25,66,0.2); color: #e07090; border: 2px solid rgba(162,25,66,0.4); }
.c4  { background: rgba(197,40,54,0.2); color: #e08088; border: 2px solid rgba(197,40,54,0.4); }

/* CTA */
.cta-section {
  padding: 100px 0;
  background: linear-gradient(180deg, var(--ink) 0%, var(--ink-80) 100%);
}
.cta-content { text-align: center; }
.cta-title { font-size: 2.8rem; font-weight: 900; color: var(--parchment); margin-bottom: 14px; }
.cta-sub { font-size: 1rem; color: var(--mist); margin-bottom: 36px; }
</style>
