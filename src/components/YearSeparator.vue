<template>
  <div class="year-sep" :id="`y-${year}`" :data-year="year" role="separator" :aria-label="`Jahr ${year}`">
    <span class="y">{{ year }}</span>
    <div class="controls">
      <button
        class="btn small secondary"
        :aria-label="`Alle Meilensteine für ${year} auswählen`"
        @click="$emit('select-all')"
      >
        <span aria-hidden="true">✅</span> Alle auswählen
      </button>
      <button
        class="btn small secondary"
        :aria-label="`Auswahl für ${year} aufheben`"
        @click="$emit('select-none')"
      >
        <span aria-hidden="true">🚫</span> Alle abwählen
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
