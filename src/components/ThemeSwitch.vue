<template>
  <div class="seg" role="group" :aria-label="t('theme.switch')">
    <button
      v-for="mode in modes"
      :key="mode.value"
      :data-mode="mode.value"
      :aria-pressed="themeMode === mode.value"
      :aria-label="`${t('theme.switch')}: ${mode.label}`"
      :title="mode.title + (mode.value === themeMode ? ` (${t('common.shortcut')})` : '')"
      @click="applyTheme(mode.value)"
      @keydown.arrow-left="handleArrowLeft(mode.value)"
      @keydown.arrow-right="handleArrowRight(mode.value)"
    >
      <span aria-hidden="true">{{ mode.icon }}</span> {{ mode.label }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useTheme } from '../composables/useTheme'
import { useI18n } from '../i18n'
import type { ThemeMode } from '../composables/useTheme'

const { themeMode, applyTheme } = useTheme()
const { t } = useI18n()

const modes = computed((): Array<{ value: ThemeMode; icon: string; label: string; title: string }> => [
  { value: 'light', icon: '☀️', label: t.value('theme.light'), title: t.value('theme.light') },
  { value: 'dark', icon: '🌙', label: t.value('theme.dark'), title: t.value('theme.dark') },
  { value: 'system', icon: '💻', label: t.value('theme.system'), title: t.value('theme.system') }
])

function handleArrowLeft(currentMode: ThemeMode): void {
  const modesArray = modes.value
  const currentIndex = modesArray.findIndex((m: { value: ThemeMode }) => m.value === currentMode)
  if (currentIndex > 0) {
    applyTheme(modesArray[currentIndex - 1].value)
  }
}

function handleArrowRight(currentMode: ThemeMode): void {
  const modesArray = modes.value
  const currentIndex = modesArray.findIndex((m: { value: ThemeMode }) => m.value === currentMode)
  if (currentIndex < modesArray.length - 1) {
    applyTheme(modesArray[currentIndex + 1].value)
  }
}
</script>
