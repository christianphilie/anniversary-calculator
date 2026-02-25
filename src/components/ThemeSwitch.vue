<template>
  <Button
    variant="outline"
    size="icon"
    class="h-9 w-9 rounded-md"
    :aria-label="`${t('theme.switch')}: ${currentTheme === 'light' ? t('theme.dark') : t('theme.light')}`"
    :title="`${t('theme.switch')}: ${currentTheme === 'light' ? t('theme.dark') : t('theme.light')}`"
    @click="toggleTheme"
  >
    <span class="theme-toggle-icon" aria-hidden="true">
      <Moon v-if="currentTheme === 'light'" />
      <Sun v-else />
    </span>
  </Button>
</template>

<script setup lang="ts">
import { useTheme } from '../composables/useTheme'
import { useI18n } from '../i18n'
import { Button } from '@/components/ui/button'
import { Moon, Sun } from 'lucide-vue-next'

const { currentTheme, toggleTheme } = useTheme()
const { t } = useI18n()
</script>

<style scoped>
.theme-toggle-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.theme-toggle-icon svg {
  width: 0.95rem;
  height: 0.95rem;
}
</style>
