<template>
  <!-- Milestones Section -->
  <section class="panel">
    <div class="hd">
      <strong>📊 {{ t('export.milestonesTitle') }}</strong>
      <span class="milestones-count">{{ state.eventsView.length }}</span>
    </div>
    <div class="year-navigation-sticky" v-if="!isLoading && state.eventsView.length">
      <YearNavigation />
    </div>
    <div class="bd">
      <div v-if="isLoading" class="empty" role="status" aria-live="polite" aria-busy="true">
        <div class="loading" aria-hidden="true"></div> {{ t('results.loading') }}
      </div>
      <div v-else-if="!state.eventsView.length" class="empty" role="status" aria-live="polite">
        {{ t('results.empty') }}
      </div>
      <div v-else>
        <div class="list" role="list" aria-label="Jubiläen">
        <template v-for="(ev, idx) in state.eventsView" :key="ev.id">
          <YearSeparator
            v-if="shouldShowYearSeparator(idx, ev.date.getFullYear())"
            :year="ev.date.getFullYear()"
            :is-first="isFirstYearSeparator(idx)"
            :is-last="isLastYearSeparator(idx)"
            @jump-to-year="handleJumpToYear"
            @add-previous-years="addPreviousYears"
            @add-next-years="addNextYears"
          />
          <MilestoneItem
            :event="ev"
          />
        </template>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAppState } from '../composables/useAppState'
import { useI18n } from '../i18n'
import YearSeparator from './YearSeparator.vue'
import MilestoneItem from './MilestoneItem.vue'
import YearNavigation from './YearNavigation.vue'

const { state, isLoading, recompute } = useAppState()
const { t } = useI18n()

const startYear = computed(() => {
  if (!state.value.start) return new Date().getFullYear()
  return state.value.start.getFullYear()
})

function addPreviousYears(): void {
  if (!state.value.yearFrom || !state.value.start) return
  const currentYear = new Date().getFullYear()
  const dateYear = startYear.value
  const minPossibleYear = Math.min(dateYear, currentYear)
  // Add up to 10 years, but stop at minimum
  const yearsToAdd = Math.min(10, state.value.yearFrom - minPossibleYear)
  const newYearFrom = Math.max(state.value.yearFrom - yearsToAdd, minPossibleYear)
  // Trigger recompute with new year range
  recompute(
    state.value.start,
    state.value.label,
    state.value.units,
    state.value.patterns,
    newYearFrom,
    state.value.yearTo || currentYear + 100
  )
}

function addNextYears(): void {
  if (!state.value.yearTo || !state.value.start) return
  const currentYear = new Date().getFullYear()
  const maxYearTo = currentYear + 100
  // Add up to 10 years, but stop at maximum
  const yearsToAdd = Math.min(10, maxYearTo - state.value.yearTo)
  const newYearTo = Math.min(state.value.yearTo + yearsToAdd, maxYearTo)
  // Trigger recompute with new year range
  recompute(
    state.value.start,
    state.value.label,
    state.value.units,
    state.value.patterns,
    state.value.yearFrom || currentYear,
    newYearTo
  )
}

function handleJumpToYear(year: number): void {
  const element = document.getElementById(`y-${year}`)
  if (element) {
    // Calculate total height of sticky elements:
    // - App Header (sticky at top:0): ~100px
    // - Panel Header (sticky at top:100px): 52px
    // - Year Navigation (sticky at top:152px): 40px
    // Total: 192px on desktop, 92px on mobile (header not sticky)
    const isMobile = window.innerWidth <= 768
    const headerOffset = isMobile ? 92 : 192
    
    const elementPosition = element.getBoundingClientRect().top + window.pageYOffset
    const offsetPosition = elementPosition - headerOffset
    
    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    })
  }
}

function shouldShowYearSeparator(index: number, year: number): boolean {
  if (index === 0) return true
  const prevYear = state.value.eventsView[index - 1]?.date.getFullYear()
  return prevYear !== year
}

function isFirstYearSeparator(index: number): boolean {
  // Check if this is the first year separator that will be shown
  if (index === 0) return true
  // Find the first index where a year separator is shown
  for (let i = 0; i < state.value.eventsView.length; i++) {
    if (shouldShowYearSeparator(i, state.value.eventsView[i]?.date.getFullYear())) {
      return i === index
    }
  }
  return false
}

function isLastYearSeparator(index: number): boolean {
  // Find the last index where a year separator is shown
  let lastSeparatorIndex = -1
  for (let i = state.value.eventsView.length - 1; i >= 0; i--) {
    if (shouldShowYearSeparator(i, state.value.eventsView[i]?.date.getFullYear())) {
      lastSeparatorIndex = i
      break
    }
  }
  return lastSeparatorIndex === index
}
</script>
