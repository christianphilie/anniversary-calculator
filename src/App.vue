<template>
  <div class="wrap">
    <a href="#main-content" class="skip-link">Zum Hauptinhalt springen</a>
    <AppHeader />
    <main id="main-content" class="grid">
      <InputPanel />
      <ResultsPanel />
    </main>
    <Toast />
  </div>
</template>

<script setup lang="ts">
import { provideError } from './composables/useError'
import { provideAppState } from './composables/useAppState'
import AppHeader from './components/AppHeader.vue'
import InputPanel from './components/InputPanel.vue'
import ResultsPanel from './components/ResultsPanel.vue'
import Toast from './components/Toast.vue'

// Provide error state to all components
provideError()

// Provide app state to all components (shared state)
provideAppState()
</script>
