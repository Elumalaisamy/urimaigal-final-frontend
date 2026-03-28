<template>
  <router-link :to="`/lawyers/${lawyer.id}`" class="lawyer-card">
    <div class="card-top">
      <img :src="lawyer.avatar" :alt="lawyer.name" class="avatar" />
      <div class="badge-wrap">
        <span v-if="lawyer.badge" class="badge" :class="badgeClass">{{ lawyer.badge }}</span>
        <span class="avail-dot" :class="{ available: lawyer.available }" :title="lawyer.available ? 'Available' : 'Busy'"></span>
      </div>
    </div>

    <div class="card-body">
      <div class="specialization tag">{{ lawyer.specialization }}</div>
      <h3 class="lawyer-name">{{ lawyer.name }}</h3>
      <div class="lawyer-meta">
        <span>📍 {{ lawyer.location }}</span>
        <span>{{ lawyer.experience }} yrs exp</span>
      </div>
      <div class="lawyer-langs">
        <span v-for="lang in lawyer.languages.slice(0, 2)" :key="lang" class="lang-chip">{{ lang }}</span>
        <span v-if="lawyer.languages.length > 2" class="lang-chip muted">+{{ lawyer.languages.length - 2 }}</span>
      </div>
    </div>

    <div class="card-footer">
      <div class="rating">
        <span class="stars">★</span>
        <span class="rating-val">{{ lawyer.rating }}</span>
        <span class="review-count">({{ lawyer.reviewCount }})</span>
      </div>
      <div class="fee">
        <span v-if="lawyer.consultationFee === 0" class="free-tag">Free</span>
        <span v-else>₹{{ lawyer.consultationFee.toLocaleString('en-IN') }}</span>
        <span class="fee-unit">/consult</span>
      </div>
    </div>
  </router-link>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Lawyer } from '@/types'

const props = defineProps<{ lawyer: Lawyer }>()

const badgeClass = computed(() => ({
  'badge-gold': props.lawyer.badge === 'Top Rated',
  'badge-sage': props.lawyer.badge === 'Rising Star',
  'badge-mist': props.lawyer.badge === 'Pro Bono',
}))
</script>

<style scoped>
.lawyer-card {
  display: flex;
  flex-direction: column;
  background: var(--ink-80);
  border: 1px solid var(--ink-40);
  border-radius: var(--radius-lg);
  overflow: hidden;
  transition: all 0.3s var(--ease-out);
  cursor: pointer;
  text-decoration: none;
  color: inherit;
}
.lawyer-card:hover {
  border-color: rgba(201,146,42,0.35);
  transform: translateY(-4px);
  box-shadow: 0 16px 40px rgba(0,0,0,0.4), 0 0 0 1px rgba(201,146,42,0.2);
}

.card-top {
  position: relative;
  padding: 28px 24px 0;
}
.avatar {
  width: 72px; height: 72px;
  border-radius: 50%;
  background: var(--ink-60);
  object-fit: cover;
  border: 3px solid var(--ink-40);
}
.badge-wrap {
  position: absolute;
  top: 20px; right: 20px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8px;
}
.badge {
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  padding: 3px 10px;
  border-radius: 999px;
}
.badge-gold { background: rgba(201,146,42,0.15); color: var(--gold); border: 1px solid rgba(201,146,42,0.3); }
.badge-sage { background: rgba(74,124,111,0.15); color: #6bbfa9; border: 1px solid rgba(74,124,111,0.3); }
.badge-mist { background: rgba(139,150,168,0.15); color: var(--mist); border: 1px solid rgba(139,150,168,0.3); }

.avail-dot {
  width: 10px; height: 10px;
  border-radius: 50%;
  background: var(--ink-40);
  border: 2px solid var(--ink-80);
}
.avail-dot.available { background: #4caf7d; }

.card-body { padding: 16px 24px; flex: 1; }

.specialization {
  background: rgba(201,146,42,0.1);
  color: var(--gold);
  border: 1px solid rgba(201,146,42,0.2);
  font-size: 0.72rem;
  letter-spacing: 0.06em;
  margin-bottom: 8px;
}

.lawyer-name {
  font-family: var(--font-display);
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--parchment);
  margin-bottom: 6px;
}

.lawyer-meta {
  display: flex;
  gap: 14px;
  font-size: 0.8rem;
  color: var(--mist);
  margin-bottom: 10px;
}

.lawyer-langs {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}
.lang-chip {
  font-size: 0.72rem;
  padding: 3px 9px;
  background: var(--ink-60);
  border-radius: 999px;
  color: var(--mist);
}
.lang-chip.muted { color: var(--ink-40); }

.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 24px;
  border-top: 1px solid var(--ink-40);
}

.rating {
  display: flex;
  align-items: center;
  gap: 5px;
}
.stars { color: var(--gold); font-size: 1rem; }
.rating-val { font-weight: 600; font-size: 0.9rem; }
.review-count { font-size: 0.78rem; color: var(--mist); }

.fee { text-align: right; font-size: 0.95rem; font-weight: 600; color: var(--parchment); }
.fee-unit { font-size: 0.75rem; font-weight: 400; color: var(--mist); margin-left: 2px; }
.free-tag { color: #4caf7d; }
</style>
