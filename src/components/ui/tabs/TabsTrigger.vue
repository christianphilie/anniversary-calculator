<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import type { TabsTriggerProps } from 'reka-ui'
import { TabsTrigger as RekaTabsTrigger } from 'reka-ui'
import { computed } from 'vue'
import { cn } from '@/lib/utils'

const props = defineProps<TabsTriggerProps & { class?: HTMLAttributes['class'] }>()

const triggerProps = computed(() => {
  const { class: _class, ...rest } = props
  return rest
})
</script>

<template>
  <RekaTabsTrigger
    v-bind="triggerProps"
    data-slot="tabs-trigger"
    :class="cn(
      'inline-flex h-8 items-center justify-center whitespace-nowrap rounded-md border border-transparent px-3 text-sm font-medium ring-offset-background transition-all outline-none focus-visible:ring-2 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:border-border data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm',
      props.class
    )"
  >
    <slot />
  </RekaTabsTrigger>
</template>
