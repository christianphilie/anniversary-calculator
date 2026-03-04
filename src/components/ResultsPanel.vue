<template>
  <!-- Milestones Section -->
  <Card id="results-panel" data-panel-shell>
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
        {{ t('form.goToToday') }}
      </Button>
    </CardHeader>
    <div class="year-navigation-sticky" v-if="!isLoading && state.eventsView.length">
      <YearNavigation />
    </div>
    <CardContent class="p-4">
      <div
        v-if="state.start"
        class="relative mb-4 rounded-lg border border-primary/22 bg-linear-to-br from-primary/10 via-primary/4 to-transparent p-3"
      >
        <div class="flex items-center gap-2">
          <span class="text-sm font-semibold text-foreground">{{ t('results.currentValuesTitle') }}</span>
        </div>
        <div class="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
          <div
            v-for="item in currentValues"
            :key="item.unit"
            class="rounded-md border border-primary/15 bg-background/85 px-2.5 py-2"
          >
            <div class="text-sm font-semibold tabular-nums text-foreground">
              {{ formatNumber(item.value) }}
            </div>
            <div class="text-[11px] leading-tight text-muted-foreground">
              {{ getMetricLabel(item.unit, item.value) }}
            </div>
          </div>
        </div>
        <Badge
          variant="outline"
          class="live-badge-pulse absolute bottom-3 right-3 h-5 rounded-full px-2 text-[11px] text-primary"
        >
          {{ t('results.live') }}
        </Badge>
      </div>

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
import { computed, nextTick, onMounted, onUnmounted, ref } from 'vue'
import { BarChart3, CalendarFold, LoaderCircle } from 'lucide-vue-next'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { useAppState } from '../composables/useAppState'
import { useI18n } from '../i18n'
import { getNumberFormatter, getUnitLabel } from '../utils/i18n'
import { addMonths } from '../utils/date'
import { CONFIG } from '../types'
import type { Unit } from '../types'
import { scrollElementBelowStickyHeaders } from '../utils/sticky'
import YearSeparator from './YearSeparator.vue'
import MilestoneItem from './MilestoneItem.vue'
import YearNavigation from './YearNavigation.vue'

const { state, isLoading, recompute } = useAppState()
const { locale, t } = useI18n()
const now = ref(new Date())
let nowTimer: ReturnType<typeof setInterval> | null = null

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

const numberFormatter = computed(() => getNumberFormatter(locale.value))

const currentValues = computed((): Array<{ unit: Unit; value: number }> => {
  if (!state.value.start) return []

  const start = state.value.start
  const end = now.value
  const isPast = end >= start
  const from = isPast ? start : end
  const to = isPast ? end : start

  const diffMs = Math.max(0, to.getTime() - from.getTime())
  const seconds = Math.floor(diffMs / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  const weeks = Math.floor(days / 7)
  const months = getWholeMonthsBetween(from, to)
  const years = Math.floor(months / 12)

  return [
    { unit: 'years', value: years },
    { unit: 'months', value: months },
    { unit: 'weeks', value: weeks },
    { unit: 'days', value: days },
    { unit: 'hours', value: hours },
    { unit: 'minutes', value: minutes },
    { unit: 'seconds', value: seconds }
  ]
})

function getWholeMonthsBetween(from: Date, to: Date): number {
  let months = (to.getFullYear() - from.getFullYear()) * 12 + (to.getMonth() - from.getMonth())
  const anchor = addMonths(from, months)

  if (anchor.getTime() > to.getTime()) {
    months -= 1
  }

  return Math.max(0, months)
}

function getMetricLabel(unit: Unit, value: number): string {
  return getUnitLabel(unit, value, locale.value)
}

function formatNumber(value: number): string {
  return numberFormatter.value.format(value)
}

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

onMounted(() => {
  nowTimer = setInterval(() => {
    now.value = new Date()
  }, 1000)
})

onUnmounted(() => {
  if (nowTimer) {
    clearInterval(nowTimer)
    nowTimer = null
  }
})
</script>

<style scoped>
.live-badge-pulse {
  animation: live-badge-pulse 1s ease-in-out infinite;
}

@keyframes live-badge-pulse {
  0%,
  100% {
    background: color-mix(in srgb, var(--primary) 14%, transparent);
    border-color: color-mix(in srgb, var(--primary) 45%, var(--border) 55%);
    color: color-mix(in srgb, var(--primary) 88%, var(--foreground) 12%);
    transform: scale(1);
  }
  50% {
    background: color-mix(in srgb, var(--primary) 28%, transparent);
    border-color: color-mix(in srgb, var(--primary) 70%, var(--border) 30%);
    color: var(--primary);
    transform: scale(1.04);
  }
}
</style>
