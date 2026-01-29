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
        <span class="ttl-num">{{ event.baseTitle }}</span>
        <span class="since"> {{ event.since }}</span>
      </div>
      <div class="sub">{{ formatDate(event.date) }} • {{ event.inHuman }}</div>
    </div>
    <span :class="['tag', event.unit]">{{ unitLabel }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { MilestoneEvent } from '../types'
import { fmtFull } from '../utils/i18n'

const props = defineProps<{
  event: MilestoneEvent
  checked: boolean
}>()

defineEmits<{
  toggle: []
}>()

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
</script>
