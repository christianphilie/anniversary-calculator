<template>
  <div class="year-sep" :id="`y-${year}`" :data-year="year">
    <span class="y">{{ year }}</span>
    <div class="controls">
      <button class="btn small secondary" @click="$emit('select-all')">
        ✅ Alle auswählen
      </button>
      <button class="btn small secondary" @click="$emit('select-none')">
        🚫 Alle abwählen
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  year: number
}>()

defineEmits<{
  'select-all': []
  'select-none': []
}>()
</script>
