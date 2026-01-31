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
import { provideError } from './composables/useError'
import { provideAppState } from './composables/useAppState'
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
</script>
