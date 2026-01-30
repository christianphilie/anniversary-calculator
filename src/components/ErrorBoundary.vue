<template>
  <div v-if="hasError" class="error-boundary">
    <div class="error-boundary-content">
      <h2>⚠️ Ein Fehler ist aufgetreten</h2>
      <p>{{ errorMessage }}</p>
      <button class="btn primary" @click="handleReset">
        Seite neu laden
      </button>
    </div>
  </div>
  <slot v-else />
</template>

<script setup lang="ts">
import { ref, onErrorCaptured } from 'vue'
import { useError } from '../composables/useError'

const hasError = ref(false)
const errorMessage = ref('Ein unerwarteter Fehler ist aufgetreten')
const { handleError } = useError()

onErrorCaptured((err: unknown) => {
  hasError.value = true
  
  if (err instanceof Error) {
    errorMessage.value = err.message
  } else if (typeof err === 'string') {
    errorMessage.value = err
  }
  
  // Also log to error handler
  handleError(err, 'Ein Komponentenfehler ist aufgetreten')
  
  // Return false to prevent the error from propagating further
  return false
})

function handleReset(): void {
  hasError.value = false
  errorMessage.value = 'Ein unerwarteter Fehler ist aufgetreten'
  window.location.reload()
}
</script>

<style scoped>
.error-boundary {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 50vh;
  padding: 2rem;
}

.error-boundary-content {
  text-align: center;
  max-width: 500px;
}

.error-boundary-content h2 {
  margin-bottom: 1rem;
  color: var(--c-years); /* Use error color from design tokens */
}

.error-boundary-content p {
  margin-bottom: 1.5rem;
  color: var(--muted);
}
</style>
