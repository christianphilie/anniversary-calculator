<template>
  <Teleport to="body">
    <div
      class="pointer-events-none fixed left-4 right-4 top-4 z-[100] flex flex-col gap-2 sm:left-auto sm:right-4 sm:w-[min(24rem,calc(100vw-2rem))]"
      aria-live="polite"
      aria-atomic="true"
    >
      <TransitionGroup
        tag="div"
        enter-active-class="transition-[opacity,transform] duration-250 ease-out"
        enter-from-class="translate-y-2 scale-[0.98] opacity-0"
        leave-active-class="transition-[opacity,transform] duration-200 ease-in"
        leave-to-class="-translate-y-1 scale-[0.98] opacity-0"
        move-class="transition-transform duration-200 ease-out"
      >
        <div
          v-for="toast in toasts"
          :key="toast.id"
          :class="toastClass(toast.type)"
          role="alert"
        >
          <div class="flex min-w-0 items-start gap-3 px-3 py-3">
            <span :class="iconWrapClass(toast.type)" aria-hidden="true">
              <component :is="getIconComponent(toast.type)" :class="iconClass(toast.type)" />
            </span>
            <span class="min-w-0 flex-1 pt-0.5 text-sm font-medium leading-snug text-popover-foreground">
              {{ toast.message }}
            </span>
            <Button
              variant="ghost"
              size="icon"
              class="mt-[-2px] h-7 w-7 shrink-0 rounded-md text-muted-foreground/80 hover:bg-muted hover:text-foreground"
              aria-label="Schließen"
              @click="remove(toast.id)"
            >
              <X class="h-4 w-4" aria-hidden="true" />
            </Button>
          </div>
          <div
            v-if="(toast.duration ?? 0) > 0"
            :class="progressClass(toast.type)"
            :style="progressStyle(toast.duration)"
            aria-hidden="true"
          />
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
type ToastType = 'success' | 'error' | 'info'

const TOAST_STYLE: Record<ToastType, { icon: string; iconWrap: string; progress: string }> = {
  success: {
    icon: 'text-emerald-600 dark:text-emerald-300',
    iconWrap: 'border border-emerald-500/30 bg-emerald-500/10',
    progress: 'bg-emerald-500/80'
  },
  error: {
    icon: 'text-red-600 dark:text-red-300',
    iconWrap: 'border border-red-500/30 bg-red-500/10',
    progress: 'bg-red-500/80'
  },
  info: {
    icon: 'text-primary',
    iconWrap: 'border border-primary/30 bg-primary/10',
    progress: 'bg-primary/80'
  }
}

function getIconComponent(type: ToastType) {
  return {
    success: Check,
    error: CircleAlert,
    info: Info,
  }[type]
}

function iconClass(type: ToastType): string {
  return cn('h-4 w-4 shrink-0', TOAST_STYLE[type].icon)
}

function iconWrapClass(type: ToastType): string {
  return cn('inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md', TOAST_STYLE[type].iconWrap)
}

function progressClass(type: ToastType): string {
  return cn('toast-progress absolute bottom-0 left-0 h-[2px] w-full origin-left', TOAST_STYLE[type].progress)
}

function progressStyle(duration?: number): { animationDuration: string } | undefined {
  if (!duration || duration <= 0) return undefined
  return { animationDuration: `${duration}ms` }
}

function toastClass(_type: ToastType): string {
  return cn(
    'pointer-events-auto relative overflow-hidden rounded-xl border border-border/70 bg-popover/95 shadow-lg backdrop-blur supports-[backdrop-filter]:bg-popover/85'
  )
}
</script>

<style scoped>
@keyframes toast-progress {
  from {
    transform: scaleX(1);
  }
  to {
    transform: scaleX(0);
  }
}

.toast-progress {
  animation-name: toast-progress;
  animation-timing-function: linear;
  animation-fill-mode: forwards;
}
</style>
