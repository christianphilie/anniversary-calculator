<template>
  <div class="seg" role="group" aria-label="Darstellung">
    <button
      v-for="mode in modes"
      :key="mode.value"
      :data-mode="mode.value"
      :aria-pressed="themeMode === mode.value"
      :title="mode.title"
      @click="applyTheme(mode.value)"
    >
      {{ mode.icon }} {{ mode.label }}
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
</script>
