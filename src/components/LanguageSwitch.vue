<template>
  <Button
    variant="outline"
    size="icon"
    class="h-9 w-9 rounded-md"
    :aria-label="`Sprache: ${currentLang.label}`"
    :title="currentLang.label"
    @click="toggleLocale"
  >
    <span class="lang-code" aria-hidden="true">{{ currentLang.value.toUpperCase() }}</span>
  </Button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from '../i18n'
import type { Locale } from '../i18n'
import { Button } from '@/components/ui/button'

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
.lang-code {
  font-size: 0.6875rem;
  font-weight: 700;
  letter-spacing: 0.06em;
}
</style>
