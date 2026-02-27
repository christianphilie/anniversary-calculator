<template>
  <!-- Milestones Section -->
  <Card data-panel-shell>
    <CardHeader
      data-panel-header
      class="sticky top-[var(--sticky-panel-header-top)] z-20 h-12 rounded-t-[calc(var(--radius-lg)-1px)] flex flex-row items-center justify-between gap-3 space-y-0 border-b border-border bg-card/95 px-4 py-2 backdrop-blur supports-[backdrop-filter]:bg-card/80"
    >
      <div class="inline-flex min-w-0 items-center gap-2">
        <BarChart3 class="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
        <span class="text-sm font-semibold tracking-tight text-foreground">{{ t('export.milestonesTitle') }}</span>
        <Badge
          variant="outline"
          class="h-5 min-w-5 rounded-full px-1.5 text-[11px] tabular-nums text-muted-foreground"
        >
          {{ state.eventsView.length }}
        </Badge>
      </div>
      <Button
        variant="ghost"
        size="sm"
        class="-mt-0.5 h-8 text-muted-foreground/80 hover:text-foreground"
        :title="t('form.goToToday')"
        :aria-label="t('form.goToToday')"
        :disabled="!state.eventsView.length"
        @click="jumpToToday"
      >
        <CalendarFold />
        Heute
      </Button>
    </CardHeader>
    <div class="year-navigation-sticky" v-if="!isLoading && state.eventsView.length">
      <YearNavigation />
    </div>
    <CardContent class="p-4">
      <div
        v-if="isLoading"
        class="grid min-h-32 place-items-center gap-2 rounded-md border border-dashed border-border bg-muted/70 px-4 py-6 text-center text-sm text-muted-foreground"
        role="status"
        aria-live="polite"
        aria-busy="true"
      >
        <div class="inline-flex items-center gap-2">
          <LoaderCircle class="h-4 w-4 animate-spin" aria-hidden="true" />
          <span>{{ t('results.loading') }}</span>
        </div>
      </div>
      <div
        v-else-if="!state.eventsView.length"
        class="grid min-h-32 place-items-center rounded-md border border-dashed border-border bg-muted/70 px-4 py-6 text-center text-sm text-muted-foreground"
        role="status"
        aria-live="polite"
      >
        {{ t('results.empty') }}
      </div>
      <div v-else>
        <div class="space-y-2" role="list" aria-label="Jubiläen">
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
    </CardContent>
  </Card>
</template>

<script setup lang="ts">
import { computed, nextTick } from 'vue'
import { BarChart3, CalendarFold, LoaderCircle } from 'lucide-vue-next'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { useAppState } from '../composables/useAppState'
import { useI18n } from '../i18n'
import { CONFIG } from '../types'
import { scrollElementBelowStickyHeaders } from '../utils/sticky'
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

const availableYears = computed(() => {
  const years = new Set<number>()
  state.value.eventsView.forEach((ev) => {
    years.add(ev.date.getFullYear())
  })
  return Array.from(years).sort((a, b) => a - b)
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

function jumpToToday(): void {
  if (!availableYears.value.length) return

  const todayYear = new Date().getFullYear()
  const targetYear = availableYears.value.includes(todayYear)
    ? todayYear
    : availableYears.value.reduce((closest, year) => {
      return Math.abs(year - todayYear) < Math.abs(closest - todayYear) ? year : closest
    }, availableYears.value[0])

  handleJumpToYear(targetYear)
}

/**
 * Scrolls to a specific year in the results list
 * @param year - The year to scroll to
 */
function handleJumpToYear(year: number): void {
  // Wait for next tick to ensure DOM is ready
  nextTick(() => {
    const element = document.getElementById(`y-${year}`) as HTMLElement | null
    if (!element) {
      console.warn(`Year separator not found: y-${year}`)
      return
    }
    scrollElementBelowStickyHeaders(element)
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
  return year !== undefined && year === availableYears.value[0]
}

/**
 * Checks if the separator at the given index is the last separator for its year
 * @param index - The index in the events array
 * @returns True if this is the last separator for the year
 */
function isLastYearSeparator(index: number): boolean {
  const year = state.value.eventsView[index]?.date.getFullYear()
  return year !== undefined && year === availableYears.value[availableYears.value.length - 1]
}
</script>
