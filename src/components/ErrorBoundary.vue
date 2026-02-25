<template>
  <div v-if="hasError" class="error-boundary">
    <div class="error-boundary-content">
      <h2>⚠️ Ein Fehler ist aufgetreten</h2>
      <p>{{ errorMessage }}</p>
      <Button @click="handleReset">
        Seite neu laden
      </Button>
    </div>
  </div>
  <slot v-else />
</template>

<script setup lang="ts">
import { ref, onErrorCaptured } from 'vue'
import { useError } from '../composables/useError'
import { Button } from '@/components/ui/button'

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
  padding: 1rem;
}

.error-boundary-content {
  width: min(100%, 32rem);
  text-align: center;
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  background: var(--card);
  padding: 1.25rem;
  box-shadow: var(--shadow-sm);
}

.error-boundary-content h2 {
  margin: 0 0 0.5rem;
  font-size: 1rem;
  color: var(--destructive);
}

.error-boundary-content p {
  margin: 0 0 1rem;
  color: var(--muted-foreground);
  font-size: 0.875rem;
}
</style>
