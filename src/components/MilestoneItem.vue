<template>
  <div
    :class="cn(
      'group flex min-w-0 items-center gap-3 rounded-md border p-3 transition-colors',
      rowClass
    )"
    :data-year="event.date.getFullYear()"
    role="listitem"
  >
    <Button
      variant="ghost"
      size="icon"
      :class="cn(
        'h-8 w-8 shrink-0',
        favoriteButtonClass,
        isEventFavorite && favoriteButtonActiveClass
      )"
      :aria-label="isEventFavorite ? t('favorites.remove') : t('favorites.add')"
      :title="isEventFavorite ? t('favorites.remove') : t('favorites.add')"
      @click="toggleFavorite(event.id)"
    >
      <Bookmark :fill="isEventFavorite ? 'currentColor' : 'none'" />
    </Button>
    <div class="min-w-0 flex-1">
      <div :class="cn('text-[15px] font-semibold leading-tight', titleClass)">
        <span>{{ event.baseTitle }}</span>
        <span v-if="hasCustomLabel && event.since?.trim()" :class="cn('ml-1 font-normal', secondaryTextClass)">
          {{ event.since }}
        </span>
      </div>
      <div :class="cn('mt-0.5 break-words text-xs leading-snug', secondaryTextClass)">
        {{ formatDate(event.date) }} • {{ event.inHuman }}
      </div>
    </div>
    <div class="ml-auto inline-flex shrink-0 items-center">
      <Button
        variant="ghost"
        size="icon"
        :class="cn(
          'h-8 w-8 invisible bg-transparent opacity-0 transition-opacity duration-150 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100',
          copyButtonClass
        )"
        :aria-label="`${event.baseTitle} ${t('common.copy')}`"
        :title="`${t('common.copy')} (Strg/Cmd + C)`"
        @click="handleCopy"
      >
        <Copy />
      </Button>
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
import { useAppState } from '../composables/useAppState'
import { useI18n } from '../i18n'
import { Button } from '@/components/ui/button'
import { Bookmark, Copy } from 'lucide-vue-next'
import { UNIT_COLOR_CLASSES } from '../constants/unitColors'

const props = defineProps<{
  event: MilestoneEvent
}>()

const { state, toggleFavorite, isFavorite } = useAppState()
const { success, error } = useToast()
const { locale, t } = useI18n()

const hasCustomLabel = computed(() => Boolean(state.value.label.trim()))

const rowClass = computed(() => cn(
  UNIT_COLOR_CLASSES[props.event.unit].surface
))

const titleClass = computed(() => UNIT_COLOR_CLASSES[props.event.unit].textPrimary)
const secondaryTextClass = computed(() => UNIT_COLOR_CLASSES[props.event.unit].textSecondary)
const copyButtonClass = computed(() => UNIT_COLOR_CLASSES[props.event.unit].copyButton)
const favoriteButtonClass = computed(() => UNIT_COLOR_CLASSES[props.event.unit].favoriteButton)
const favoriteButtonActiveClass = computed(() => UNIT_COLOR_CLASSES[props.event.unit].favoriteButtonActive)
const isEventFavorite = computed(() => isFavorite(props.event.id))

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
