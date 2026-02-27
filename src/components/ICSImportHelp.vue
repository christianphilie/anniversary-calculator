<template>
  <div ref="containerRef" class="relative inline-flex">
    <Button
      variant="ghost"
      size="icon"
      :class="cn('h-7 w-7 rounded-md text-muted-foreground', props.triggerClass)"
      :aria-label="t('export.icsHelpTitle')"
      :title="t('export.icsHelpTitle')"
      type="button"
      @click="(e: MouseEvent) => toggleHelp(e)"
    >
      <CircleHelp aria-hidden="true" class="h-4 w-4" />
    </Button>
    <div
      v-if="showHelp"
      :class="cn(
        'absolute top-full z-[100000] mt-2 w-[min(22rem,calc(100vw-2rem))] rounded-lg border border-border bg-popover p-3 text-popover-foreground shadow-lg',
        props.align === 'left' ? 'left-0' : 'right-0',
        props.panelClass
      )"
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
import { CircleHelp, X } from 'lucide-vue-next'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { useI18n } from '../i18n'

const props = withDefaults(defineProps<{
  triggerClass?: string
  panelClass?: string
  align?: 'left' | 'right'
}>(), {
  triggerClass: '',
  panelClass: '',
  align: 'right'
})

const { t } = useI18n()
const showHelp = ref(false)
const containerRef = ref<HTMLElement | null>(null)

function toggleHelp(e?: Event): void {
  if (e) e.stopPropagation()
  showHelp.value = !showHelp.value
}

function handleDocumentClick(event: MouseEvent): void {
  const target = event.target
  if (!(target instanceof Node)) return
  if (!containerRef.value?.contains(target)) {
    showHelp.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleDocumentClick)
})

onUnmounted(() => {
  document.removeEventListener('click', handleDocumentClick)
})
</script>
