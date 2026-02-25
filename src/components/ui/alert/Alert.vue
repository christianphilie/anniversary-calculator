<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const alertVariants = cva(
  'relative w-full rounded-lg border p-4 text-sm grid gap-1',
  {
    variants: {
      variant: {
        default: 'border-border bg-card text-card-foreground',
        destructive: 'border-destructive/30 bg-destructive/5 text-destructive'
      }
    },
    defaultVariants: {
      variant: 'default'
    }
  }
)

type AlertVariant = VariantProps<typeof alertVariants>

const props = withDefaults(defineProps<{
  variant?: AlertVariant['variant']
  class?: HTMLAttributes['class']
}>(), {
  variant: 'default',
  class: undefined
})
</script>

<template>
  <div role="alert" :class="cn(alertVariants({ variant: props.variant }), props.class)">
    <slot />
  </div>
</template>
