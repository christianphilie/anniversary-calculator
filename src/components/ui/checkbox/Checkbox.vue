<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { CheckboxIndicator, CheckboxRoot } from 'reka-ui'
import { Check } from 'lucide-vue-next'
import { cn } from '@/lib/utils'

const props = withDefaults(defineProps<{
  modelValue?: boolean | 'indeterminate'
  disabled?: boolean
  name?: string
  value?: string
  id?: string
  required?: boolean
  class?: HTMLAttributes['class']
}>(), {
  modelValue: false,
  disabled: false,
  name: undefined,
  value: undefined,
  id: undefined,
  required: false,
  class: undefined,
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean | 'indeterminate']
}>()
</script>

<template>
  <CheckboxRoot
    :checked="props.modelValue"
    :disabled="props.disabled"
    :name="props.name"
    :value="props.value"
    :id="props.id"
    :required="props.required"
    :class="cn('peer h-4 w-4 shrink-0 rounded-[4px] border border-input bg-background shadow-xs outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground', props.class)"
    @update:checked="(value: boolean | 'indeterminate') => emit('update:modelValue', value)"
  >
    <CheckboxIndicator class="flex h-full w-full items-center justify-center text-current">
      <Check class="h-3.5 w-3.5" />
    </CheckboxIndicator>
  </CheckboxRoot>
</template>
