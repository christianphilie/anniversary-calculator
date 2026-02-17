<template>
  <ErrorBoundary>
    <div class="wrap">
      <a href="#main-content" class="skip-link">Zum Hauptinhalt springen</a>
      <AppHeader />
      <main id="main-content" class="grid">
        <div class="left-column">
          <InputPanel />
          <ExportPanel />
          <AppFooter class="footer-desktop" />
        </div>
        <div class="results-grid">
          <ResultsPanel />
          <AppFooter class="footer-mobile" />
        </div>
      </main>
      <Toast />
    </div>
  </ErrorBoundary>
</template>

<script setup lang="ts">
import { watch, onMounted } from 'vue'
import { provideError } from './composables/useError'
import { provideAppState } from './composables/useAppState'
import { useI18n } from './i18n'
import ErrorBoundary from './components/ErrorBoundary.vue'
import AppHeader from './components/AppHeader.vue'
import InputPanel from './components/InputPanel.vue'
import ExportPanel from './components/ExportPanel.vue'
import ResultsPanel from './components/ResultsPanel.vue'
import AppFooter from './components/AppFooter.vue'
import Toast from './components/Toast.vue'

// Provide error state to all components
provideError()

// Provide app state to all components (shared state)
provideAppState()

const { locale, t } = useI18n()

function updateMeta(): void {
  const title = t.value('ui.metaTitle')
  const description = t.value('ui.metaDescription')
  document.title = title

  const ensure = (selector: string, attr: 'content' | 'name' | 'property', value: string) => {
    const el = document.querySelector<HTMLMetaElement>(selector)
    if (el) el.setAttribute(attr, value)
  }

  ensure('meta[name=\"description\"]', 'content', description)
  ensure('meta[property=\"og:title\"]', 'content', title)
  ensure('meta[property=\"og:description\"]', 'content', description)
  ensure('meta[name=\"twitter:title\"]', 'content', title)
  ensure('meta[name=\"twitter:description\"]', 'content', description)
}

onMounted(updateMeta)
watch(locale, updateMeta)
</script>
