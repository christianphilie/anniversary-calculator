<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'
const props = withDefaults(defineProps<{ orientation?: 'horizontal' | 'vertical'; decorative?: boolean; class?: HTMLAttributes['class'] }>(), {
  orientation: 'horizontal',
  decorative: true,
  class: undefined,
})
</script>
<template>
  <div
    :role="props.decorative ? 'none' : 'separator'"
    :aria-orientation="props.orientation"
    :class="cn(props.orientation === 'horizontal' ? 'h-px w-full' : 'h-full w-px', 'shrink-0 bg-border', props.class)"
  />
</template>
