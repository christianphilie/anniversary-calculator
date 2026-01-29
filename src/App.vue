<template>
  <div class="wrap">
    <AppHeader />
    <div class="grid">
      <InputPanel />
      <ResultsPanel />
    </div>
  </div>
</template>

<script setup lang="ts">
import AppHeader from './components/AppHeader.vue'
import InputPanel from './components/InputPanel.vue'
import ResultsPanel from './components/ResultsPanel.vue'
</script>
