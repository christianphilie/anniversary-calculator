<template>
  <header>
    <div class="title">
      <div class="logo" aria-hidden="true">🎉</div>
      <div>
        <h1>{{ t('ui.title') }}</h1>
        <div class="muted">{{ t('ui.description') }}</div>
      </div>
    </div>
    <div class="header-controls">
      <LanguageSwitch />
      <ThemeSwitch />
    </div>
  </header>
</template>

<script setup lang="ts">
import { watch } from 'vue'
import ThemeSwitch from './ThemeSwitch.vue'
import LanguageSwitch from './LanguageSwitch.vue'
import { useI18n } from '../i18n'
import { updateFormatters } from '../utils/i18n'

const { locale, t } = useI18n()

// Update formatters when locale changes
watch(locale, (newLocale) => {
  updateFormatters(newLocale)
}, { immediate: true })
</script>

<style scoped>
.header-controls {
  display: flex;
  gap: 12px;
  align-items: center;
}
</style>
