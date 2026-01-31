<template>
  <header ref="headerRef">
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
import { watch, onMounted, onUnmounted, ref } from 'vue'
import ThemeSwitch from './ThemeSwitch.vue'
import LanguageSwitch from './LanguageSwitch.vue'
import { useI18n } from '../i18n'
import { updateFormatters } from '../utils/i18n'

const { locale, t } = useI18n()
const headerRef = ref<HTMLElement | null>(null)
let resizeObserver: ResizeObserver | null = null

// Update formatters when locale changes
watch(locale, (newLocale) => {
  updateFormatters(newLocale)
}, { immediate: true })

// Update sticky header height dynamically
function updateStickyHeaderHeight(): void {
  if (!headerRef.value) return
  
  const headerHeight = headerRef.value.offsetHeight
  const panelHeaderHeight = 52 // Fixed height of panel header
  
  // Update CSS custom properties
  // Panel header sits below the main header
  document.documentElement.style.setProperty('--sticky-panel-header-top', `${headerHeight}px`)
  // Year navigation sits below panel header
  document.documentElement.style.setProperty('--sticky-header-height-desktop', `${headerHeight + panelHeaderHeight}px`)
  document.documentElement.style.setProperty('--sticky-header-height-mobile', `${panelHeaderHeight}px`)
}

onMounted(() => {
  updateStickyHeaderHeight()
  
  // Watch for resize and content changes
  resizeObserver = new ResizeObserver(() => {
    updateStickyHeaderHeight()
  })
  
  if (headerRef.value) {
    resizeObserver.observe(headerRef.value)
  }
  
  // Also listen to window resize
  window.addEventListener('resize', updateStickyHeaderHeight)
})

onUnmounted(() => {
  if (resizeObserver) {
    resizeObserver.disconnect()
  }
  window.removeEventListener('resize', updateStickyHeaderHeight)
})
</script>

<style scoped>
.header-controls {
  display: flex;
  gap: 12px;
  align-items: center;
  flex-shrink: 0;
}
</style>
