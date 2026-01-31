<template>
  <div class="year-sep" :id="`y-${year}`" role="separator" :aria-label="`${t('results.year')} ${year}`">
    <button
      v-if="isFirst && canAddPreviousYears"
      class="year-nav-btn year-nav-load-more"
      type="button"
      @click="$emit('add-previous-years')"
      :aria-label="t('form.loadMore')"
    >
      {{ t('form.loadMore') }}
    </button>
    <button
      v-else-if="hasPreviousYear"
      class="year-nav-btn"
      type="button"
      @click="$emit('jump-to-year', previousYear)"
      :aria-label="`${t('form.jumpToYear')}: ${previousYear}`"
    >
      ↑
    </button>
    <span v-else class="year-nav-placeholder"></span>
    <span class="y">{{ year }}</span>
    <button
      v-if="isLast && canAddNextYears"
      class="year-nav-btn year-nav-load-more"
      type="button"
      @click="$emit('add-next-years')"
      :aria-label="t('form.loadMore')"
    >
      {{ t('form.loadMore') }}
    </button>
    <button
      v-else-if="hasNextYear"
      class="year-nav-btn"
      @click="$emit('jump-to-year', nextYear)"
      :aria-label="`${t('form.jumpToYear')}: ${nextYear}`"
    >
      ↓
    </button>
    <span v-else class="year-nav-placeholder"></span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from '../i18n'
import { useAppState } from '../composables/useAppState'
import { CONFIG } from '../types'

const props = defineProps<{
  year: number
  isFirst?: boolean
  isLast?: boolean
}>()

defineEmits<{
  'jump-to-year': [year: number]
  'add-previous-years': []
  'add-next-years': []
}>()

const { t } = useI18n()
const { state } = useAppState()

const availableYears = computed(() => {
  const years = new Set<number>()
  state.value.eventsView.forEach(ev => {
    years.add(ev.date.getFullYear())
  })
  return Array.from(years).sort((a, b) => a - b)
})

const currentIndex = computed(() => {
  return availableYears.value.indexOf(props.year)
})

const hasPreviousYear = computed(() => {
  return currentIndex.value > 0
})

const hasNextYear = computed(() => {
  return currentIndex.value >= 0 && currentIndex.value < availableYears.value.length - 1
})

const previousYear = computed(() => {
  if (!hasPreviousYear.value) return props.year
  return availableYears.value[currentIndex.value - 1]
})

const nextYear = computed(() => {
  if (!hasNextYear.value) return props.year
  return availableYears.value[currentIndex.value + 1]
})

const startYear = computed(() => {
  if (!state.value.start) return new Date().getFullYear()
  return state.value.start.getFullYear()
})

const canAddPreviousYears = computed(() => {
  if (!state.value.yearFrom) return false
  const currentYear = new Date().getFullYear()
  const dateYear = startYear.value
  const minPossibleYear = Math.min(dateYear, currentYear)
  return state.value.yearFrom > minPossibleYear
})

const canAddNextYears = computed(() => {
  if (!state.value.yearTo) return false
  const currentYear = new Date().getFullYear()
  const maxYearTo = currentYear + CONFIG.MAX_YEARS_IN_FUTURE
  return state.value.yearTo < maxYearTo
})
</script>

<style scoped>
.year-sep {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-top: 24px;
  margin-bottom: 12px;
  padding: 16px 0;
  border-bottom: 1px solid var(--border);
}

.year-sep:first-child {
  margin-top: 0;
}

.year-sep .y {
  flex: 1;
  text-align: center;
  font-size: 16px;
  font-weight: 600;
  color: var(--muted);
  letter-spacing: 0.05em;
}

.year-nav-btn {
  background: transparent;
  border: 1px solid var(--border);
  color: var(--muted);
  border-radius: var(--radius);
  padding: 4px 8px;
  font-size: 12px;
  cursor: pointer;
  transition: var(--transition);
  min-width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.year-nav-btn:hover {
  background: var(--panel);
  border-color: var(--brand);
  color: var(--text);
}

.year-nav-btn:focus-visible {
  outline: none;
  box-shadow: var(--focus);
}

.year-nav-placeholder {
  min-width: 28px;
  flex-shrink: 0;
}

.year-nav-load-more {
  text-transform: uppercase;
}
</style>
