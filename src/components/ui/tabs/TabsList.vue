<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import type { TabsListProps } from 'reka-ui'
import { TabsList as RekaTabsList } from 'reka-ui'
import { cn } from '@/lib/utils'

const props = defineProps<TabsListProps & { class?: HTMLAttributes['class'] }>()
</script>

<template>
  <RekaTabsList
    data-slot="tabs-list"
    :class="cn(
      'inline-flex h-10 items-center justify-center rounded-lg border border-border bg-muted p-1 text-muted-foreground',
      props.class
    )"
  >
    <slot />
  </RekaTabsList>
</template>
