<template>
  <div class="lang-switch" role="group" aria-label="Sprache">
    <button
      v-for="lang in languages"
      :key="lang.value"
      :class="['lang-btn', { active: locale === lang.value }]"
      :aria-pressed="locale === lang.value"
      :aria-label="`Sprache: ${lang.label}`"
      :title="lang.label"
      @click="setLocale(lang.value)"
    >
      {{ lang.flag }} {{ lang.label }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from '../i18n'
import type { Locale } from '../i18n'

const { locale, setLocale } = useI18n()

const languages: Array<{ value: Locale; label: string; flag: string }> = [
  { value: 'de', label: 'DE', flag: '🇩🇪' },
  { value: 'en', label: 'EN', flag: '🇬🇧' }
]
</script>

<style scoped>
.lang-switch {
  display: inline-flex;
  gap: 0;
  background: var(--panel);
  border: 1px solid var(--border);
  border-radius: 999px;
  overflow: hidden;
  padding: 4px;
  box-shadow: var(--shadow-sm);
}

.lang-btn {
  border: 0;
  background: transparent;
  padding: 6px 12px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
  color: var(--muted);
  line-height: 1.2;
  border-radius: 999px;
  transition: var(--transition);
  white-space: nowrap;
}

.lang-btn.active {
  background: var(--card);
  color: var(--text);
  font-weight: 600;
  box-shadow: var(--shadow-sm);
}

.lang-btn:hover:not(.active) {
  color: var(--text);
}

.lang-btn:focus-visible {
  outline: none;
  box-shadow: var(--focus);
}
</style>
