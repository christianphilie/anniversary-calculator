<template>
  <Alert v-if="error" variant="destructive" class="mb-3">
    <div class="flex items-start gap-2">
      <TriangleAlert class="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
      <AlertDescription class="flex-1 text-sm font-medium">
        {{ error.message }}
      </AlertDescription>
      <Button
        variant="ghost"
        size="icon"
        class="h-7 w-7 rounded-sm text-muted-foreground hover:text-foreground"
        aria-label="Fehler schließen"
        @click="clearError"
      >
        <X class="h-4 w-4" />
      </Button>
    </div>
  </Alert>
</template>

<script setup lang="ts">
import { useError } from '../composables/useError'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { TriangleAlert, X } from 'lucide-vue-next'

const { error, clearError } = useError()
</script>
