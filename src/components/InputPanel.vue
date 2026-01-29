<template>
  <section class="panel">
    <div class="hd">
      <strong>🎯 Eingaben</strong>
      <button
        class="btn ghost"
        title="Eingaben zurücksetzen"
        aria-label="Eingaben zurücksetzen"
        @click="handleReset"
      >
        Zurücksetzen
      </button>
    </div>
    <div class="bd">
      <ErrorAlert />
      <form @submit.prevent="handleSubmit">
        <div class="field">
          <label for="label">Titel (optional)</label>
          <input
            id="label"
            v-model="formData.label"
            type="text"
            placeholder="Kennenlernen, Geburt, Hochzeit …"
            :aria-invalid="fieldErrors.label ? 'true' : 'false'"
            :aria-describedby="fieldErrors.label ? 'label-error' : undefined"
          />
          <span v-if="fieldErrors.label" id="label-error" class="field-error" role="alert">
            {{ fieldErrors.label }}
          </span>
        </div>

        <div class="row">
          <div class="field">
            <label for="date">Datum</label>
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
            <label for="time">Uhrzeit (optional)</label>
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
          <label>Einheiten</label>
          <div class="chips">
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
          <label>Muster</label>
          <div class="chips">
            <label class="chip">
              <input v-model="formData.patterns.rounded" type="checkbox" />
              <span>Runde Vielfache (500, 10.000, …)</span>
            </label>
            <label class="chip">
              <input v-model="formData.patterns.repdigit" type="checkbox" />
              <span>Schnapszahlen (11, 2.222, 333, …)</span>
            </label>
          </div>
        </div>

        <div class="row">
          <div class="field">
            <label for="yearFrom">Jahre von</label>
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
            <label for="yearTo">Jahre bis</label>
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

const units: Array<{ value: Unit; label: string }> = [
  { value: 'years', label: 'Jahre' },
  { value: 'months', label: 'Monate' },
  { value: 'weeks', label: 'Wochen' },
  { value: 'days', label: 'Tage' },
  { value: 'hours', label: 'Stunden' },
  { value: 'minutes', label: 'Minuten' },
  { value: 'seconds', label: 'Sekunden' }
]

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

  try {
    // Sanitize and validate label
    if (formData.value.label.trim()) {
      const sanitizedLabel = sanitizeLabel(formData.value.label.trim())
      const labelValidation = validateLabel(sanitizedLabel)
      if (!labelValidation.valid) {
        fieldErrors.value.label = labelValidation.error
        setError(labelValidation.error || 'Ungültiger Titel')
        return
      }
      // Update formData with sanitized value
      formData.value.label = sanitizedLabel
    }

    // Validate date and time
    if (!formData.value.date) {
      fieldErrors.value.date = 'Bitte wähle ein Datum aus'
      setError('Bitte wähle ein Datum aus')
      return
    }

    const { date: start, error: dateError } = parseDate(
      formData.value.date,
      formData.value.time || '12:00:00'
    )

    if (dateError) {
      if (dateError.includes('Zeit')) {
        fieldErrors.value.time = dateError
      } else {
        fieldErrors.value.date = dateError
      }
      setError(dateError)
      return
    }

    // Validate units
    const unitsValidation = validateUnits(formData.value.units)
    if (!unitsValidation.valid) {
      fieldErrors.value.units = unitsValidation.error
      setError(unitsValidation.error || 'Bitte wähle mindestens eine Einheit aus')
      return
    }

    // Validate patterns
    const patternsValidation = validatePatterns(formData.value.patterns)
    if (!patternsValidation.valid) {
      fieldErrors.value.patterns = patternsValidation.error
      setError(patternsValidation.error || 'Bitte wähle mindestens ein Muster aus')
      return
    }

    // Ensure year range is valid
    const yearFrom = Math.max(startYear.value, formData.value.yearFrom)
    const yearTo = Math.max(yearFrom, Math.min(startYear.value + CONFIG.MAX_SPAN, formData.value.yearTo))

    // Validate year range
    const yearRangeValidation = validateYearRange(yearFrom, yearTo, startYear.value)
    if (!yearRangeValidation.valid) {
      fieldErrors.value.yearRange = yearRangeValidation.error
      setError(yearRangeValidation.error || 'Ungültiger Jahresbereich')
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
    console.error('Compute error:', err)
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

watch(() => formData.value.yearFrom, () => {
  if (formData.value.yearTo < formData.value.yearFrom) {
    formData.value.yearTo = formData.value.yearFrom
  }
})

onMounted(() => {
  const urlState = loadStateFromURL()
  if (urlState.label) formData.value.label = urlState.label
  if (urlState.date) formData.value.date = urlState.date
  if (urlState.time) formData.value.time = urlState.time
  if (urlState.units) formData.value.units = urlState.units as Unit[]
  if (urlState.patterns) formData.value.patterns = urlState.patterns
  if (urlState.yearFrom) formData.value.yearFrom = urlState.yearFrom
  if (urlState.yearTo) formData.value.yearTo = urlState.yearTo

  // Set default year range based on start date
  const sy = startYear.value
  if (!formData.value.yearFrom || formData.value.yearFrom < sy) {
    formData.value.yearFrom = sy
  }
  const todayYear = new Date().getFullYear()
  const wantedTo = Math.max(sy + 10, todayYear + 10)
  const cappedTo = Math.min(sy + CONFIG.MAX_SPAN, wantedTo)
  if (!formData.value.yearTo || formData.value.yearTo < formData.value.yearFrom) {
    formData.value.yearTo = cappedTo
  }

  compute()

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
