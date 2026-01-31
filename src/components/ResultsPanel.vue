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
import { computed, nextTick } from 'vue'
import { useAppState } from '../composables/useAppState'
import { useI18n } from '../i18n'
import { CONFIG } from '../types'
import YearSeparator from './YearSeparator.vue'
import MilestoneItem from './MilestoneItem.vue'
import YearNavigation from './YearNavigation.vue'

const { state, isLoading, recompute } = useAppState()
const { t } = useI18n()

// Cache current year to avoid multiple Date object creations
const currentYear = computed(() => new Date().getFullYear())

const startYear = computed(() => {
  if (!state.value.start) return currentYear.value
  return state.value.start.getFullYear()
})

// Optimized year separator info: calculate once and cache
const yearSeparatorInfo = computed(() => {
  const info = new Map<number, { first: number; last: number }>()
  state.value.eventsView.forEach((ev, idx) => {
    const year = ev.date.getFullYear()
    if (!info.has(year)) {
      info.set(year, { first: idx, last: idx })
    } else {
      const existing = info.get(year)!
      existing.last = idx
    }
  })
  return info
})

/**
 * Expands the year range backwards by up to CONFIG.YEARS_TO_ADD_ON_EXPAND years
 */
function addPreviousYears(): void {
  if (!state.value.yearFrom || !state.value.start) return
  const dateYear = startYear.value
  const minPossibleYear = Math.min(dateYear, currentYear.value)
  // Add up to CONFIG.YEARS_TO_ADD_ON_EXPAND years, but stop at minimum
  const yearsToAdd = Math.min(CONFIG.YEARS_TO_ADD_ON_EXPAND, state.value.yearFrom - minPossibleYear)
  const newYearFrom = Math.max(state.value.yearFrom - yearsToAdd, minPossibleYear)
  // Trigger recompute with new year range
  recompute(
    state.value.start,
    state.value.label,
    state.value.units,
    state.value.patterns,
    newYearFrom,
    state.value.yearTo || currentYear.value + CONFIG.MAX_YEARS_IN_FUTURE
  )
}

/**
 * Expands the year range forwards by up to CONFIG.YEARS_TO_ADD_ON_EXPAND years
 */
function addNextYears(): void {
  if (!state.value.yearTo || !state.value.start) return
  const maxYearTo = currentYear.value + CONFIG.MAX_YEARS_IN_FUTURE
  // Add up to CONFIG.YEARS_TO_ADD_ON_EXPAND years, but stop at maximum
  const yearsToAdd = Math.min(CONFIG.YEARS_TO_ADD_ON_EXPAND, maxYearTo - state.value.yearTo)
  const newYearTo = Math.min(state.value.yearTo + yearsToAdd, maxYearTo)
  // Trigger recompute with new year range
  recompute(
    state.value.start,
    state.value.label,
    state.value.units,
    state.value.patterns,
    state.value.yearFrom || currentYear.value,
    newYearTo
  )
}

/**
 * Scrolls to a specific year in the results list
 * @param year - The year to scroll to
 */
function handleJumpToYear(year: number): void {
  // Wait for next tick to ensure DOM is ready
  nextTick(() => {
    const element = document.getElementById(`y-${year}`)
    if (!element) {
      console.warn(`Year separator not found: y-${year}`)
      return
    }
    
    // Calculate total height of sticky elements
    const isMobile = window.innerWidth <= 768
    const headerOffset = isMobile ? 92 : 192
    
    // Use scrollIntoView with block: 'start' and then adjust for header offset
    // Temporarily set scroll-margin-top to account for sticky headers
    const originalScrollMarginTop = (element as HTMLElement).style.scrollMarginTop
    ;(element as HTMLElement).style.scrollMarginTop = `${headerOffset}px`
    
    // Use requestAnimationFrame to ensure scroll-margin-top is applied before scrollIntoView
    requestAnimationFrame(() => {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
      
      // Restore original scroll-margin-top after scroll starts
      setTimeout(() => {
        ;(element as HTMLElement).style.scrollMarginTop = originalScrollMarginTop
      }, 200)
    })
  })
}

/**
 * Determines if a year separator should be shown at the given index
 * @param index - The index in the events array
 * @param year - The year of the current event
 * @returns True if separator should be shown
 */
function shouldShowYearSeparator(index: number, year: number): boolean {
  if (index === 0) return true
  const prevYear = state.value.eventsView[index - 1]?.date.getFullYear()
  return prevYear !== year
}

/**
 * Checks if the separator at the given index is the first separator for its year
 * @param index - The index in the events array
 * @returns True if this is the first separator for the year
 */
function isFirstYearSeparator(index: number): boolean {
  if (index === 0) return true
  const year = state.value.eventsView[index]?.date.getFullYear()
  if (year === undefined) return false
  const info = yearSeparatorInfo.value.get(year)
  return info?.first === index
}

/**
 * Checks if the separator at the given index is the last separator for its year
 * @param index - The index in the events array
 * @returns True if this is the last separator for the year
 */
function isLastYearSeparator(index: number): boolean {
  const year = state.value.eventsView[index]?.date.getFullYear()
  if (year === undefined) return false
  const info = yearSeparatorInfo.value.get(year)
  return info?.last === index
}
</script>
