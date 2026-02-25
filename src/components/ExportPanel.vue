<template>
  <Card data-panel-shell>
    <CardHeader
      data-panel-header
      class="sticky top-[var(--sticky-panel-header-top)] z-20 h-12 flex flex-row items-center justify-between gap-3 space-y-0 border-b border-border bg-card/95 px-4 py-2 backdrop-blur supports-[backdrop-filter]:bg-card/80"
    >
      <div class="inline-flex min-w-0 items-center gap-2">
        <Download class="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
        <span class="text-sm font-semibold tracking-tight text-foreground">{{ t('export.title') }}</span>
      </div>
      <ICSImportHelp />
    </CardHeader>
    <CardContent class="grid gap-4 p-4">
      <p class="m-0 text-sm leading-relaxed text-muted-foreground">
        {{ t('export.description') }}
      </p>
      <Separator />
      <div class="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            class="h-auto min-h-13 justify-start gap-2.5 bg-muted/40 px-3 py-2.5 text-left hover:bg-accent"
            :title="`${downloadTooltip} (Strg/Cmd + D)`"
            :aria-label="downloadTooltip"
            :disabled="state.eventsView.length === 0"
            @click="handleDownloadICS"
          >
            <span
              class="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-border bg-background text-muted-foreground"
              aria-hidden="true"
            >
              <Calendar />
            </span>
            <span class="text-xs font-medium">ICS</span>
          </Button>
          <Button
            variant="outline"
            class="h-auto min-h-13 justify-start gap-2.5 bg-muted/40 px-3 py-2.5 text-left hover:bg-accent"
            :title="`${t('export.exportPDF')} (${state.eventsView.length} ${t('common.selectAll').toLowerCase()})`"
            :aria-label="t('export.exportPDF')"
            :disabled="state.eventsView.length === 0"
            @click="handleDownloadPDF"
          >
            <span
              class="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-border bg-background text-muted-foreground"
              aria-hidden="true"
            >
              <FileText />
            </span>
            <span class="text-xs font-medium">PDF</span>
          </Button>
          <Button
            variant="outline"
            class="h-auto min-h-13 justify-start gap-2.5 bg-muted/40 px-3 py-2.5 text-left hover:bg-accent"
            :title="`${t('export.exportCSV')} (${state.eventsView.length} ${t('common.selectAll').toLowerCase()})`"
            :aria-label="t('export.exportCSV')"
            :disabled="state.eventsView.length === 0"
            @click="handleDownloadCSV"
          >
            <span
              class="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-border bg-background text-muted-foreground"
              aria-hidden="true"
            >
              <Table />
            </span>
            <span class="text-xs font-medium">CSV</span>
          </Button>
          <Button
            variant="outline"
            class="h-auto min-h-13 justify-start gap-2.5 bg-muted/40 px-3 py-2.5 text-left hover:bg-accent"
            :title="`${t('export.exportJSON')} (${state.eventsView.length} ${t('common.selectAll').toLowerCase()})`"
            :aria-label="t('export.exportJSON')"
            :disabled="state.eventsView.length === 0"
            @click="handleDownloadJSON"
          >
            <span
              class="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-border bg-background text-muted-foreground"
              aria-hidden="true"
            >
              <Braces />
            </span>
            <span class="text-xs font-medium">JSON</span>
          </Button>
      </div>
      <div class="w-full">
        <Button
          variant="secondary"
          class="w-full justify-center"
          :title="t('export.shareViewTitle')"
          :aria-label="t('export.shareViewTitle')"
          @click="handleShare"
        >
          <span class="inline-flex items-center justify-center" aria-hidden="true">
            <Link />
          </span>
          {{ t('export.shareView') }}
        </Button>
      </div>
    </CardContent>
  </Card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Braces, Calendar, Download, FileText, Link, Table } from 'lucide-vue-next'
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
