<template>
  <div class="item" :data-year="event.date.getFullYear()" role="listitem">
    <input
      type="checkbox"
      :checked="checked"
      :aria-label="`${event.baseTitle} ${event.since} auswählen`"
      @change="$emit('toggle')"
    />
    <div class="grow">
      <div class="when">
        <span class="ttl-num">{{ event.baseTitle }}</span> <span class="since">{{ event.since }}</span>
      </div>
      <div class="sub">{{ formatDate(event.date) }} • {{ event.inHuman }}</div>
    </div>
    <div class="item-actions">
      <button
        class="btn-icon"
        :aria-label="`${event.baseTitle} kopieren`"
        title="Kopieren (Strg/Cmd + C)"
        @click="handleCopy"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
        </svg>
      </button>
      <button
        class="btn-icon"
        :aria-label="`${event.baseTitle} teilen`"
        title="Teilen"
        @click="handleShare"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="18" cy="5" r="3"></circle>
          <circle cx="6" cy="12" r="3"></circle>
          <circle cx="18" cy="19" r="3"></circle>
          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
          <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
        </svg>
      </button>
      <span :class="['tag', event.unit]">{{ unitLabel }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { MilestoneEvent } from '../types'
import { fmtFull } from '../utils/i18n'
import { copyToClipboard, formatMilestoneText } from '../utils/clipboard'
import { generateShareUrl, shareMilestones, isNativeShareAvailable } from '../utils/share'
import { useToast } from '../composables/useToast'
import { useAppState } from '../composables/useAppState'
import { useUrlState } from '../composables/useUrlState'

const props = defineProps<{
  event: MilestoneEvent
  checked: boolean
}>()

defineEmits<{
  toggle: []
}>()

const { state } = useAppState()
const { success, error } = useToast()
const { encodeStateToURL } = useUrlState(state)

const unitLabel = computed(() => {
  const labels: Record<MilestoneEvent['unit'], string> = {
    years: 'Jahre',
    months: 'Monate',
    weeks: 'Wochen',
    days: 'Tage',
    hours: 'Stunden',
    minutes: 'Minuten',
    seconds: 'Sekunden'
  }
  return labels[props.event.unit]
})

function formatDate(date: Date): string {
  return fmtFull.format(date) + ' Uhr'
}

async function handleCopy(): Promise<void> {
  const text = formatMilestoneText(props.event, state.value.label)
  const copied = await copyToClipboard(text)
  
  if (copied) {
    success('Meilenstein kopiert')
  } else {
    error('Fehler beim Kopieren')
  }
}

async function handleShare(): Promise<void> {
  const title = `${props.event.baseTitle} ${props.event.since}`
  const text = formatMilestoneText(props.event, state.value.label)
  
  if (isNativeShareAvailable()) {
    const shared = await shareMilestones([props.event.id], title, text)
    if (shared) {
      success('Geteilt')
    }
  } else {
    // Fallback: Copy URL to clipboard
    const url = generateShareUrl([props.event.id])
    encodeStateToURL() // Update URL with current state first
    const copied = await copyToClipboard(url)
    
    if (copied) {
      success('Link kopiert')
    } else {
      error('Fehler beim Kopieren')
    }
  }
}
</script>
