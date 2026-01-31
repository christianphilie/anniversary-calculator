<template>
  <button
    class="lang-toggle"
    :aria-label="`Sprache: ${currentLang.label}`"
    :title="currentLang.label"
    @click="toggleLocale"
  >
    <span aria-hidden="true">{{ currentLang.flag }}</span>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from '../i18n'
import type { Locale } from '../i18n'

const { locale, setLocale } = useI18n()

const languages: Array<{ value: Locale; label: string; flag: string }> = [
  { value: 'de', label: 'Deutsch', flag: '🇩🇪' },
  { value: 'en', label: 'English', flag: '🇬🇧' }
]

const currentLang = computed(() => {
  const currentIndex = languages.findIndex(lang => lang.value === locale.value)
  const nextIndex = (currentIndex + 1) % languages.length
  return languages[nextIndex] || languages[0]
})

function toggleLocale(): void {
  const currentIndex = languages.findIndex(lang => lang.value === locale.value)
  const nextIndex = (currentIndex + 1) % languages.length
  setLocale(languages[nextIndex].value)
}
</script>

<style scoped>
.lang-toggle {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 1px solid var(--border);
  background: var(--card);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 20px;
  transition: var(--transition);
  box-shadow: var(--shadow-sm);
  padding: 0;
  line-height: 1;
  flex-shrink: 0;
}

.lang-toggle:hover {
  background: var(--panel);
  border-color: var(--brand);
  box-shadow: var(--shadow-md);
  transform: translateY(-1px);
}

.lang-toggle:focus-visible {
  outline: none;
  box-shadow: var(--focus);
}

.lang-toggle:active {
  transform: translateY(0);
}
</style>
