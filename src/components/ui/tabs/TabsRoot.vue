<script setup lang="ts">
import type { TabsRootEmits, TabsRootProps } from 'reka-ui'
import { TabsRoot as RekaTabsRoot, useForwardPropsEmits } from 'reka-ui'
import type { HTMLAttributes } from 'vue'
import { computed } from 'vue'
import { cn } from '@/lib/utils'

const props = defineProps<TabsRootProps & { class?: HTMLAttributes['class'] }>()
const emits = defineEmits<TabsRootEmits>()

const rootProps = computed(() => {
  const { class: _class, ...rest } = props
  return rest
})

const forwarded = useForwardPropsEmits(rootProps, emits)
</script>

<template>
  <RekaTabsRoot v-bind="forwarded" :class="cn('w-full', props.class)" data-slot="tabs-root">
    <slot />
  </RekaTabsRoot>
</template>
