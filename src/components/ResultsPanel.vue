<template>
  <section class="panel">
    <!-- Export Section -->
    <div class="hd">
      <strong>📤 {{ t('export.title') }}</strong>
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
            :disabled="visibleSelected.length === 0"
            @click="handleDownloadICS"
          >
            📅 ICS
          </button>
          <button
            class="btn primary"
            :title="`${t('export.exportCSV')} (${visibleSelected.length} ${t('common.selectAll').toLowerCase()})`"
            :aria-label="t('export.exportCSV')"
            :disabled="visibleSelected.length === 0"
            @click="handleDownloadCSV"
          >
            📊 CSV
          </button>
          <button
            class="btn primary"
            :title="`${t('export.exportJSON')} (${visibleSelected.length} ${t('common.selectAll').toLowerCase()})`"
            :aria-label="t('export.exportJSON')"
            :disabled="visibleSelected.length === 0"
            @click="handleDownloadJSON"
          >
            📄 JSON
          </button>
          <button
            class="btn primary"
            :title="t('export.exportPDFDisabled')"
            :aria-label="t('export.exportPDF')"
            disabled
          >
            📑 PDF
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

    <!-- Milestones Section -->
    <div class="hd milestones-header">
      <strong>📊 {{ t('export.milestonesTitle') }}</strong>
      <label class="milestones-checkbox-label">
        <span>{{ t('results.selectAll') }}</span>
        <input
          type="checkbox"
          :checked="allSelected"
          :indeterminate="someSelected"
          :aria-label="t('results.selectAll')"
          :title="`${t('results.selectAll')} (Strg/Cmd + A)`"
          @change="toggleSelectAll"
        />
      </label>
    </div>
    <div class="bd">
      <div v-if="isLoading" class="empty" role="status" aria-live="polite" aria-busy="true">
        <div class="loading" aria-hidden="true"></div> {{ t('results.loading') }}
      </div>
      <div v-else-if="!state.eventsView.length" class="empty" role="status" aria-live="polite">
        {{ t('results.empty') }}
      </div>
      <div v-else class="list" role="list" aria-label="Jubiläen">
        <template v-for="(ev, idx) in state.eventsView" :key="ev.id">
          <YearSeparator
            v-if="shouldShowYearSeparator(idx, ev.date.getFullYear())"
            :year="ev.date.getFullYear()"
          />
          <MilestoneItem
            :event="ev"
            :checked="state.selected.has(ev.id)"
            @toggle="toggleSelection(ev.id)"
          />
        </template>
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
import { exportToCSV, exportToJSON, downloadFile } from '../utils/export'
import { generateShareUrl, shareMilestones, isNativeShareAvailable } from '../utils/share'
import { copyToClipboard } from '../utils/clipboard'
import YearSeparator from './YearSeparator.vue'
import MilestoneItem from './MilestoneItem.vue'

const { state, isLoading, visibleSelected, selectAll, selectNone, toggleSelection } = useAppState()
const { encodeStateToURL } = useUrlState(state)
const { success, error } = useToast()
const { t } = useI18n()

const downloadTooltip = computed(() => {
  const n = visibleSelected.value.length
  if (n === 0) {
    return t.value('results.downloadTooltipNone')
  }
  return t.value('results.downloadTooltip', {
    count: n.toString(),
    plural: n === 1 ? '' : 'se'
  })
})

const allSelected = computed(() => {
  if (state.value.eventsView.length === 0) return false
  return state.value.eventsView.every(ev => state.value.selected.has(ev.id))
})

const someSelected = computed(() => {
  if (state.value.eventsView.length === 0) return false
  const selectedCount = state.value.eventsView.filter(ev => state.value.selected.has(ev.id)).length
  return selectedCount > 0 && selectedCount < state.value.eventsView.length
})

function toggleSelectAll(event: Event): void {
  const target = event.target as HTMLInputElement
  if (target.checked) {
    selectAll()
  } else {
    selectNone()
  }
}

function shouldShowYearSeparator(index: number, year: number): boolean {
  if (index === 0) return true
  const prevYear = state.value.eventsView[index - 1]?.date.getFullYear()
  return prevYear !== year
}

function handleDownloadICS(): void {
  const subset = visibleSelected.value
  if (!subset.length) return

  const ics = buildICS(subset)
  const label = (state.value.label || 'Jubilaeum').toLowerCase().replace(/\s+/g, '_')
  downloadICS(`${label}_auswahl.ics`, ics)
}

function handleDownloadCSV(): void {
  const subset = visibleSelected.value
  if (!subset.length) return

  const csv = exportToCSV(subset)
  const label = (state.value.label || 'Jubilaeum').toLowerCase().replace(/\s+/g, '_')
  downloadFile(`${label}_auswahl.csv`, csv, 'text/csv;charset=utf-8')
}

function handleDownloadJSON(): void {
  const subset = visibleSelected.value
  if (!subset.length) return

  const json = exportToJSON(subset)
  const label = (state.value.label || 'Jubilaeum').toLowerCase().replace(/\s+/g, '_')
  downloadFile(`${label}_auswahl.json`, json, 'application/json;charset=utf-8')
}

async function handleShare(): Promise<void> {
  const milestoneIds = state.value.eventsView.map(ev => ev.id)
  const title = state.value.label || 'Jubiläumsrechner'
  const text = `Jubiläen: ${state.value.eventsView.length} Einträge`
  
  // Update URL with current state first
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
