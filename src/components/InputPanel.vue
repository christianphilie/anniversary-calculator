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
              required
              :aria-invalid="fieldErrors.date ? 'true' : 'false'"
              :aria-describedby="fieldErrors.date ? 'date-error' : undefined"
            />
            <span v-if="fieldErrors.date" id="date-error" class="field-error" role="alert">
              {{ fieldErrors.date }}
            </span>
          </div>
          <div class="field">
            <label for="time">{{ t('form.time') }}</label>
            <div class="time-input-wrapper">
              <input
                id="time"
                v-model="formData.time"
                type="time"
                step="1"
                :class="{ 'time-empty': !formData.time }"
                :aria-invalid="fieldErrors.time ? 'true' : 'false'"
                :aria-describedby="fieldErrors.time ? 'time-error' : undefined"
              />
              <span v-if="!formData.time" class="time-placeholder">0:00:00</span>
            </div>
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
              <select
                id="yearFrom"
                v-model.number="formData.yearFrom"
                :aria-invalid="fieldErrors.yearRange ? 'true' : 'false'"
                :aria-describedby="fieldErrors.yearRange ? 'year-range-error' : undefined"
              >
                <option v-for="y in yearFromOptions" :key="y" :value="y">
                  {{ y }}
                </option>
              </select>
            </div>
            <div class="field">
              <label for="yearTo" class="field-label-small">{{ t('form.yearTo') }}</label>
              <select
                id="yearTo"
                v-model.number="formData.yearTo"
                :aria-invalid="fieldErrors.yearRange ? 'true' : 'false'"
                :aria-describedby="fieldErrors.yearRange ? 'year-range-error' : undefined"
              >
                <option v-for="y in yearToOptions" :key="y" :value="y">
                  {{ y }}
                </option>
              </select>
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
const { loadStateFromURL, encodeStateToURL } = useUrlState(state)
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

const formData = ref({
  label: '',
  date: toLocalDateInputValue(new Date()),
  time: '',
  units: ['years', 'months', 'weeks', 'days', 'hours', 'minutes', 'seconds'] as Unit[],
  patterns: { rounded: true, repdigit: true },
  yearFrom: new Date().getFullYear(),
  yearTo: new Date().getFullYear() + 10
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

const yearFromOptions = computed(() => {
  const options: number[] = []
  for (let y = startYear.value; y <= startYear.value + CONFIG.MAX_SPAN; y++) {
    options.push(y)
  }
  return options
})

const yearToOptions = computed(() => {
  const options: number[] = []
  const maxY = startYear.value + CONFIG.MAX_SPAN
  for (let y = formData.value.yearFrom; y <= maxY; y++) {
    options.push(y)
  }
  return options
})

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
    // Sanitize and validate label
    if (formData.value.label.trim()) {
      const sanitizedLabel = sanitizeLabel(formData.value.label.trim())
      const labelValidation = validateLabel(sanitizedLabel, translate)
      if (!labelValidation.valid) {
        fieldErrors.value.label = labelValidation.error
        setError(labelValidation.error || t.value('errors.invalidLabel'))
        return
      }
      // Update formData with sanitized value
      formData.value.label = sanitizedLabel
    }

    // Validate date and time
    if (!formData.value.date) {
      fieldErrors.value.date = t.value('validation.dateRequired')
      setError(t.value('validation.dateRequired'))
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
    const yearFrom = Math.max(startYear.value, formData.value.yearFrom)
    const yearTo = Math.max(yearFrom, Math.min(startYear.value + CONFIG.MAX_SPAN, formData.value.yearTo))

    // Validate year range
    const yearRangeValidation = validateYearRange(yearFrom, yearTo, startYear.value, translate)
    if (!yearRangeValidation.valid) {
      fieldErrors.value.yearRange = yearRangeValidation.error
      setError(yearRangeValidation.error || t.value('errors.invalidYearRange'))
      return
    }

    recomputeState(
      start,
      formData.value.label.trim(),
      formData.value.units,
      formData.value.patterns,
      yearFrom,
      yearTo
    )

    encodeStateToURL()
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Ein unerwarteter Fehler ist aufgetreten'
    setError(errorMessage)
    // Error is already handled by setError above
  }
}

function handleReset(): void {
  clearError()
  fieldErrors.value = {}
  const today = new Date()
  formData.value = {
    label: '',
    date: toLocalDateInputValue(today),
    time: '',
    units: ['years', 'months', 'weeks', 'days', 'hours', 'minutes', 'seconds'],
    patterns: { rounded: true, repdigit: true },
    yearFrom: today.getFullYear(),
    yearTo: today.getFullYear() + 10
  }
  state.value.selected.clear()
  compute()
}

// Watch for changes and recompute with debounce
let debounceTimer: ReturnType<typeof setTimeout> | null = null
watch(
  () => [formData.value.date, formData.value.time, formData.value.units, formData.value.patterns, formData.value.yearFrom, formData.value.yearTo],
  () => {
    if (debounceTimer) clearTimeout(debounceTimer)
    debounceTimer = setTimeout(() => {
      compute()
    }, CONFIG.DEBOUNCE_DELAY)
  },
  { deep: true }
)

// Watch for label changes and auto-submit after 0.5s delay
let labelDebounceTimer: ReturnType<typeof setTimeout> | null = null
watch(
  () => formData.value.label,
  () => {
    if (labelDebounceTimer) clearTimeout(labelDebounceTimer)
    labelDebounceTimer = setTimeout(() => {
      compute()
    }, 500) // 0.5 seconds delay
  }
)

watch(() => formData.value.yearFrom, () => {
  if (formData.value.yearTo < formData.value.yearFrom) {
    formData.value.yearTo = formData.value.yearFrom
  }
})

// Flag to prevent auto-adjustment during initial mount
let isInitialMount = true

// Auto-adjust year range when date changes (but not during initial mount)
watch(() => formData.value.date, (newDate) => {
  if (!newDate) return
  
  // Skip auto-adjustment during initial mount (URL state will be loaded first)
  if (isInitialMount) return
  
  const dateYear = new Date(newDate).getFullYear()
  const todayYear = new Date().getFullYear()
  
  // Set yearFrom to the year of the entered date
  formData.value.yearFrom = dateYear
  
  // Set yearTo: max(dateYear + 10, todayYear + 5) to show both past and future milestones
  // Cap at dateYear + MAX_SPAN to respect maximum range
  const suggestedYearTo = Math.max(dateYear + 10, todayYear + 5)
  const cappedYearTo = Math.min(dateYear + CONFIG.MAX_SPAN, suggestedYearTo)
  formData.value.yearTo = Math.max(formData.value.yearFrom, cappedYearTo)
})

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

  // Auto-adjust year range if not set from URL (watcher will handle this, but we ensure it's set initially)
  if (!urlState.yearFrom || !urlState.yearTo) {
    const dateYear = startYear.value
    const todayYear = new Date().getFullYear()
    
    if (!urlState.yearFrom) {
      formData.value.yearFrom = dateYear
    }
    
    if (!urlState.yearTo) {
      const suggestedYearTo = Math.max(dateYear + 10, todayYear + 5)
      const cappedYearTo = Math.min(dateYear + CONFIG.MAX_SPAN, suggestedYearTo)
      formData.value.yearTo = Math.max(formData.value.yearFrom, cappedYearTo)
    }
  }

  compute()

  // Mark initial mount as complete (now date changes will trigger auto-adjustment)
  isInitialMount = false

  // Select milestones from share URL after computation
  if (urlState.milestoneIds && urlState.milestoneIds.length > 0) {
    // Wait for next tick to ensure events are computed
    setTimeout(() => {
      urlState.milestoneIds!.forEach(id => {
        if (state.value.eventsAll.some(ev => ev.id === id)) {
          state.value.selected.add(id)
        }
      })
    }, 100)
  }
})
</script>
