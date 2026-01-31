<template>
  <div class="year-sep" :id="`y-${year}`" :data-year="year" role="separator" :aria-label="`${t('results.year')} ${year}`">
    <button
      v-if="hasPreviousYear"
      class="year-nav-btn year-nav-up"
      type="button"
      @click="$emit('jump-to-year', previousYear)"
      :aria-label="`${t('form.jumpToYear')}: ${previousYear}`"
      :title="`${previousYear}`"
    >
      ↑
    </button>
    <span v-else class="year-nav-placeholder"></span>
    <span class="y">{{ year }}</span>
    <button
      v-if="hasNextYear"
      class="year-nav-btn year-nav-down"
      type="button"
      @click="$emit('jump-to-year', nextYear)"
      :aria-label="`${t('form.jumpToYear')}: ${nextYear}`"
      :title="`${nextYear}`"
    >
      ↓
    </button>
    <span v-else class="year-nav-placeholder"></span>
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
  'jump-to-year': [year: number]
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
</script>

<style scoped>
.year-sep {
  display: flex !important;
  align-items: center;
  gap: 8px;
  justify-content: center;
}

.year-nav-btn {
  background: transparent;
  border: 1px solid var(--border);
  color: var(--muted);
  border-radius: var(--radius);
  padding: 4px 8px;
  font-size: 12px;
  cursor: pointer;
  transition: var(--transition);
  min-width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.year-nav-btn:hover {
  background: var(--panel);
  border-color: var(--brand);
  color: var(--text);
}

.year-nav-btn:focus-visible {
  outline: none;
  box-shadow: var(--focus);
}

.year-nav-placeholder {
  min-width: 28px;
  height: 28px;
  flex-shrink: 0;
}
</style>

