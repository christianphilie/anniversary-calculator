<template>
  <header ref="headerRef">
    <div class="title">
      <div class="logo" aria-hidden="true">
        <span class="logo-icon-stack">
          <PartyPopper class="logo-icon-base" />
          <PartyPopper class="logo-party-icon" />
        </span>
      </div>
      <div>
        <h1>{{ t('ui.title') }}</h1>
        <div class="muted">{{ t('ui.description') }}</div>
      </div>
    </div>
    <div class="flex shrink-0 items-center gap-2 rounded-lg border border-border bg-muted p-1">
      <LanguageSwitch />
      <ThemeSwitch />
    </div>
  </header>
</template>

<script setup lang="ts">
import { watch, onMounted, onUnmounted, ref } from 'vue'
import { PartyPopper } from 'lucide-vue-next'
import ThemeSwitch from './ThemeSwitch.vue'
import LanguageSwitch from './LanguageSwitch.vue'
import { useI18n } from '../i18n'
import { updateFormatters } from '../utils/i18n'

const { locale, t } = useI18n()
const headerRef = ref<HTMLElement | null>(null)
let resizeObserver: ResizeObserver | null = null

watch(locale, (newLocale) => {
  updateFormatters(newLocale)
}, { immediate: true })

function updateStickyHeaderHeight(): void {
  if (!headerRef.value) return

  const headerHeight = headerRef.value.offsetHeight
  const panelHeaderHeight = 48

  document.documentElement.style.setProperty('--sticky-panel-header-top', `${headerHeight}px`)
  document.documentElement.style.setProperty('--sticky-header-height-desktop', `${headerHeight + panelHeaderHeight}px`)
  document.documentElement.style.setProperty('--sticky-header-height-mobile', `${panelHeaderHeight}px`)
}

onMounted(() => {
  updateStickyHeaderHeight()

  resizeObserver = new ResizeObserver(() => {
    updateStickyHeaderHeight()
  })

  if (headerRef.value) {
    resizeObserver.observe(headerRef.value)
  }

  window.addEventListener('resize', updateStickyHeaderHeight)
})

onUnmounted(() => {
  if (resizeObserver) {
    resizeObserver.disconnect()
  }
  window.removeEventListener('resize', updateStickyHeaderHeight)
})
</script>
