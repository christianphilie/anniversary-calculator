<template>
  <div class="year-sep" :id="`y-${year}`" :data-year="year" role="separator" :aria-label="`${t('results.year')} ${year}`">
    <input
      type="checkbox"
      :checked="allSelected"
      :indeterminate="someSelected"
      :aria-label="t('results.selectYearAll', { year: year.toString() })"
      @change="handleToggle"
      class="year-checkbox"
    />
    <span class="y">{{ year }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from '../i18n'
import { useAppState } from '../composables/useAppState'

const props = defineProps<{
  year: number
}>()

defineEmits<{
  'select-all': []
  'select-none': []
}>()

const { t } = useI18n()
const { state } = useAppState()

const eventsInYear = computed(() => {
  return state.value.eventsView.filter(ev => ev.date.getFullYear() === props.year)
})

const allSelected = computed(() => {
  if (eventsInYear.value.length === 0) return false
  return eventsInYear.value.every(ev => state.value.selected.has(ev.id))
})

const someSelected = computed(() => {
  if (eventsInYear.value.length === 0) return false
  const selectedCount = eventsInYear.value.filter(ev => state.value.selected.has(ev.id)).length
  return selectedCount > 0 && selectedCount < eventsInYear.value.length
})

function handleToggle(event: Event): void {
  const target = event.target as HTMLInputElement
  if (target.checked) {
    eventsInYear.value.forEach(ev => state.value.selected.add(ev.id))
  } else {
    eventsInYear.value.forEach(ev => state.value.selected.delete(ev.id))
  }
}
</script>
