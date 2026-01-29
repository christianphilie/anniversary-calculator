<template>
  <div class="seg" role="group" aria-label="Darstellung">
    <button
      v-for="mode in modes"
      :key="mode.value"
      :data-mode="mode.value"
      :aria-pressed="themeMode === mode.value"
      :aria-label="`Theme: ${mode.label}`"
      :title="mode.title"
      @click="applyTheme(mode.value)"
      @keydown.arrow-left="handleArrowLeft(mode.value)"
      @keydown.arrow-right="handleArrowRight(mode.value)"
    >
      <span aria-hidden="true">{{ mode.icon }}</span> {{ mode.label }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { useTheme } from '../composables/useTheme'
import type { ThemeMode } from '../composables/useTheme'

const { themeMode, applyTheme } = useTheme()

const modes: Array<{ value: ThemeMode; icon: string; label: string; title: string }> = [
  { value: 'light', icon: '☀️', label: 'Hell', title: 'Hell' },
  { value: 'dark', icon: '🌙', label: 'Dunkel', title: 'Dunkel' },
  { value: 'system', icon: '💻', label: 'System', title: 'System' }
]

function handleArrowLeft(currentMode: ThemeMode): void {
  const currentIndex = modes.findIndex(m => m.value === currentMode)
  if (currentIndex > 0) {
    applyTheme(modes[currentIndex - 1].value)
  }
}

function handleArrowRight(currentMode: ThemeMode): void {
  const currentIndex = modes.findIndex(m => m.value === currentMode)
  if (currentIndex < modes.length - 1) {
    applyTheme(modes[currentIndex + 1].value)
  }
}
</script>
