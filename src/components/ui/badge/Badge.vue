<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center justify-center rounded-full border px-2 py-0.5 text-[11px] font-medium tracking-wide uppercase whitespace-nowrap transition-colors',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-primary text-primary-foreground',
        secondary: 'border-border bg-muted text-muted-foreground',
        outline: 'border-border bg-background text-foreground'
      }
    },
    defaultVariants: {
      variant: 'secondary'
    }
  }
)

type BadgeVariant = VariantProps<typeof badgeVariants>

const props = withDefaults(defineProps<{
  variant?: BadgeVariant['variant']
  class?: HTMLAttributes['class']
}>(), {
  variant: 'secondary',
  class: undefined
})
</script>

<template>
  <span :class="cn(badgeVariants({ variant: props.variant }), props.class)">
    <slot />
  </span>
</template>
