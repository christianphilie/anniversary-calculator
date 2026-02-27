<template>
  <div class="grid gap-3 px-1 pb-1">
    <div
      v-if="!favoriteEvents.length"
      class="grid min-h-24 place-items-center rounded-md border border-dashed border-border bg-muted/60 px-4 py-5 text-center text-sm text-muted-foreground"
      role="status"
      aria-live="polite"
    >
      <span class="inline-flex items-center gap-1.5">
        <span>{{ t('favorites.emptyPrefix') }}</span>
        <Bookmark class="h-4 w-4" aria-hidden="true" />
        <span>{{ t('favorites.emptySuffix') }}</span>
      </span>
    </div>
    <div v-else class="space-y-2" role="list" :aria-label="t('ui.favorites')">
      <MilestoneItem v-for="event in favoriteEvents" :key="event.id" :event="event" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Bookmark } from 'lucide-vue-next'
import { useAppState } from '../composables/useAppState'
import { useI18n } from '../i18n'
import MilestoneItem from './MilestoneItem.vue'

const { favoriteEvents } = useAppState()
const { t } = useI18n()
</script>
