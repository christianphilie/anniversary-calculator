<template>
  <div
    class="group flex min-w-0 items-center gap-3 rounded-md border border-border bg-background p-3 transition-colors hover:bg-accent/50"
    :data-year="event.date.getFullYear()"
    role="listitem"
  >
    <div class="min-w-0 flex-1">
      <div class="text-[15px] font-semibold leading-tight text-foreground">
        <span>{{ event.baseTitle }}</span>
        <span v-if="event.since?.trim()" class="ml-1 font-normal text-muted-foreground">{{ event.since }}</span>
      </div>
      <div class="mt-0.5 break-words text-xs leading-snug text-muted-foreground">
        {{ formatDate(event.date) }} • {{ event.inHuman }}
      </div>
    </div>
    <div class="ml-auto inline-flex shrink-0 items-center gap-2">
      <Button
        variant="outline"
        size="icon"
        class="h-8 w-8"
        :aria-label="`${event.baseTitle} ${t('common.copy')}`"
        :title="`${t('common.copy')} (Strg/Cmd + C)`"
        @click="handleCopy"
      >
        <Copy />
      </Button>
      <Badge variant="outline" :class="unitBadgeClass">{{ unitLabel }}</Badge>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '@/lib/utils'
import type { MilestoneEvent } from '../types'
import { getDateFormatter } from '../utils/i18n'
import { copyToClipboard, formatMilestoneText } from '../utils/clipboard'
import { useToast } from '../composables/useToast'
import { useI18n } from '../i18n'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Copy } from 'lucide-vue-next'

const props = defineProps<{
  event: MilestoneEvent
}>()

const { success, error } = useToast()
const { locale, t } = useI18n()

const unitLabel = computed(() => {
  return t.value(`units.${props.event.unit}`)
})

const unitBadgeClass = computed(() => cn(
  'uppercase tracking-wide',
  props.event.unit === 'years' && 'border-red-500/20 text-red-600 dark:border-red-400/30 dark:text-red-300',
  props.event.unit === 'months' && 'border-orange-500/20 text-orange-600 dark:border-orange-400/30 dark:text-orange-300',
  props.event.unit === 'weeks' && 'border-amber-500/20 text-amber-600 dark:border-amber-400/30 dark:text-amber-300',
  props.event.unit === 'days' && 'border-lime-500/20 text-lime-700 dark:border-lime-400/30 dark:text-lime-300',
  props.event.unit === 'hours' && 'border-emerald-500/20 text-emerald-600 dark:border-emerald-400/30 dark:text-emerald-300',
  props.event.unit === 'minutes' && 'border-cyan-500/20 text-cyan-600 dark:border-cyan-400/30 dark:text-cyan-300',
  props.event.unit === 'seconds' && 'border-blue-500/20 text-blue-600 dark:border-blue-400/30 dark:text-blue-300'
))

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
