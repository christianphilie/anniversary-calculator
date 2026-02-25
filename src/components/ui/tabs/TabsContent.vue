<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import type { TabsContentProps } from 'reka-ui'
import { TabsContent as RekaTabsContent } from 'reka-ui'
import { computed } from 'vue'
import { cn } from '@/lib/utils'

const props = defineProps<TabsContentProps & { class?: HTMLAttributes['class'] }>()

const contentProps = computed(() => {
  const { class: _class, ...rest } = props
  return rest
})
</script>

<template>
  <RekaTabsContent
    v-bind="contentProps"
    data-slot="tabs-content"
    :class="cn('mt-3 outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background', props.class)"
  >
    <slot />
  </RekaTabsContent>
</template>
