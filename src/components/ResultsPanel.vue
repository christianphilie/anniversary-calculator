<template>
  <!-- Export Section -->
  <section class="panel">
    <div class="hd">
      <strong>📤 {{ t('export.title') }}</strong>
      <ICSImportHelp />
    </div>
    <div class="bd export-section">
      <p class="export-description">
        {{ t('export.description') }}
      </p>
      <div class="export-controls">
        <div class="export-buttons-group">
          <button
            class="btn primary"
            :title="`${downloadTooltip} (Strg/Cmd + D)`"
            :aria-label="downloadTooltip"
            :disabled="state.eventsView.length === 0"
            @click="handleDownloadICS"
          >
            📅 ICS
          </button>
          <button
            class="btn primary"
            :title="`${t('export.exportPDF')} (${state.eventsView.length} ${t('common.selectAll').toLowerCase()})`"
            :aria-label="t('export.exportPDF')"
            :disabled="state.eventsView.length === 0"
            @click="handleDownloadPDF"
          >
            📑 PDF
          </button>
          <button
            class="btn primary"
            :title="`${t('export.exportCSV')} (${state.eventsView.length} ${t('common.selectAll').toLowerCase()})`"
            :aria-label="t('export.exportCSV')"
            :disabled="state.eventsView.length === 0"
            @click="handleDownloadCSV"
          >
            📊 CSV
          </button>
          <button
            class="btn primary"
            :title="`${t('export.exportJSON')} (${state.eventsView.length} ${t('common.selectAll').toLowerCase()})`"
            :aria-label="t('export.exportJSON')"
            :disabled="state.eventsView.length === 0"
            @click="handleDownloadJSON"
          >
            📄 JSON
          </button>
        </div>
        <div class="share-button-wrapper">
          <button
            class="btn secondary"
            :title="t('export.shareViewTitle')"
            :aria-label="t('export.shareViewTitle')"
            @click="handleShare"
          >
            🔗 {{ t('export.shareView') }}
          </button>
        </div>
      </div>
    </div>
  </section>

  <!-- Milestones Section -->
  <section class="panel">
    <div class="hd">
      <strong>📊 {{ t('export.milestonesTitle') }}</strong>
    </div>
    <div class="bd">
      <div v-if="isLoading" class="empty" role="status" aria-live="polite" aria-busy="true">
        <div class="loading" aria-hidden="true"></div> {{ t('results.loading') }}
      </div>
      <div v-else-if="!state.eventsView.length" class="empty" role="status" aria-live="polite">
        {{ t('results.empty') }}
      </div>
      <div v-else class="list" role="list" aria-label="Jubiläen">
        <button
          v-if="canAddPreviousYears"
          class="year-range-expand-btn"
          type="button"
          @click="addPreviousYears"
          :title="t('form.showMoreYears')"
          :aria-label="t('form.showMoreYears')"
        >
          <span class="year-expand-arrow">↑</span> {{ t('form.showMoreYears') }}
        </button>
        <template v-for="(ev, idx) in state.eventsView" :key="ev.id">
          <YearSeparator
            v-if="shouldShowYearSeparator(idx, ev.date.getFullYear())"
            :year="ev.date.getFullYear()"
            @jump-to-year="handleJumpToYear"
          />
          <MilestoneItem
            :event="ev"
          />
        </template>
        <button
          v-if="canAddNextYears"
          class="year-range-expand-btn"
          type="button"
          @click="addNextYears"
          :title="t('form.showMoreYears')"
          :aria-label="t('form.showMoreYears')"
        >
          <span class="year-expand-arrow">↓</span> {{ t('form.showMoreYears') }}
        </button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAppState } from '../composables/useAppState'
import { useUrlState } from '../composables/useUrlState'
import { useToast } from '../composables/useToast'
import { useI18n } from '../i18n'
import { buildICS, downloadICS } from '../utils/ics'
import { exportToCSV, exportToJSON, exportToPDF, downloadFile } from '../utils/export'
import { generateShareUrl, shareMilestones, isNativeShareAvailable } from '../utils/share'
import { copyToClipboard } from '../utils/clipboard'
import { generateFilename } from '../utils/filename'
import { logError } from '../utils/logger'
import YearSeparator from './YearSeparator.vue'
import MilestoneItem from './MilestoneItem.vue'
import ICSImportHelp from './ICSImportHelp.vue'

const { state, isLoading, recompute } = useAppState()
const { encodeStateToURL } = useUrlState(state)
const { success, error } = useToast()
const { locale, t } = useI18n()

const canAddPreviousYears = computed(() => {
  if (!state.value.yearFrom) return false
  const currentYear = new Date().getFullYear()
  const dateYear = startYear.value
  // Min possible year is the start date year or current year, whichever is earlier
  const minPossibleYear = Math.min(dateYear, currentYear)
  // Show button if we can still expand backwards (at least 1 year)
  return state.value.yearFrom > minPossibleYear
})

const canAddNextYears = computed(() => {
  if (!state.value.yearTo) return false
  const currentYear = new Date().getFullYear()
  const maxYearTo = currentYear + 100
  // Show button if we can still expand forwards (at least 1 year)
  return state.value.yearTo < maxYearTo
})

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
    // Account for sticky header height (80px) plus some padding
    const headerOffset = 100
    const elementPosition = element.getBoundingClientRect().top + window.pageYOffset
    const offsetPosition = elementPosition - headerOffset
    
    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    })
  }
}

const downloadTooltip = computed(() => {
  const n = state.value.eventsView.length
  if (n === 0) {
    return t.value('results.downloadTooltipNone')
  }
  return t.value('results.downloadTooltip', {
    count: n.toString(),
    plural: n === 1 ? '' : 'se'
  })
})

function shouldShowYearSeparator(index: number, year: number): boolean {
  if (index === 0) return true
  const prevYear = state.value.eventsView[index - 1]?.date.getFullYear()
  return prevYear !== year
}

function handleDownloadICS(): void {
  const events = state.value.eventsView
  if (!events.length) return

  const ics = buildICS(events)
  downloadICS(generateFilename(state.value.label, 'ics'), ics)
}

function handleDownloadCSV(): void {
  const events = state.value.eventsView
  if (!events.length) return

  const csv = exportToCSV(events)
  downloadFile(generateFilename(state.value.label, 'csv'), csv, 'text/csv;charset=utf-8')
}

function handleDownloadJSON(): void {
  const events = state.value.eventsView
  if (!events.length) return

  const json = exportToJSON(events)
  downloadFile(generateFilename(state.value.label, 'json'), json, 'application/json;charset=utf-8')
}

function handleDownloadPDF(): void {
  const events = state.value.eventsView
  if (!events.length) return

  try {
    const pdf = exportToPDF(
      events,
      state.value.label || '',
      locale.value as 'de' | 'en',
      {
        start: state.value.start,
        yearFrom: state.value.yearFrom,
        yearTo: state.value.yearTo,
        units: state.value.units,
        patterns: state.value.patterns
      }
    )
    pdf.save(generateFilename(state.value.label, 'pdf'))
    success(t.value('success.exported'))
  } catch (err) {
    logError('PDF export error:', err)
    error(t.value('errors.exportError'))
  }
}

async function handleShare(): Promise<void> {
  const milestoneIds = state.value.eventsView.map(ev => ev.id)
  const title = state.value.label || 'Jubiläumsrechner'
  const text = `Jubiläen: ${state.value.eventsView.length} Einträge`
  
  // Update URL with current state for sharing
  encodeStateToURL()
  
  const url = generateShareUrl(milestoneIds)
  
  if (isNativeShareAvailable()) {
    const shared = await shareMilestones(milestoneIds, title, text)
    if (shared) {
      success('Geteilt')
    }
  } else {
    // Fallback: Copy URL to clipboard
    const copied = await copyToClipboard(url)
    
    if (copied) {
      success('Link kopiert')
    } else {
      error('Fehler beim Kopieren')
    }
  }
}
</script>
