<template>
  <button
    class="theme-toggle"
    :aria-label="`${t('theme.switch')}: ${currentTheme === 'light' ? t('theme.dark') : t('theme.light')}`"
    :title="`${t('theme.switch')}: ${currentTheme === 'light' ? t('theme.dark') : t('theme.light')}`"
    @click="toggleTheme"
  >
    <span aria-hidden="true">{{ currentTheme === 'light' ? '🌙' : '☀️' }}</span>
  </button>
</template>

<script setup lang="ts">
import { useTheme } from '../composables/useTheme'
import { useI18n } from '../i18n'

const { currentTheme, toggleTheme } = useTheme()
const { t } = useI18n()
</script>

<style scoped>
.theme-toggle {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 1px solid var(--border);
  background: var(--card);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 18px;
  transition: var(--transition);
  box-shadow: var(--shadow-sm);
  padding: 0;
  line-height: 1;
}

.theme-toggle:hover {
  background: var(--panel);
  border-color: var(--brand);
  box-shadow: var(--shadow-md);
  transform: translateY(-1px);
}

.theme-toggle:focus-visible {
  outline: none;
  box-shadow: var(--focus);
}

.theme-toggle:active {
  transform: translateY(0);
}
</style>
