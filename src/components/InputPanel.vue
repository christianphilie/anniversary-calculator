<template>
  <Card data-panel-shell>
    <CardHeader
      data-panel-header
      class="sticky top-[var(--sticky-panel-header-top)] z-20 h-12 flex flex-row items-center justify-between gap-3 space-y-0 border-b border-border bg-card/95 px-4 py-2 backdrop-blur supports-[backdrop-filter]:bg-card/80"
    >
      <div class="inline-flex min-w-0 items-center gap-2">
        <Target class="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
        <span class="text-sm font-semibold tracking-tight text-foreground">{{ t('ui.inputs') }}</span>
      </div>
      <Button
        variant="ghost"
        size="sm"
        class="h-8"
        :title="t('common.reset')"
        :aria-label="t('common.reset')"
        @click="handleReset"
      >
        <RotateCcw />
        {{ t('common.reset') }}
      </Button>
    </CardHeader>
    <CardContent class="min-w-0 overflow-x-hidden p-4">
      <ErrorAlert />
      <form class="min-w-0 space-y-4" @submit.prevent="handleSubmit">
        <div class="space-y-3">
          <div class="flex min-w-0 flex-col gap-3">
            <div class="space-y-2 min-w-0">
              <Label for="date">{{ t('form.date') }}</Label>
              <Input
                id="date"
                v-model="formData.date"
                type="date"
                class="min-w-0"
                @blur="handleDateBlur"
                :aria-invalid="fieldErrors.date ? 'true' : 'false'"
                :aria-describedby="fieldErrors.date ? 'date-error' : undefined"
              />
              <span v-if="fieldErrors.date" id="date-error" class="field-error" role="alert">
                {{ fieldErrors.date }}
              </span>
            </div>
            <div class="space-y-2 min-w-0">
              <Label for="time">{{ t('form.time') }}</Label>
              <Input
                id="time"
                v-model="formData.time"
                type="time"
                step="1"
                class="min-w-0"
                :aria-invalid="fieldErrors.time ? 'true' : 'false'"
                :aria-describedby="fieldErrors.time ? 'time-error' : undefined"
              />
              <span v-if="fieldErrors.time" id="time-error" class="field-error" role="alert">
                {{ fieldErrors.time }}
              </span>
            </div>
          </div>
        </div>

        <Separator />

        <div class="space-y-3">
          <div class="space-y-2">
            <Label for="label">{{ t('form.label') }}</Label>
            <Input
              id="label"
              v-model="formData.label"
              type="text"
              :placeholder="t('form.labelPlaceholder')"
              @blur="handleLabelBlur"
              :aria-invalid="fieldErrors.label ? 'true' : 'false'"
              :aria-describedby="fieldErrors.label ? 'label-error' : undefined"
            />
            <span v-if="fieldErrors.label" id="label-error" class="field-error" role="alert">
              {{ fieldErrors.label }}
            </span>
          </div>
        </div>

        <Separator />

        <div class="space-y-4">
          <div class="space-y-2">
            <Label>{{ t('form.yearRange') }}</Label>
            <div class="flex min-w-0 flex-col gap-3">
              <div class="space-y-2 min-w-0">
                <Label for="yearFrom" class="text-xs text-muted-foreground">{{ t('form.yearFrom') }}</Label>
                <Input
                  id="yearFrom"
                  v-model.number="formData.yearFrom"
                  type="number"
                  step="1"
                  class="min-w-0"
                  @blur="handleYearFromBlur"
                  @keydown.enter="handleYearFromBlur"
                  :aria-invalid="fieldErrors.yearRange ? 'true' : 'false'"
                  :aria-describedby="fieldErrors.yearRange ? 'year-range-error' : undefined"
                />
              </div>
              <div class="space-y-2 min-w-0">
                <Label for="yearTo" class="text-xs text-muted-foreground">{{ t('form.yearTo') }}</Label>
                <Input
                  id="yearTo"
                  v-model.number="formData.yearTo"
                  type="number"
                  step="1"
                  class="min-w-0"
                  @blur="handleYearToBlur"
                  @keydown.enter="handleYearToBlur"
                  :aria-invalid="fieldErrors.yearRange ? 'true' : 'false'"
                  :aria-describedby="fieldErrors.yearRange ? 'year-range-error' : undefined"
                />
                <span v-if="fieldErrors.yearRange" id="year-range-error" class="field-error" role="alert">
                  {{ fieldErrors.yearRange }}
                </span>
              </div>
            </div>
          </div>

          <div class="space-y-2">
            <Label>{{ t('form.units') }}</Label>
            <div class="grid gap-2">
              <div
                v-for="unit in units"
                :key="unit.value"
                :class="cn(
                  'flex items-center gap-3 rounded-lg border border-input border-l-4 bg-background px-3 py-2',
                  getUnitFilterRowClass(unit.value)
                )"
              >
                <Checkbox
                  :id="`unit-${unit.value}`"
                  :model-value="formData.units.includes(unit.value)"
                  @update:model-value="(checked) => toggleUnit(unit.value, checked)"
                />
                <Label
                  :for="`unit-${unit.value}`"
                  class="flex min-w-0 flex-1 items-center justify-between gap-3 leading-normal"
                >
                  <span class="truncate">{{ unit.label }}</span>
                  <Badge
                    v-if="getUnitCount(unit.value) > 0"
                    variant="outline"
                    :class="cn(
                      'h-5 min-w-5 rounded-full px-1.5 text-[11px] tabular-nums',
                      getUnitFilterCountClass(unit.value)
                    )"
                  >
                    {{ getUnitCount(unit.value) }}
                  </Badge>
                </Label>
              </div>
            </div>
            <span v-if="fieldErrors.units" class="field-error" role="alert">{{ fieldErrors.units }}</span>
          </div>

          <div class="space-y-2">
            <Label>{{ t('form.patterns') }}</Label>
            <div class="grid gap-2">
              <div class="flex items-start gap-3 rounded-lg border border-input bg-background px-3 py-2.5">
                <Checkbox id="pattern-rounded" v-model="formData.patterns.rounded" class="mt-0.5" />
                <Label
                  for="pattern-rounded"
                  class="flex min-w-0 flex-1 items-start justify-between gap-3 leading-normal"
                >
                  <span class="grid min-w-0 gap-0.5">
                    <span class="text-sm font-medium text-foreground">{{ t('form.roundedMultiples') }}</span>
                    <span class="text-xs text-muted-foreground">{{ t('form.roundedMultiplesExamples') }}</span>
                  </span>
                  <Badge
                    v-if="getPatternCount('rounded') > 0"
                    variant="secondary"
                    class="mt-0.5 h-5 min-w-5 rounded-full px-1.5 text-[11px] tabular-nums"
                  >
                    {{ getPatternCount('rounded') }}
                  </Badge>
                </Label>
              </div>
              <div class="flex items-start gap-3 rounded-lg border border-input bg-background px-3 py-2.5">
                <Checkbox id="pattern-repdigit" v-model="formData.patterns.repdigit" class="mt-0.5" />
                <Label
                  for="pattern-repdigit"
                  class="flex min-w-0 flex-1 items-start justify-between gap-3 leading-normal"
                >
                  <span class="grid min-w-0 gap-0.5">
                    <span class="text-sm font-medium text-foreground">{{ t('form.repdigits') }}</span>
                    <span class="text-xs text-muted-foreground">{{ t('form.repdigitsExamples') }}</span>
                  </span>
                  <Badge
                    v-if="getPatternCount('repdigit') > 0"
                    variant="secondary"
                    class="mt-0.5 h-5 min-w-5 rounded-full px-1.5 text-[11px] tabular-nums"
                  >
                    {{ getPatternCount('repdigit') }}
                  </Badge>
                </Label>
              </div>
            </div>
            <span v-if="fieldErrors.patterns" class="field-error" role="alert">{{ fieldErrors.patterns }}</span>
          </div>
        </div>
      </form>
    </CardContent>
  </Card>
</template>

<script setup lang="ts">
import { ref, watch, computed, onMounted, onUnmounted } from 'vue'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { RotateCcw, Target } from 'lucide-vue-next'
import type { Unit } from '../types'
import { CONFIG } from '../types'

// Constants for year range
const MAX_YEARS_IN_FUTURE = CONFIG.MAX_YEARS_IN_FUTURE
import { toLocalDateInputValue } from '../utils/date'
import { useUrlState } from '../composables/useUrlState'
import { useAppState } from '../composables/useAppState'
import { useError } from '../composables/useError'
import { useI18n } from '../i18n'
import ErrorAlert from './ErrorAlert.vue'
import {
  validateLabel,
  validateUnits,
  validatePatterns,
  validateYearRange,
  parseDate
} from '../utils/validation'
import { sanitizeLabel } from '../utils/sanitize'

const { state, recompute: recomputeState } = useAppState()
const { loadStateFromURL } = useUrlState(state)
const { setError, clearError } = useError()
const { t } = useI18n()

const fieldErrors = ref<{
  label?: string
  date?: string
  time?: string
  units?: string
  patterns?: string
  yearRange?: string
}>({})

// No emit needed - we use composable directly

const today = new Date()
const todayYear = today.getFullYear()

const formData = ref({
  label: '',
  date: toLocalDateInputValue(today),
  time: '12:00:00',
  units: ['years', 'months', 'weeks', 'days', 'hours', 'minutes', 'seconds'] as Unit[],
  patterns: { rounded: true, repdigit: true },
  yearFrom: todayYear,
  yearTo: todayYear + 50
})

const units = computed((): Array<{ value: Unit; label: string }> => [
  { value: 'years', label: t.value('units.years') },
  { value: 'months', label: t.value('units.months') },
  { value: 'weeks', label: t.value('units.weeks') },
  { value: 'days', label: t.value('units.days') },
  { value: 'hours', label: t.value('units.hours') },
  { value: 'minutes', label: t.value('units.minutes') },
  { value: 'seconds', label: t.value('units.seconds') }
])

const startYear = computed(() => {
  if (!formData.value.date) return new Date().getFullYear()
  return new Date(formData.value.date).getFullYear()
})

const currentYear = computed(() => new Date().getFullYear())
const yearFromMin = ref<number>(todayYear)
const yearToMax = ref<number>(todayYear + MAX_YEARS_IN_FUTURE)

// Min/Max years for input validation
// Min: Start year (date input) or current year, whichever is earlier (no going back before that)
// Max: Current year + 100 (reasonable future limit)
const minYear = computed(() => {
  const currYear = currentYear.value
  const dateYear = startYear.value
  // Allow from start date year or current year, whichever is earlier
  const minAllowed = Math.min(dateYear, currYear)
  // But also respect yearFromMin if it was expanded via buttons
  return Math.min(minAllowed, yearFromMin.value)
})

const maxYear = computed(() => {
  const currYear = currentYear.value
  // Max 100 years in the future, but also respect yearToMax if it was expanded
  return Math.max(currYear + 100, yearToMax.value)
})

// Trim label only on blur, not during typing
function handleLabelBlur(): void {
  const trimmed = formData.value.label.trim()
  if (trimmed !== formData.value.label) {
    formData.value.label = trimmed
    // Trigger recompute with trimmed value
    compute()
  }
}

// Handle date blur - validate and adjust year range
function handleDateBlur(): void {
  if (!formData.value.date) {
    // Clear errors if date is empty (user might still be typing)
    fieldErrors.value.date = undefined
    return
  }
  
  // Check if date is complete (YYYY-MM-DD format)
  const dateStr = formData.value.date
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    // Date is incomplete, don't validate yet
    return
  }
  
  // Validate date and adjust year range
  const dateYear = new Date(formData.value.date).getFullYear()
  const todayYear = new Date().getFullYear()
  const minAllowed = Math.min(dateYear, todayYear)
  const maxAllowed = todayYear + MAX_YEARS_IN_FUTURE
  
  // Always adjust yearFrom to be within valid range based on new date
  formData.value.yearFrom = minAllowed
  
  // Always adjust yearTo to be within valid range
  formData.value.yearTo = maxAllowed
  
  // Update min/max refs to reflect the new range
  yearFromMin.value = minAllowed
  yearToMax.value = maxAllowed
  
  // Trigger validation and recompute
  compute()
}

// Validate and correct year values only on blur - NO automatic adjustments during typing
function handleYearFromBlur(): void {
  const value = formData.value.yearFrom
  if (isNaN(value) || !isFinite(value)) {
    // Reset to valid value if invalid
    const dateYear = startYear.value
    const todayYear = currentYear.value
    formData.value.yearFrom = Math.min(dateYear, todayYear)
    compute()
    return
  }
  
  // Clamp to valid range
  const clamped = Math.max(minYear.value, Math.min(maxYear.value, value))
  
  if (clamped !== formData.value.yearFrom) {
    formData.value.yearFrom = clamped
  }
  
  // Ensure yearTo is not less than yearFrom
  if (formData.value.yearTo < formData.value.yearFrom) {
    formData.value.yearTo = formData.value.yearFrom
  }
  
  // Always trigger recompute when year range changes (even if value was already valid)
  compute()
}

function handleYearToBlur(): void {
  const value = formData.value.yearTo
  if (isNaN(value) || !isFinite(value)) {
    // Reset to valid value if invalid
    const todayYear = currentYear.value
    formData.value.yearTo = todayYear + MAX_YEARS_IN_FUTURE
    compute()
    return
  }
  
  // Clamp to valid range
  const clamped = Math.max(minYear.value, Math.min(maxYear.value, value))
  
  if (clamped !== formData.value.yearTo) {
    formData.value.yearTo = clamped
  }
  
  // Ensure yearFrom is not greater than yearTo
  if (formData.value.yearFrom > formData.value.yearTo) {
    formData.value.yearFrom = formData.value.yearTo
  }
  
  // Always trigger recompute when year range changes (even if value was already valid)
  compute()
}


function handleSubmit(): void {
  compute()
}

/**
 * Validates and sanitizes the label input
 * @returns Object with validation result and sanitized label
 */
function validateAndSanitizeLabel(): { valid: boolean; sanitizedLabel?: string; error?: string } {
  const translate = (key: string, params?: Record<string, string | number>) => t.value(key, params)
  const labelTrimmed = formData.value.label.trim()
  
  if (!labelTrimmed) {
    return { valid: true, sanitizedLabel: '' }
  }
  
  const sanitizedLabel = sanitizeLabel(labelTrimmed)
  const labelValidation = validateLabel(sanitizedLabel, translate)
  
  if (!labelValidation.valid) {
    return { valid: false, error: labelValidation.error }
  }
  
  // Only update formData if it was actually changed (e.g., sanitization removed something)
  if (sanitizedLabel !== labelTrimmed) {
    formData.value.label = sanitizedLabel
  }
  
  return { valid: true, sanitizedLabel }
}

/**
 * Validates date and time inputs
 * @returns Object with parsed date or error message
 */
function validateDateAndTime(): { valid: boolean; date?: Date; error?: string; errorField?: 'date' | 'time' } {
  const translate = (key: string, params?: Record<string, string | number>) => t.value(key, params)
  
  if (!formData.value.date) {
    return { valid: false }
  }

  // Check if date looks incomplete (e.g., "1989-03-2" or "1989-03-" would be invalid but user might still be typing)
  const dateStr = formData.value.date
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    return { valid: false }
  }

  const { date: start, error: dateError } = parseDate(
    formData.value.date,
    formData.value.time || '0:00:00',
    translate
  )

  if (dateError) {
    // Check if error is about time (works for both languages)
    const timeKeywords = ['Zeit', 'time', 'Time']
    const isTimeError = timeKeywords.some(keyword => dateError.includes(keyword))
    return {
      valid: false,
      error: dateError,
      errorField: isTimeError ? 'time' : 'date'
    }
  }

  return { valid: true, date: start }
}

/**
 * Validates units and patterns selections
 * @returns Object with validation results
 */
function validateSelections(): { valid: boolean; error?: string; errorField?: 'units' | 'patterns' } {
  const translate = (key: string, params?: Record<string, string | number>) => t.value(key, params)
  
  const unitsValidation = validateUnits(formData.value.units, translate)
  if (!unitsValidation.valid) {
    return { valid: false, error: unitsValidation.error, errorField: 'units' }
  }

  const patternsValidation = validatePatterns(formData.value.patterns, translate)
  if (!patternsValidation.valid) {
    return { valid: false, error: patternsValidation.error, errorField: 'patterns' }
  }

  return { valid: true }
}

/**
 * Validates and normalizes the year range
 * @returns Object with normalized year range or error
 */
function validateAndNormalizeYearRange(): { valid: boolean; yearFrom?: number; yearTo?: number; error?: string } {
  const translate = (key: string, params?: Record<string, string | number>) => t.value(key, params)
  const todayYear = new Date().getFullYear()
  const maxYearTo = todayYear + MAX_YEARS_IN_FUTURE
  
  // yearFrom can be from startYear to currentYear (or expanded range)
  const yearFrom = Math.max(startYear.value, Math.min(formData.value.yearFrom, Math.max(startYear.value, todayYear)))
  const yearTo = Math.min(Math.max(yearFrom, formData.value.yearTo), maxYearTo)

  const yearRangeValidation = validateYearRange(yearFrom, yearTo, startYear.value, translate)
  if (!yearRangeValidation.valid) {
    return { valid: false, error: yearRangeValidation.error }
  }

  return { valid: true, yearFrom, yearTo }
}

/**
 * Main computation function that validates all inputs and triggers milestone calculation
 */
function compute(): void {
  // Clear previous errors
  clearError()
  fieldErrors.value = {}

  try {
    // Validate and sanitize label
    const labelResult = validateAndSanitizeLabel()
    if (!labelResult.valid) {
      fieldErrors.value.label = labelResult.error
      setError(labelResult.error || t.value('errors.invalidLabel'))
      return
    }

    // Validate date and time
    const dateResult = validateDateAndTime()
    if (!dateResult.valid) {
      if (dateResult.error) {
        if (dateResult.errorField === 'time') {
          fieldErrors.value.time = dateResult.error
        } else {
          fieldErrors.value.date = dateResult.error
        }
        setError(dateResult.error)
      }
      return
    }

    // Validate selections
    const selectionsResult = validateSelections()
    if (!selectionsResult.valid) {
      if (selectionsResult.errorField === 'units') {
        fieldErrors.value.units = selectionsResult.error
      } else {
        fieldErrors.value.patterns = selectionsResult.error
      }
      setError(selectionsResult.error || t.value(selectionsResult.errorField === 'units' ? 'errors.noUnits' : 'errors.noPatterns'))
      return
    }

    // Validate year range
    const yearRangeResult = validateAndNormalizeYearRange()
    if (!yearRangeResult.valid) {
      fieldErrors.value.yearRange = yearRangeResult.error
      setError(yearRangeResult.error || t.value('errors.invalidYearRange'))
      return
    }

    // All validations passed - trigger recomputation
    const trimmedLabel = formData.value.label.trim()
    recomputeState(
      dateResult.date!,
      trimmedLabel,
      formData.value.units,
      formData.value.patterns,
      yearRangeResult.yearFrom!,
      yearRangeResult.yearTo!
    )
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Ein unerwarteter Fehler ist aufgetreten'
    setError(errorMessage)
  }
}

function handleReset(): void {
  clearError()
  fieldErrors.value = {}
  const resetToday = new Date()
  const resetYear = resetToday.getFullYear()
  formData.value = {
    label: '',
    date: toLocalDateInputValue(resetToday),
    time: '12:00:00',
    units: ['years', 'months', 'weeks', 'days', 'hours', 'minutes', 'seconds'],
    patterns: { rounded: true, repdigit: true },
    yearFrom: resetYear,
    yearTo: resetYear + MAX_YEARS_IN_FUTURE
  }
  yearFromMin.value = resetYear
  yearToMax.value = resetYear + MAX_YEARS_IN_FUTURE
  compute()
}

// Computed properties for efficient counting (cached, only recalculates when eventsView changes)
const unitCounts = computed(() => {
  const counts: Record<Unit, number> = {
    years: 0,
    months: 0,
    weeks: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  }
  state.value.eventsView.forEach(ev => {
    counts[ev.unit] = (counts[ev.unit] || 0) + 1
  })
  return counts
})

const patternCounts = computed(() => {
  return {
    rounded: state.value.eventsView.filter(ev => ev.patterns.rounded).length,
    repdigit: state.value.eventsView.filter(ev => ev.patterns.repdigit).length
  }
})

function getUnitCount(unit: Unit): number {
  return unitCounts.value[unit] || 0
}

function getPatternCount(pattern: 'rounded' | 'repdigit'): number {
  return patternCounts.value[pattern] || 0
}

function getUnitFilterRowClass(unit: Unit): string {
  return cn(
    unit === 'years' && 'border-l-red-500/60',
    unit === 'months' && 'border-l-orange-500/60',
    unit === 'weeks' && 'border-l-amber-500/60',
    unit === 'days' && 'border-l-lime-500/60',
    unit === 'hours' && 'border-l-emerald-500/60',
    unit === 'minutes' && 'border-l-cyan-500/60',
    unit === 'seconds' && 'border-l-blue-500/60'
  )
}

function getUnitFilterCountClass(unit: Unit): string {
  return cn(
    unit === 'years' && 'border-red-500/20 text-red-600 dark:border-red-400/30 dark:text-red-300',
    unit === 'months' && 'border-orange-500/20 text-orange-600 dark:border-orange-400/30 dark:text-orange-300',
    unit === 'weeks' && 'border-amber-500/20 text-amber-600 dark:border-amber-400/30 dark:text-amber-300',
    unit === 'days' && 'border-lime-500/20 text-lime-700 dark:border-lime-400/30 dark:text-lime-300',
    unit === 'hours' && 'border-emerald-500/20 text-emerald-600 dark:border-emerald-400/30 dark:text-emerald-300',
    unit === 'minutes' && 'border-cyan-500/20 text-cyan-600 dark:border-cyan-400/30 dark:text-cyan-300',
    unit === 'seconds' && 'border-blue-500/20 text-blue-600 dark:border-blue-400/30 dark:text-blue-300'
  )
}

function toggleUnit(unit: Unit, checked: boolean | 'indeterminate'): void {
  const next = new Set(formData.value.units)

  if (checked === true) {
    next.add(unit)
  } else {
    next.delete(unit)
  }

  formData.value.units = units.value
    .map((entry) => entry.value)
    .filter((value) => next.has(value))
}

// Watch for changes and recompute with debounce (but NOT for date/yearFrom/yearTo - those are handled on blur)
let debounceTimer: ReturnType<typeof setTimeout> | null = null
watch(
  () => [formData.value.time, formData.value.units, formData.value.patterns],
  () => {
    if (debounceTimer) clearTimeout(debounceTimer)
    debounceTimer = setTimeout(() => {
      compute()
    }, CONFIG.DEBOUNCE_DELAY)
  },
  { deep: true }
)

// Watch for label changes and auto-submit (but don't trim during typing)
// Only compute when label actually changes, not on every keystroke
let labelDebounceTimer: ReturnType<typeof setTimeout> | null = null
watch(
  () => formData.value.label,
  () => {
    // Clear any existing timer
    if (labelDebounceTimer) clearTimeout(labelDebounceTimer)
    // Debounce to avoid computing on every keystroke
    labelDebounceTimer = setTimeout(() => {
      compute()
    }, 300)
  }
)

// Sync formData with state when state changes (e.g., from ResultsPanel "Mehr Jahre anzeigen" buttons)
watch(() => [state.value.yearFrom, state.value.yearTo], ([newYearFrom, newYearTo]) => {
  if (newYearFrom !== null && newYearFrom !== formData.value.yearFrom) {
    formData.value.yearFrom = newYearFrom
    // Update yearFromMin if needed (for expanded range)
    if (newYearFrom < yearFromMin.value) {
      yearFromMin.value = newYearFrom
    }
  }
  if (newYearTo !== null && newYearTo !== formData.value.yearTo) {
    formData.value.yearTo = newYearTo
    // Update yearToMax if needed (for expanded range)
    if (newYearTo > yearToMax.value) {
      yearToMax.value = newYearTo
    }
  }
}, { immediate: false })

// Note: Date changes are handled in handleDateBlur() to avoid validation during typing

onMounted(() => {
  const urlState = loadStateFromURL()
  if (urlState.label) formData.value.label = urlState.label
  if (urlState.date) formData.value.date = urlState.date
  if (urlState.time) formData.value.time = urlState.time
  else formData.value.time = '12:00:00'
  if (urlState.units) formData.value.units = urlState.units as Unit[]
  if (urlState.patterns) formData.value.patterns = urlState.patterns
  
  // If yearFrom/yearTo are in URL, use them; otherwise auto-adjust will happen via watcher
  if (urlState.yearFrom) formData.value.yearFrom = urlState.yearFrom
  if (urlState.yearTo) formData.value.yearTo = urlState.yearTo

  // Auto-adjust year range if not set from URL
  if (!urlState.yearFrom || !urlState.yearTo) {
    const todayYear = new Date().getFullYear()
    
    if (!urlState.yearFrom) {
      // Default to current year, but allow selection from startYear to currentYear
      formData.value.yearFrom = Math.min(startYear.value, todayYear)
    }
    
    if (!urlState.yearTo) {
      // Default to MAX_YEARS_IN_FUTURE years in the future
      formData.value.yearTo = todayYear + MAX_YEARS_IN_FUTURE
    }
  }

  compute()
})

// Cleanup timers on unmount to prevent memory leaks
onUnmounted(() => {
  if (debounceTimer) {
    clearTimeout(debounceTimer)
    debounceTimer = null
  }
  if (labelDebounceTimer) {
    clearTimeout(labelDebounceTimer)
    labelDebounceTimer = null
  }
})
</script>
