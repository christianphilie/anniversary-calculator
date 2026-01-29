<template>
  <div class="wrap">
    <a href="#main-content" class="skip-link">Zum Hauptinhalt springen</a>
    <AppHeader />
    <main id="main-content" class="grid">
      <InputPanel />
      <ResultsPanel />
    </main>
  </div>
</template>

<script setup lang="ts">
import { provideError } from './composables/useError'
import AppHeader from './components/AppHeader.vue'
import InputPanel from './components/InputPanel.vue'
import ResultsPanel from './components/ResultsPanel.vue'

// Provide error state to all components
provideError()
</script>
