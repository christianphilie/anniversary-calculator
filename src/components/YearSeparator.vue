<template>
  <div
    class="mt-4 mb-2 flex items-center justify-between gap-2 border-b border-border pb-2 first:mt-0"
    :id="`y-${year}`"
    role="separator"
    :aria-label="`${t('results.year')} ${year}`"
  >
    <Button
      v-if="isFirst && canAddPreviousYears"
      variant="ghost"
      size="sm"
      class="h-7 px-2 text-xs"
      @click="$emit('add-previous-years')"
      :aria-label="t('form.loadMore')"
    >
      {{ t('form.loadMore') }}
    </Button>
    <Button
      v-else-if="hasPreviousYear"
      variant="outline"
      size="icon"
      class="h-7 w-7"
      @click="$emit('jump-to-year', previousYear)"
      :aria-label="`${t('form.jumpToYear')}: ${previousYear}`"
    >
      <ChevronUp class="h-3.5 w-3.5" aria-hidden="true" />
    </Button>
    <span v-else class="h-7 w-7 shrink-0" />
    <span class="flex-1 text-center text-sm font-semibold text-muted-foreground">{{ year }}</span>
    <Button
      v-if="isLast && canAddNextYears"
      variant="ghost"
      size="sm"
      class="h-7 px-2 text-xs"
      @click="$emit('add-next-years')"
      :aria-label="t('form.loadMore')"
    >
      {{ t('form.loadMore') }}
    </Button>
    <Button
      v-else-if="hasNextYear"
      variant="outline"
      size="icon"
      class="h-7 w-7"
      @click="$emit('jump-to-year', nextYear)"
      :aria-label="`${t('form.jumpToYear')}: ${nextYear}`"
    >
      <ChevronDown class="h-3.5 w-3.5" aria-hidden="true" />
    </Button>
    <span v-else class="h-7 w-7 shrink-0" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { ChevronDown, ChevronUp } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { useI18n } from '../i18n'
import { useAppState } from '../composables/useAppState'
import { CONFIG } from '../types'

const props = defineProps<{
  year: number
  isFirst?: boolean
  isLast?: boolean
}>()

defineEmits<{
  'jump-to-year': [year: number]
  'add-previous-years': []
  'add-next-years': []
}>()

const { t } = useI18n()
const { state } = useAppState()

const availableYears = computed(() => {
  const years = new Set<number>()
  state.value.eventsView.forEach(ev => {
    years.add(ev.date.getFullYear())
  })
  return Array.from(years).sort((a, b) => a - b)
})

const currentIndex = computed(() => {
  return availableYears.value.indexOf(props.year)
})

const hasPreviousYear = computed(() => {
  return currentIndex.value > 0
})

const hasNextYear = computed(() => {
  return currentIndex.value >= 0 && currentIndex.value < availableYears.value.length - 1
})

const previousYear = computed(() => {
  if (!hasPreviousYear.value) return props.year
  return availableYears.value[currentIndex.value - 1]
})

const nextYear = computed(() => {
  if (!hasNextYear.value) return props.year
  return availableYears.value[currentIndex.value + 1]
})

const startYear = computed(() => {
  if (!state.value.start) return new Date().getFullYear()
  return state.value.start.getFullYear()
})

const canAddPreviousYears = computed(() => {
  if (!state.value.yearFrom) return false
  const currentYear = new Date().getFullYear()
  const dateYear = startYear.value
  const minPossibleYear = Math.min(dateYear, currentYear)
  return state.value.yearFrom > minPossibleYear
})

const canAddNextYears = computed(() => {
  if (!state.value.yearTo) return false
  const currentYear = new Date().getFullYear()
  const maxYearTo = currentYear + CONFIG.MAX_YEARS_IN_FUTURE
  return state.value.yearTo < maxYearTo
})
</script>
