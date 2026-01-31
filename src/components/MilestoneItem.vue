<template>
  <div class="item" :data-year="event.date.getFullYear()" role="listitem">
    <div class="grow">
      <div class="when">
        <span class="ttl-num">{{ event.baseTitle }}</span> <span class="since">{{ event.since }}</span>
      </div>
      <div class="sub">{{ formatDate(event.date) }} • {{ event.inHuman }}</div>
    </div>
    <div class="item-actions">
      <button
        class="btn-icon"
        :aria-label="`${event.baseTitle} ${t('common.copy')}`"
        :title="`${t('common.copy')} (Strg/Cmd + C)`"
        @click="handleCopy"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
        </svg>
      </button>
      <span :class="['tag', event.unit]">{{ unitLabel }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { MilestoneEvent } from '../types'
import { getDateFormatter } from '../utils/i18n'
import { copyToClipboard, formatMilestoneText } from '../utils/clipboard'
import { useToast } from '../composables/useToast'
import { useI18n } from '../i18n'

const props = defineProps<{
  event: MilestoneEvent
}>()

const { success, error } = useToast()
const { locale, t } = useI18n()

const unitLabel = computed(() => {
  return t.value(`units.${props.event.unit}`)
})

// Create formatter that reacts to locale changes
const dateFormatter = computed(() => getDateFormatter(locale.value))

const formatDate = computed(() => {
  return (date: Date): string => {
    const formatted = dateFormatter.value.format(date)
    // Add "Uhr" for German, "o'clock" or similar for English
    return locale.value === 'de' ? `${formatted} Uhr` : formatted
  }
})

async function handleCopy(): Promise<void> {
  const text = formatMilestoneText(props.event)
  const copied = await copyToClipboard(text)
  
  if (copied) {
    success(t.value('success.copied'))
  } else {
    error(t.value('errors.copyError'))
  }
}

</script>
