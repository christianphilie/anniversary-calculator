import { ref, computed, provide, inject, watch } from 'vue'
import type { Ref, ComputedRef } from 'vue'
import type { AppState, Unit, Patterns, MilestoneEvent } from '../types'
import { computeRangeWindow } from '../utils/compute'
import { useError } from './useError'
import { useI18n } from '../i18n'

const APP_STATE_KEY = Symbol('appState')

/**
 * Composable interface for application state management.
 * Provides reactive state, loading indicators, and methods for computing and managing milestones.
 */
interface AppStateComposable {
  /** Reactive application state containing milestones, selections, and configuration */
  state: Ref<AppState>
  /** Loading state indicator for async operations */
  isLoading: Ref<boolean>
  /** Computed array of currently selected visible milestones */
  visibleSelected: ComputedRef<MilestoneEvent[]>
  /**
   * Recomputes milestones based on input parameters.
   * @param start - The starting date for milestone calculations
   * @param label - Label/title for the milestones
   * @param units - Array of units to calculate (years, months, weeks, etc.)
   * @param patterns - Pattern options (rounded, repdigit)
   * @param yearFrom - Start year for the calculation window
   * @param yearTo - End year for the calculation window
   */
  recompute: (start: Date, label: string, units: Unit[], patterns: Patterns, yearFrom: number, yearTo: number) => Promise<void>
  /** Selects all visible milestones */
  selectAll: () => void
  /** Deselects all visible milestones */
  selectNone: () => void
  /**
   * Toggles the selection state of a specific milestone.
   * @param id - The ID of the milestone to toggle
   */
  toggleSelection: (id: string) => void
  /**
   * Selects or deselects all milestones for a specific year.
   * @param year - The year to select/deselect
   * @param select - Whether to select (true) or deselect (false)
   */
  selectYear: (year: number, select: boolean) => void
  /** Resets the application state to initial values */
  reset: () => void
}

/**
 * Creates a new application state instance.
 * This function is called internally by provideAppState() and useAppState().
 * @returns AppStateComposable instance with reactive state and methods
 */
function createAppState(): AppStateComposable {
  const { handleError } = useError()
  const { locale, t } = useI18n()
  
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
  let recomputeAbortController: AbortController | null = null

  const visibleSelected: ComputedRef<MilestoneEvent[]> = computed(() => {
    const visSet = new Set(state.value.eventsView.map(ev => ev.id))
    return state.value.eventsAll.filter(
      ev => visSet.has(ev.id) && state.value.selected.has(ev.id)
    )
  })

  async function recompute(
    start: Date,
    label: string,
    units: Unit[],
    patterns: Patterns,
    yearFrom: number,
    yearTo: number
  ): Promise<void> {
    // Cancel previous recompute if still running
    if (recomputeAbortController) {
      recomputeAbortController.abort()
    }
    recomputeAbortController = new AbortController()
    const signal = recomputeAbortController.signal

    isLoading.value = true

    try {
      // Validate inputs
      if (isNaN(start.getTime())) {
        throw new Error(t.value('errors.invalidDate'))
      }

      if (yearFrom > yearTo) {
        throw new Error(t.value('validation.yearToBeforeFrom'))
      }

      state.value.start = start
      state.value.label = label
      state.value.units = units
      state.value.patterns = patterns
      state.value.yearFrom = yearFrom
      state.value.yearTo = yearTo

      const fromDate = new Date(yearFrom, 0, 1, 0, 0, 0)
      const toDate = new Date(yearTo, 11, 31, 23, 59, 59)

      if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
        throw new Error(t.value('errors.invalidYearRange'))
      }

      // Check if operation was cancelled
      if (signal.aborted) {
        return
      }

      const events = computeRangeWindow(
        start,
        { label, units, patterns, locale: locale.value },
        fromDate,
        toDate
      )

      // Check again if operation was cancelled before updating state
      if (signal.aborted) {
        return
      }

      state.value.eventsAll = events
      state.value.eventsView = events
    } catch (err) {
      // Don't handle AbortError as an error
      if (err instanceof Error && err.name === 'AbortError') {
        return
      }
      handleError(err, t.value('errors.computeError'))
      // Keep previous state on error
    } finally {
      isLoading.value = false
      recomputeAbortController = null
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

  // Recompute events when locale changes to update humanDiff strings
  watch(locale, () => {
    if (state.value.start && state.value.yearFrom !== null && state.value.yearTo !== null) {
      recompute(
        state.value.start,
        state.value.label,
        state.value.units,
        state.value.patterns,
        state.value.yearFrom,
        state.value.yearTo
      )
    }
  })

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

/**
 * Composable hook for accessing application state.
 * Use this in components to access and modify the global application state.
 * 
 * @returns AppStateComposable instance with state and methods
 * @example
 * ```typescript
 * const { state, recompute, selectAll } = useAppState()
 * await recompute(startDate, 'Birthday', ['years'], { rounded: true }, 2020, 2030)
 * ```
 */
export function useAppState(): AppStateComposable {
  // Try to inject first (if provided by parent)
  const injected = inject<AppStateComposable | undefined>(APP_STATE_KEY)
  if (injected) {
    return injected
  }

  // Otherwise create new instance (fallback for testing)
  return createAppState()
}

/**
 * Provides application state to the component tree.
 * Call this once in the root component (App.vue) to make state available to all child components.
 * 
 * @returns AppStateComposable instance
 * @example
 * ```typescript
 * // In App.vue
 * provideAppState()
 * ```
 */
export function provideAppState(): AppStateComposable {
  const appState = createAppState()
  provide(APP_STATE_KEY, appState)
  return appState
}
