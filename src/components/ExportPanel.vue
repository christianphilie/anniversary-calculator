<template>
  <div class="grid gap-4 px-1 pb-1">
    <p class="m-0 text-sm leading-relaxed text-muted-foreground">
      {{ t('export.description') }}
    </p>
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
    <Separator />
    <div class="grid grid-cols-2 gap-2">
      <div ref="icsHelpContainerRef" class="relative">
        <Button
          variant="outline"
          class="relative w-full h-auto min-h-13 justify-start gap-2.5 bg-muted/40 px-3 py-2.5 pr-10 text-left hover:bg-accent"
          :title="`${downloadTooltip} (Strg/Cmd + D)`"
          :aria-label="downloadTooltip"
          :disabled="exportCount === 0"
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
        <div class="absolute right-2.5 top-1/2 z-10 -translate-y-1/2">
          <span
            role="button"
            tabindex="0"
            :aria-label="t('export.icsHelpTitle')"
            :title="t('export.icsHelpTitle')"
            class="inline-flex h-4 w-4 cursor-pointer items-center justify-center text-muted-foreground/60 transition-colors hover:text-muted-foreground focus-visible:outline-none"
            @click.stop="toggleIcsHelp"
            @keydown.enter.prevent.stop="toggleIcsHelp"
            @keydown.space.prevent.stop="toggleIcsHelp"
          >
            <CircleHelp class="h-4 w-4" aria-hidden="true" />
          </span>
          <div
            v-if="showIcsHelp"
            class="absolute left-0 top-[calc(100%+0.5rem)] z-[100000] w-[min(22rem,calc(100vw-2rem))] rounded-lg border border-border bg-popover p-3 text-popover-foreground shadow-lg"
          >
            <button
              type="button"
              class="absolute right-2 top-2 inline-flex h-7 w-7 items-center justify-center rounded-sm text-muted-foreground hover:bg-accent"
              :aria-label="t('common.close')"
              @click.stop="showIcsHelp = false"
            >
              <X class="h-4 w-4" aria-hidden="true" />
            </button>
            <h3 class="mb-2 pr-8 text-sm font-semibold leading-none tracking-tight">{{ t('export.icsHelpTitle') }}</h3>
            <ol class="list-decimal space-y-1 pl-4 text-xs leading-relaxed text-muted-foreground">
              <li>{{ t('export.icsHelpStep1') }}</li>
              <li>{{ t('export.icsHelpStep2') }}</li>
              <li>{{ t('export.icsHelpStep3') }}</li>
              <li>{{ t('export.icsHelpStep4') }}</li>
            </ol>
          </div>
        </div>
      </div>
      <Button
        variant="outline"
        class="w-full h-auto min-h-13 justify-start gap-2.5 bg-muted/40 px-3 py-2.5 text-left hover:bg-accent"
        :title="`${t('export.exportPDF')} (${exportCount} ${t('common.selectAll').toLowerCase()})`"
        :aria-label="t('export.exportPDF')"
        :disabled="exportCount === 0"
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
        class="w-full h-auto min-h-13 justify-start gap-2.5 bg-muted/40 px-3 py-2.5 text-left hover:bg-accent"
        :title="`${t('export.exportCSV')} (${exportCount} ${t('common.selectAll').toLowerCase()})`"
        :aria-label="t('export.exportCSV')"
        :disabled="exportCount === 0"
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
        class="w-full h-auto min-h-13 justify-start gap-2.5 bg-muted/40 px-3 py-2.5 text-left hover:bg-accent"
        :title="`${t('export.exportJSON')} (${exportCount} ${t('common.selectAll').toLowerCase()})`"
        :aria-label="t('export.exportJSON')"
        :disabled="exportCount === 0"
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
    <div class="flex items-center justify-between gap-3 rounded-md border border-border/70 bg-muted/35 px-3 py-2">
      <div class="inline-flex items-center gap-2">
        <button
          type="button"
          role="switch"
          :aria-checked="exportOnlyFavorites"
          :aria-label="t('export.onlyFavorites')"
          class="relative inline-flex h-6 w-11 items-center rounded-full border border-border/70 bg-muted transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60"
          :class="exportOnlyFavorites ? 'bg-black border-black' : 'bg-muted'"
          @click="exportOnlyFavorites = !exportOnlyFavorites"
        >
          <span
            class="inline-block h-4 w-4 rounded-full bg-background shadow-sm transition-transform duration-200"
            :class="exportOnlyFavorites ? 'translate-x-5' : 'translate-x-1'"
          />
        </button>
        <span class="text-xs font-medium text-muted-foreground">
          {{ t('export.onlyFavorites') }}
        </span>
      </div>
      <Badge
        variant="outline"
        class="h-5 min-w-5 rounded-full px-1.5 text-[11px] tabular-nums text-muted-foreground"
      >
        {{ favoriteEvents.length }}
      </Badge>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Braces, Calendar, CircleHelp, FileText, Link, Table, X } from 'lucide-vue-next'
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

const { state, favoriteEvents } = useAppState()
const { encodeStateToURL } = useUrlState(state)
const { success, error } = useToast()
const { locale, t } = useI18n()
const showIcsHelp = ref(false)
const icsHelpContainerRef = ref<HTMLElement | null>(null)

function toggleIcsHelp(): void {
  showIcsHelp.value = !showIcsHelp.value
}

function handleDocumentClick(event: MouseEvent): void {
  const target = event.target
  if (!(target instanceof Node)) return
  if (!icsHelpContainerRef.value?.contains(target)) {
    showIcsHelp.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleDocumentClick)
})

onUnmounted(() => {
  document.removeEventListener('click', handleDocumentClick)
})
const exportOnlyFavorites = computed({
  get: () => state.value.exportOnlyFavorites,
  set: (value: boolean) => {
    state.value.exportOnlyFavorites = value
  }
})

const exportEvents = computed(() => {
  return exportOnlyFavorites.value ? favoriteEvents.value : state.value.eventsView
})

const exportCount = computed(() => exportEvents.value.length)

const downloadTooltip = computed(() => {
  const n = exportCount.value
  if (n === 0) {
    return t.value('results.downloadTooltipNone')
  }
  return t.value('results.downloadTooltip', {
    count: n.toString(),
    plural: n === 1 ? '' : 'se'
  })
})

function handleDownloadICS(): void {
  const events = exportEvents.value
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
  const events = exportEvents.value
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
  const events = exportEvents.value
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
  const events = exportEvents.value
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
