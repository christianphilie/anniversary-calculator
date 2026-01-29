import { ref, computed } from 'vue'
import type { Ref, ComputedRef } from 'vue'
import type { AppState, Unit, Patterns, MilestoneEvent } from '../types'
import { computeRangeWindow } from '../utils/compute'

export function useAppState() {
  const state: Ref<AppState> = ref({
    start: null,
    label: '',
    units: ['years', 'months', 'weeks', 'days', 'hours', 'minutes', 'seconds'],
    patterns: { rounded: true, repdigit: true },
    eventsAll: [],
    eventsView: [],
    selected: new Set<string>(),
    yearFrom: null,
    yearTo: null
  })

  const isLoading = ref(false)

  const visibleSelected: ComputedRef<MilestoneEvent[]> = computed(() => {
    const visSet = new Set(state.value.eventsView.map(ev => ev.id))
    return state.value.eventsAll.filter(
      ev => visSet.has(ev.id) && state.value.selected.has(ev.id)
    )
  })

  function recompute(
    start: Date,
    label: string,
    units: Unit[],
    patterns: Patterns,
    yearFrom: number,
    yearTo: number
  ): void {
    isLoading.value = true

    try {
      state.value.start = start
      state.value.label = label
      state.value.units = units
      state.value.patterns = patterns
      state.value.yearFrom = yearFrom
      state.value.yearTo = yearTo

      const fromDate = new Date(yearFrom, 0, 1, 0, 0, 0)
      const toDate = new Date(yearTo, 11, 31, 23, 59, 59)

      const events = computeRangeWindow(
        start,
        { label, units, patterns },
        fromDate,
        toDate
      )

      state.value.eventsAll = events
      state.value.eventsView = events
    } finally {
      isLoading.value = false
    }
  }

  function selectAll(): void {
    for (const ev of state.value.eventsView) {
      state.value.selected.add(ev.id)
    }
  }

  function selectNone(): void {
    for (const ev of state.value.eventsView) {
      state.value.selected.delete(ev.id)
    }
  }

  function toggleSelection(id: string): void {
    if (state.value.selected.has(id)) {
      state.value.selected.delete(id)
    } else {
      state.value.selected.add(id)
    }
  }

  function selectYear(year: number, select: boolean): void {
    const idsInYear = state.value.eventsView
      .filter(ev => ev.date.getFullYear() === year)
      .map(ev => ev.id)

    if (select) {
      idsInYear.forEach(id => state.value.selected.add(id))
    } else {
      idsInYear.forEach(id => state.value.selected.delete(id))
    }
  }

  function reset(): void {
    state.value.selected.clear()
    state.value.label = ''
    state.value.start = null
    state.value.eventsAll = []
    state.value.eventsView = []
  }

  return {
    state,
    isLoading,
    visibleSelected,
    recompute,
    selectAll,
    selectNone,
    toggleSelection,
    selectYear,
    reset
  }
}
