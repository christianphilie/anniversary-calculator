<script setup lang="ts">
import type { HTMLAttributes, InputHTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

type ModelModifiers = { number?: boolean; trim?: boolean }

const props = withDefaults(defineProps<{
  modelValue?: string | number | null
  modelModifiers?: ModelModifiers
  class?: HTMLAttributes['class']
  type?: InputHTMLAttributes['type']
  id?: string
  placeholder?: string
  step?: string | number
  min?: string | number
  max?: string | number
  disabled?: boolean
  ariaInvalid?: 'true' | 'false'
  ariaDescribedby?: string
}>(), {
  modelValue: '',
  modelModifiers: () => ({}),
  class: undefined,
  type: 'text',
  id: undefined,
  placeholder: undefined,
  step: undefined,
  min: undefined,
  max: undefined,
  disabled: false,
  ariaInvalid: undefined,
  ariaDescribedby: undefined,
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
  blur: [event: FocusEvent]
  keydown: [event: KeyboardEvent]
}>()

function onInput(event: Event): void {
  const target = event.target as HTMLInputElement
  let value: string | number = target.value

  if (props.modelModifiers.trim && typeof value === 'string') {
    value = value.trim()
  }

  if (props.modelModifiers.number) {
    value = target.value === '' ? NaN : Number(target.value)
  }

  emit('update:modelValue', value)
}
</script>

<template>
  <input
    :id="props.id"
    :type="props.type"
    :value="props.modelValue ?? ''"
    :placeholder="props.placeholder"
    :step="props.step"
    :min="props.min"
    :max="props.max"
    :disabled="props.disabled"
    :aria-invalid="props.ariaInvalid"
    :aria-describedby="props.ariaDescribedby"
    :class="cn('ui-input block h-9 w-full min-w-0 max-w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs transition-[color,box-shadow,border-color] outline-none file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background', props.class)"
    @input="onInput"
    @blur="(e) => emit('blur', e)"
    @keydown="(e) => emit('keydown', e)"
  />
</template>
