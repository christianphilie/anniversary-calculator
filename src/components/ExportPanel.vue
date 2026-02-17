<template>
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
            class="btn primary export-format-btn"
            :title="`${downloadTooltip} (Strg/Cmd + D)`"
            :aria-label="downloadTooltip"
            :disabled="state.eventsView.length === 0"
            @click="handleDownloadICS"
          >
            <span class="export-icon">📅</span>
            <span class="export-label">ICS</span>
          </button>
          <button
            class="btn primary export-format-btn"
            :title="`${t('export.exportPDF')} (${state.eventsView.length} ${t('common.selectAll').toLowerCase()})`"
            :aria-label="t('export.exportPDF')"
            :disabled="state.eventsView.length === 0"
            @click="handleDownloadPDF"
          >
            <span class="export-icon">📑</span>
            <span class="export-label">PDF</span>
          </button>
          <button
            class="btn primary export-format-btn"
            :title="`${t('export.exportCSV')} (${state.eventsView.length} ${t('common.selectAll').toLowerCase()})`"
            :aria-label="t('export.exportCSV')"
            :disabled="state.eventsView.length === 0"
            @click="handleDownloadCSV"
          >
            <span class="export-icon">📊</span>
            <span class="export-label">CSV</span>
          </button>
          <button
            class="btn primary export-format-btn"
            :title="`${t('export.exportJSON')} (${state.eventsView.length} ${t('common.selectAll').toLowerCase()})`"
            :aria-label="t('export.exportJSON')"
            :disabled="state.eventsView.length === 0"
            @click="handleDownloadJSON"
          >
            <span class="export-icon">📄</span>
            <span class="export-label">JSON</span>
          </button>
        </div>
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
import { isNativeShareAvailable } from '../utils/share'
import { copyToClipboard } from '../utils/clipboard'
import { generateFilename } from '../utils/filename'
import { logError } from '../utils/logger'
import ICSImportHelp from './ICSImportHelp.vue'

const { state } = useAppState()
const { encodeStateToURL } = useUrlState(state)
const { success, error } = useToast()
const { locale, t } = useI18n()

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

function handleDownloadICS(): void {
  const events = state.value.eventsView
  if (!events.length) return

  try {
    const ics = buildICS(events)
    downloadICS(generateFilename(state.value.label, 'ics'), ics, true)
    success(t.value('success.exported'))
  } catch (err) {
    logError('ICS export error:', err)
    error(t.value('errors.exportError'))
  }
}

function handleDownloadCSV(): void {
  const events = state.value.eventsView
  if (!events.length) return

  try {
    const csv = exportToCSV(events)
    downloadFile(generateFilename(state.value.label, 'csv'), csv, 'text/csv;charset=utf-8')
    success(t.value('success.exported'))
  } catch (err) {
    logError('CSV export error:', err)
    error(t.value('errors.exportError'))
  }
}

function handleDownloadJSON(): void {
  const events = state.value.eventsView
  if (!events.length) return

  try {
    const json = exportToJSON(events)
    downloadFile(generateFilename(state.value.label, 'json'), json, 'application/json;charset=utf-8')
    success(t.value('success.exported'))
  } catch (err) {
    logError('JSON export error:', err)
    error(t.value('errors.exportError'))
  }
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
    const pdfUrl = pdf.output('bloburl')
    window.open(pdfUrl, '_blank', 'noopener')
    success(t.value('success.exported'))
  } catch (err) {
    logError('PDF export error:', err)
    error(t.value('errors.exportError'))
  }
}

async function handleShare(): Promise<void> {
  const title = state.value.label || 'Jubiläumsrechner'
  const text = `Jubiläen: ${state.value.eventsView.length} Einträge`
  
  // Update URL with current state for sharing (without milestone IDs)
  // The milestones can be recalculated from the configuration parameters
  encodeStateToURL()
  
  // Get the current URL without milestone IDs
  const url = window.location.origin + window.location.pathname + '?' + new URLSearchParams(window.location.search).toString()
  
  if (isNativeShareAvailable()) {
    try {
      await navigator.share({
        title,
        text,
        url
      })
      success(t.value('success.shared'))
    } catch (err) {
      // User cancelled or error occurred
      if ((err as Error).name !== 'AbortError') {
        logError('Share failed:', err)
        error(t.value('errors.shareError'))
      }
    }
  } else {
    // Fallback: Copy URL to clipboard
    const copied = await copyToClipboard(url)
    
    if (copied) {
      success(t.value('success.linkCopied'))
    } else {
      error(t.value('errors.copyError'))
    }
  }
}
</script>
