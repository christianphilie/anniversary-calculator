<template>
  <section class="panel">
    <div class="hd">
      <strong>📊 Meilensteine</strong>
      <div class="toolbar" style="width:100%">
        <button
          class="btn secondary"
          title="Alle sichtbaren Einträge auswählen"
          aria-label="Alle sichtbaren Einträge auswählen"
          @click="selectAll"
        >
          ✅ Alle auswählen
        </button>
        <button
          class="btn secondary"
          title="Auswahl sichtbarer Einträge aufheben"
          aria-label="Auswahl sichtbarer Einträge aufheben"
          @click="selectNone"
        >
          🚫 Alle abwählen
        </button>
        <button
          class="btn primary push-right"
          :title="downloadTooltip"
          :aria-label="downloadTooltip"
          :disabled="visibleSelected.length === 0"
          @click="handleDownload"
        >
          📅 Kalenderdatei herunterladen
        </button>
      </div>
    </div>

    <div class="bd">
      <div v-if="isLoading" class="empty" role="status" aria-live="polite" aria-busy="true">
        <div class="loading" aria-hidden="true"></div> Berechne Meilensteine...
      </div>
      <div v-else-if="!state.eventsView.length" class="empty" role="status" aria-live="polite">
        Keine Einträge im Zeitraum. Passe Einheiten/Muster oder den Jahresbereich an.
      </div>
      <div v-else class="list" role="list" aria-label="Meilensteine">
        <template v-for="(ev, idx) in state.eventsView" :key="ev.id">
          <YearSeparator
            v-if="shouldShowYearSeparator(idx, ev.date.getFullYear())"
            :year="ev.date.getFullYear()"
            @select-all="selectYear(ev.date.getFullYear(), true)"
            @select-none="selectYear(ev.date.getFullYear(), false)"
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
import { buildICS, downloadICS } from '../utils/ics'
import YearSeparator from './YearSeparator.vue'
import MilestoneItem from './MilestoneItem.vue'

const { state, isLoading, visibleSelected, selectAll, selectNone, toggleSelection, selectYear } = useAppState()

const downloadTooltip = computed(() => {
  const n = visibleSelected.value.length
  return n
    ? `Kalenderdatei für ${n} Ereignis${n === 1 ? '' : 'se'} im .ics-Format herunterladen`
    : 'Keine ausgewählten sichtbaren Einträge'
})

function shouldShowYearSeparator(index: number, year: number): boolean {
  if (index === 0) return true
  const prevYear = state.value.eventsView[index - 1]?.date.getFullYear()
  return prevYear !== year
}

function handleDownload(): void {
  const subset = visibleSelected.value
  if (!subset.length) return

  const ics = buildICS(subset)
  const label = (state.value.label || 'Jubilaeum').toLowerCase().replace(/\s+/g, '_')
  downloadICS(`${label}_auswahl.ics`, ics)
}
</script>
