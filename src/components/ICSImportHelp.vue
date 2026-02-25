<template>
  <div class="relative inline-block">
    <Button
      ref="triggerRef"
      variant="outline"
      size="icon"
      class="h-7 w-7 rounded-md text-muted-foreground"
      :aria-label="t('export.icsHelpTitle')"
      :title="t('export.icsHelpTitle')"
      @click="(e: MouseEvent) => toggleHelp(e)"
    >
      <CircleHelp aria-hidden="true" class="h-4 w-4" />
    </Button>
    <div
      v-if="showHelp"
      ref="contentRef"
      class="fixed z-[100000] w-[min(22rem,calc(100vw-2rem))] rounded-lg border border-border bg-popover p-3 text-popover-foreground shadow-lg"
    >
      <Button
        variant="ghost"
        size="icon"
        class="absolute top-2 right-2 h-7 w-7 rounded-sm text-muted-foreground"
        @click.stop="toggleHelp"
        :aria-label="t('common.close')"
        type="button"
      >
        <X aria-hidden="true" class="h-4 w-4" />
      </Button>
      <h3 class="mb-2 pr-8 text-sm font-semibold leading-none tracking-tight">{{ t('export.icsHelpTitle') }}</h3>
      <ol class="list-decimal space-y-1 pl-4 text-xs leading-relaxed text-muted-foreground">
        <li>{{ t('export.icsHelpStep1') }}</li>
        <li>{{ t('export.icsHelpStep2') }}</li>
        <li>{{ t('export.icsHelpStep3') }}</li>
        <li>{{ t('export.icsHelpStep4') }}</li>
      </ol>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import type { ComponentPublicInstance } from 'vue'
import { CircleHelp, X } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { useI18n } from '../i18n'

const { t } = useI18n()
const showHelp = ref(false)
const triggerRef = ref<HTMLElement | ComponentPublicInstance | null>(null)
const contentRef = ref<HTMLElement | null>(null)

function getTriggerElement(): HTMLElement | null {
  const trigger = triggerRef.value
  if (!trigger) return null
  if (trigger instanceof HTMLElement) return trigger
  const el = trigger.$el
  return el instanceof HTMLElement ? el : null
}

function updatePosition(): void {
  if (!showHelp.value || !contentRef.value) return

  const trigger = getTriggerElement()
  if (!trigger) return

  const content = contentRef.value
  const rect = trigger.getBoundingClientRect()

  requestAnimationFrame(() => {
    if (!contentRef.value) return

    let top = rect.bottom + 8
    let left = 0

    const panelShell = trigger.closest('[data-panel-shell], .panel')

    if (panelShell) {
      const panelRect = panelShell.getBoundingClientRect()
      left = panelRect.left + (panelRect.width / 2) - (content.offsetWidth / 2)
    } else {
      left = rect.right - content.offsetWidth
    }

    if (left < 16) left = 16
    if (left + content.offsetWidth > window.innerWidth - 16) {
      left = window.innerWidth - content.offsetWidth - 16
    }

    if (top + content.offsetHeight > window.innerHeight - 16) {
      top = rect.top - content.offsetHeight - 8
      if (top < 16) {
        top = Math.max(16, (window.innerHeight - content.offsetHeight) / 2)
      }
    }

    content.style.top = `${top}px`
    content.style.left = `${left}px`
  })
}

onMounted(() => {
  if (showHelp.value) {
    updatePosition()
    window.addEventListener('scroll', updatePosition, true)
    window.addEventListener('resize', updatePosition)
  }
})

onUnmounted(() => {
  window.removeEventListener('scroll', updatePosition, true)
  window.removeEventListener('resize', updatePosition)
})

function toggleHelp(e?: Event): void {
  if (e) e.stopPropagation()
  showHelp.value = !showHelp.value

  if (showHelp.value) {
    setTimeout(() => {
      updatePosition()
      window.addEventListener('scroll', updatePosition, true)
      window.addEventListener('resize', updatePosition)
    }, 0)
  } else {
    window.removeEventListener('scroll', updatePosition, true)
    window.removeEventListener('resize', updatePosition)
  }
}
</script>
