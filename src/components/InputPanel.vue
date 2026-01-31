<template>
  <section class="panel">
    <div class="hd">
      <strong>🎯 {{ t('ui.inputs') }}</strong>
      <button
        class="btn ghost"
        :title="t('common.reset')"
        :aria-label="t('common.reset')"
        @click="handleReset"
      >
        {{ t('common.reset') }}
      </button>
    </div>
    <div class="bd">
      <p class="inputs-description">
        {{ t('inputs.description') }}
      </p>
      <ErrorAlert />
      <form @submit.prevent="handleSubmit">
        <div class="row">
          <div class="field">
            <label for="date">{{ t('form.date') }}</label>
            <input
              id="date"
              v-model="formData.date"
              type="date"
              @blur="handleDateBlur"
              :aria-invalid="fieldErrors.date ? 'true' : 'false'"
              :aria-describedby="fieldErrors.date ? 'date-error' : undefined"
            />
            <span v-if="fieldErrors.date" id="date-error" class="field-error" role="alert">
              {{ fieldErrors.date }}
            </span>
          </div>
          <div class="field">
            <label for="time">{{ t('form.time') }}</label>
            <input
              id="time"
              v-model="formData.time"
              type="time"
              step="1"
              :aria-invalid="fieldErrors.time ? 'true' : 'false'"
              :aria-describedby="fieldErrors.time ? 'time-error' : undefined"
            />
            <span v-if="fieldErrors.time" id="time-error" class="field-error" role="alert">
              {{ fieldErrors.time }}
            </span>
          </div>
        </div>

        <div class="field">
          <label for="label">{{ t('form.label') }}</label>
          <input
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

        <div class="field">
          <label>{{ t('form.yearRange') }}</label>
          <div class="row">
            <div class="field">
              <label for="yearFrom" class="field-label-small">{{ t('form.yearFrom') }}</label>
              <input
                id="yearFrom"
                v-model.number="formData.yearFrom"
                type="number"
                step="1"
                @blur="handleYearFromBlur"
                @keydown.enter="handleYearFromBlur"
                :aria-invalid="fieldErrors.yearRange ? 'true' : 'false'"
                :aria-describedby="fieldErrors.yearRange ? 'year-range-error' : undefined"
              />
            </div>
            <div class="field">
              <label for="yearTo" class="field-label-small">{{ t('form.yearTo') }}</label>
              <input
                id="yearTo"
                v-model.number="formData.yearTo"
                type="number"
                step="1"
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

        <div class="field">
          <label>{{ t('form.units') }}</label>
          <div class="chips chips-units">
            <label
              v-for="unit in units"
              :key="unit.value"
              :class="['chip', 'unit', unit.value]"
            >
              <input
                v-model="formData.units"
                type="checkbox"
                :value="unit.value"
              />
              <span>{{ unit.label }}</span>
            </label>
          </div>
        </div>

        <div class="field">
          <label>{{ t('form.patterns') }}</label>
          <div class="chips chips-patterns">
            <label class="chip chip-pattern">
              <input v-model="formData.patterns.rounded" type="checkbox" />
              <span class="chip-pattern-content">
                <span class="chip-pattern-label">{{ t('form.roundedMultiples') }}</span>
                <span class="chip-pattern-examples">{{ t('form.roundedMultiplesExamples') }}</span>
              </span>
            </label>
            <label class="chip chip-pattern">
              <input v-model="formData.patterns.repdigit" type="checkbox" />
              <span class="chip-pattern-content">
                <span class="chip-pattern-label">{{ t('form.repdigits') }}</span>
                <span class="chip-pattern-examples">{{ t('form.repdigitsExamples') }}</span>
              </span>
            </label>
          </div>
        </div>
      </form>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, watch, computed, onMounted } from 'vue'
import type { Unit } from '../types'
import { CONFIG } from '../types'
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
  time: '',
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
const yearToMax = ref<number>(todayYear + 100)

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
  const maxAllowed = todayYear + 100
  
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
    formData.value.yearTo = todayYear + 100
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

function compute(): void {
  // Clear previous errors
  clearError()
  fieldErrors.value = {}

  // Get translation function
  const translate = (key: string, params?: Record<string, string | number>) => t.value(key, params)

  try {
    // Sanitize and validate label (trim only for validation, don't modify formData during typing)
    const labelTrimmed = formData.value.label.trim()
    if (labelTrimmed) {
      const sanitizedLabel = sanitizeLabel(labelTrimmed)
      const labelValidation = validateLabel(sanitizedLabel, translate)
      if (!labelValidation.valid) {
        fieldErrors.value.label = labelValidation.error
        setError(labelValidation.error || t.value('errors.invalidLabel'))
        return
      }
      // Only update formData if it was actually changed (e.g., sanitization removed something)
      if (sanitizedLabel !== labelTrimmed) {
        formData.value.label = sanitizedLabel
      }
    }

    // Validate date and time (only validate if date is present and looks complete)
    if (!formData.value.date) {
      // Don't show error if date is empty - user might still be typing
      return
    }

    // Check if date looks incomplete (e.g., "1989-03-2" or "1989-03-" would be invalid but user might still be typing)
    // Only validate if date is a complete date string (YYYY-MM-DD format)
    const dateStr = formData.value.date
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
      // Date is incomplete, don't validate yet
      return
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
      if (isTimeError) {
        fieldErrors.value.time = dateError
      } else {
        fieldErrors.value.date = dateError
      }
      setError(dateError)
      return
    }

    // Validate units
    const unitsValidation = validateUnits(formData.value.units, translate)
    if (!unitsValidation.valid) {
      fieldErrors.value.units = unitsValidation.error
      setError(unitsValidation.error || t.value('errors.noUnits'))
      return
    }

    // Validate patterns
    const patternsValidation = validatePatterns(formData.value.patterns, translate)
    if (!patternsValidation.valid) {
      fieldErrors.value.patterns = patternsValidation.error
      setError(patternsValidation.error || t.value('errors.noPatterns'))
      return
    }

    // Ensure year range is valid
    const todayYear = new Date().getFullYear()
    const maxYearTo = todayYear + 100 // Max 100 years in the future
    // yearFrom can be from startYear to currentYear (or expanded range)
    const yearFrom = Math.max(startYear.value, Math.min(formData.value.yearFrom, Math.max(startYear.value, todayYear)))
    const yearTo = Math.min(Math.max(yearFrom, formData.value.yearTo), maxYearTo)

    // Validate year range
    const yearRangeValidation = validateYearRange(yearFrom, yearTo, startYear.value, translate)
    if (!yearRangeValidation.valid) {
      fieldErrors.value.yearRange = yearRangeValidation.error
      setError(yearRangeValidation.error || t.value('errors.invalidYearRange'))
      return
    }

    // Use trimmed label for computation (but formData keeps original for editing)
    const trimmedLabel = formData.value.label.trim()
    recomputeState(
      start,
      trimmedLabel,
      formData.value.units,
      formData.value.patterns,
      yearFrom,
      yearTo
    )
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Ein unerwarteter Fehler ist aufgetreten'
    setError(errorMessage)
    // Error is already handled by setError above
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
    time: '',
    units: ['years', 'months', 'weeks', 'days', 'hours', 'minutes', 'seconds'],
    patterns: { rounded: true, repdigit: true },
    yearFrom: resetYear,
    yearTo: resetYear + 100
  }
  yearFromMin.value = resetYear
  yearToMax.value = resetYear + 100
  compute()
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
      // Default to 100 years in the future
      formData.value.yearTo = todayYear + 100
    }
  }

  compute()
})
</script>
