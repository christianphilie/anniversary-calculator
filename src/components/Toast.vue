<template>
  <Teleport to="body">
    <div class="pointer-events-none fixed top-4 left-4 right-4 z-[100] flex flex-col gap-2 sm:left-auto sm:right-4 sm:w-auto" aria-live="polite" aria-atomic="true">
      <TransitionGroup
        tag="div"
        enter-active-class="transition-all duration-150 ease-out"
        enter-from-class="opacity-0 -translate-y-1"
        leave-active-class="transition-all duration-150 ease-in"
        leave-to-class="opacity-0 -translate-y-1"
      >
        <div
          v-for="toast in toasts"
          :key="toast.id"
          :class="toastClass(toast.type)"
          role="alert"
        >
          <component :is="getIconComponent(toast.type)" :class="iconClass(toast.type)" aria-hidden="true" />
          <span class="min-w-0 flex-1 text-sm font-medium leading-snug text-popover-foreground">{{ toast.message }}</span>
          <Button
            variant="ghost"
            size="icon"
            class="h-7 w-7 shrink-0 rounded-sm text-muted-foreground hover:text-foreground"
            aria-label="Schließen"
            @click="remove(toast.id)"
          >
            <X class="h-4 w-4" aria-hidden="true" />
          </Button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { Teleport, TransitionGroup } from 'vue'
import { Check, CircleAlert, Info, X } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useToast } from '../composables/useToast'

const { toasts, remove } = useToast()

function getIconComponent(type: 'success' | 'error' | 'info') {
  return {
    success: Check,
    error: CircleAlert,
    info: Info,
  }[type]
}

function iconClass(type: 'success' | 'error' | 'info'): string {
  return cn(
    'h-4 w-4 shrink-0',
    type === 'success' && 'text-emerald-500 dark:text-emerald-400',
    type === 'error' && 'text-red-500 dark:text-red-400',
    type === 'info' && 'text-primary'
  )
}

function toastClass(type: 'success' | 'error' | 'info'): string {
  return cn(
    'pointer-events-auto flex min-w-0 items-center gap-2 rounded-lg border bg-popover p-3 shadow-lg sm:min-w-80 sm:max-w-96',
    type === 'success' && 'border-l-4 border-l-emerald-500',
    type === 'error' && 'border-l-4 border-l-red-500',
    type === 'info' && 'border-l-4 border-l-primary'
  )
}
</script>
