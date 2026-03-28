<template>
  <main class="lawyers-page">
    <div class="page-header">
      <div class="container">
        <h1 class="page-title">Find Your Advocate</h1>
        <p class="page-sub">Browse verified legal professionals across Tamil Nadu</p>

        <!-- Search bar -->
        <div class="search-bar">
          <span class="search-icon">🔍</span>
          <input
            v-model="searchInput"
            type="text"
            placeholder="Search by name, specialization, or city..."
            class="search-input"
            @input="lawyers.setSearchQuery(searchInput)"
          />
          <button v-if="searchInput" class="search-clear" @click="searchInput = ''; lawyers.setSearchQuery('')">✕</button>
        </div>
      </div>
    </div>

    <div class="container lawyers-layout">
      <!-- Sidebar filters -->
      <aside class="filters-sidebar" :class="{ open: filtersOpen }">
        <div class="filters-header">
          <h3 class="filters-title">Filters</h3>
          <button class="reset-btn" @click="lawyers.resetFilters(); searchInput = ''">Reset All</button>
        </div>

        <!-- Category -->
        <div class="filter-group">
          <label class="filter-label">Area of Practice</label>
          <div class="filter-options">
            <button
              class="filter-chip"
              :class="{ active: lawyers.filters.category === 'All' }"
              @click="lawyers.setFilter('category', 'All')"
            >All</button>
            <button
              v-for="cat in lawyers.categories"
              :key="cat"
              class="filter-chip"
              :class="{ active: lawyers.filters.category === cat }"
              @click="lawyers.setFilter('category', cat)"
            >{{ cat }}</button>
          </div>
        </div>

        <!-- Min rating -->
        <div class="filter-group">
          <label class="filter-label">Min. Rating: {{ lawyers.filters.minRating > 0 ? lawyers.filters.minRating + '★' : 'Any' }}</label>
          <input
            type="range"
            min="0" max="5" step="0.5"
            :value="lawyers.filters.minRating"
            class="range-input"
            @input="lawyers.setFilter('minRating', Number(($event.target as HTMLInputElement).value))"
          />
          <div class="range-labels"><span>Any</span><span>5★</span></div>
        </div>

        <!-- Max fee -->
        <div class="filter-group">
          <label class="filter-label">Max Fee: ₹{{ lawyers.filters.maxFee.toLocaleString('en-IN') }}</label>
          <input
            type="range"
            min="0" max="5000" step="500"
            :value="lawyers.filters.maxFee"
            class="range-input"
            @input="lawyers.setFilter('maxFee', Number(($event.target as HTMLInputElement).value))"
          />
          <div class="range-labels"><span>Free</span><span>₹5,000</span></div>
        </div>

        <!-- Language -->
        <div class="filter-group">
          <label class="filter-label">Language</label>
          <div class="filter-options">
            <button
              v-for="lang in languages"
              :key="lang"
              class="filter-chip"
              :class="{ active: lawyers.filters.language === lang }"
              @click="lawyers.setFilter('language', lang)"
            >{{ lang }}</button>
          </div>
        </div>

        <!-- Available -->
        <div class="filter-group">
          <label class="toggle-label">
            <span>Available only</span>
            <div
              class="toggle"
              :class="{ on: lawyers.filters.available }"
              @click="lawyers.setFilter('available', !lawyers.filters.available)"
            >
              <div class="toggle-thumb"></div>
            </div>
          </label>
        </div>
      </aside>

      <!-- Main content -->
      <div class="lawyers-main">
        <div class="results-bar">
          <span class="results-count">
            {{ lawyers.filteredLawyers.length }} advocate{{ lawyers.filteredLawyers.length !== 1 ? 's' : '' }} found
          </span>
          <button class="filters-toggle" @click="filtersOpen = !filtersOpen">
            ⚙ Filters
          </button>
        </div>

        <div v-if="lawyers.filteredLawyers.length" class="lawyers-grid">
          <LawyerCard
            v-for="lawyer in lawyers.filteredLawyers"
            :key="lawyer.id"
            :lawyer="lawyer"
          />
        </div>

        <div v-else class="empty-state">
          <div class="empty-icon">⚖</div>
          <h3>No advocates found</h3>
          <p>Try adjusting your filters or search query.</p>
          <button class="btn-ghost" @click="lawyers.resetFilters(); searchInput = ''">Clear Filters</button>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useLawyersStore } from '@/stores/lawyers'
import type { LegalCategory } from '@/types'
import LawyerCard from '@/components/LawyerCard.vue'

const lawyers = useLawyersStore()
const route = useRoute()
const searchInput = ref(lawyers.searchQuery)
const filtersOpen = ref(false)

const languages = ['All', 'Tamil', 'English', 'Hindi', 'Telugu', 'Malayalam', 'French']

onMounted(() => {
  const cat = route.query.category as LegalCategory | undefined
  if (cat && lawyers.categories.includes(cat)) {
    lawyers.setFilter('category', cat)
  }
})
</script>

<style scoped>
.lawyers-page { padding-top: 70px; min-height: 100vh; }

.page-header {
  background: var(--ink-80);
  border-bottom: 1px solid var(--ink-40);
  padding: 48px 0 36px;
}
.page-title { font-size: 2.2rem; font-weight: 900; color: var(--parchment); margin-bottom: 6px; }
.page-sub { color: var(--mist); margin-bottom: 28px; }

.search-bar {
  display: flex;
  align-items: center;
  gap: 10px;
  background: var(--ink-60);
  border: 1px solid var(--ink-40);
  border-radius: var(--radius-lg);
  padding: 14px 20px;
  transition: border-color 0.2s;
  max-width: 680px;
}
.search-bar:focus-within { border-color: var(--gold); }
.search-icon { font-size: 1rem; color: var(--mist); flex-shrink: 0; }
.search-input {
  flex: 1; background: none; border: none; outline: none;
  color: var(--parchment); font-size: 0.95rem;
}
.search-input::placeholder { color: var(--mist); }
.search-clear {
  background: none; border: none; color: var(--mist);
  cursor: pointer; font-size: 0.9rem; transition: color 0.2s;
}
.search-clear:hover { color: var(--parchment); }

/* Layout */
.lawyers-layout {
  display: grid;
  grid-template-columns: 260px 1fr;
  gap: 32px;
  padding-top: 32px;
  padding-bottom: 64px;
  align-items: start;
}
@media (max-width: 900px) {
  .lawyers-layout { grid-template-columns: 1fr; }
}

/* Sidebar */
.filters-sidebar {
  background: var(--ink-80);
  border: 1px solid var(--ink-40);
  border-radius: var(--radius-lg);
  padding: 24px;
  position: sticky;
  top: 90px;
}
@media (max-width: 900px) {
  .filters-sidebar {
    display: none;
    position: static;
  }
  .filters-sidebar.open { display: block; }
}

.filters-header {
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 24px;
}
.filters-title { font-size: 1rem; font-weight: 600; color: var(--parchment); }
.reset-btn {
  background: none; border: none;
  color: var(--gold); font-size: 0.8rem; cursor: pointer;
}

.filter-group { margin-bottom: 24px; }
.filter-label {
  display: block;
  font-size: 0.8rem; color: var(--mist); font-weight: 500;
  letter-spacing: 0.04em; text-transform: uppercase;
  margin-bottom: 10px;
}
.filter-options { display: flex; flex-wrap: wrap; gap: 6px; }
.filter-chip {
  padding: 5px 12px;
  background: var(--ink-60);
  border: 1px solid var(--ink-40);
  border-radius: 999px;
  color: var(--mist);
  font-size: 0.78rem;
  cursor: pointer;
  transition: all 0.2s;
}
.filter-chip:hover { border-color: var(--gold); color: var(--gold); }
.filter-chip.active {
  background: rgba(201,146,42,0.12);
  border-color: var(--gold);
  color: var(--gold);
}

.range-input {
  width: 100%;
  accent-color: var(--gold);
  cursor: pointer;
  margin-bottom: 4px;
}
.range-labels {
  display: flex; justify-content: space-between;
  font-size: 0.75rem; color: var(--ink-20);
}

.toggle-label {
  display: flex; align-items: center; justify-content: space-between;
  cursor: pointer; font-size: 0.85rem; color: var(--mist);
}
.toggle {
  width: 44px; height: 24px;
  background: var(--ink-40);
  border-radius: 999px;
  position: relative;
  transition: background 0.2s;
  cursor: pointer;
}
.toggle.on { background: var(--gold); }
.toggle-thumb {
  position: absolute;
  top: 3px; left: 3px;
  width: 18px; height: 18px;
  background: var(--parchment);
  border-radius: 50%;
  transition: transform 0.2s;
}
.toggle.on .toggle-thumb { transform: translateX(20px); }

/* Main */
.results-bar {
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 20px;
}
.results-count { font-size: 0.85rem; color: var(--mist); }
.filters-toggle {
  display: none;
  background: var(--ink-80);
  border: 1px solid var(--ink-40);
  border-radius: var(--radius-sm);
  color: var(--mist);
  padding: 6px 14px;
  font-size: 0.82rem;
  cursor: pointer;
}
@media (max-width: 900px) { .filters-toggle { display: block; } }

.lawyers-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

.empty-state {
  text-align: center;
  padding: 80px 24px;
}
.empty-icon { font-size: 3rem; margin-bottom: 16px; opacity: 0.3; }
.empty-state h3 { font-size: 1.2rem; color: var(--parchment); margin-bottom: 8px; }
.empty-state p { color: var(--mist); margin-bottom: 24px; font-size: 0.9rem; }
</style>
