<template>
  <div class="ics-help-wrapper">
    <button
      ref="triggerRef"
      class="ics-help-trigger"
      :aria-label="t('export.icsHelpTitle')"
      :title="t('export.icsHelpTitle')"
      @click="toggleHelp"
    >
      <span aria-hidden="true" class="help-icon">?</span>
    </button>
    <div v-if="showHelp" ref="contentRef" class="ics-help-content">
      <h3>{{ t('export.icsHelpTitle') }}</h3>
      <ol>
        <li>{{ t('export.icsHelpStep1') }}</li>
        <li>{{ t('export.icsHelpStep2') }}</li>
        <li>{{ t('export.icsHelpStep3') }}</li>
        <li>{{ t('export.icsHelpStep4') }}</li>
      </ol>
      <button class="ics-help-close" @click="toggleHelp" :aria-label="t('common.close')">
        {{ t('common.close') }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useI18n } from '../i18n'

const { t } = useI18n()
const showHelp = ref(false)
const triggerRef = ref<HTMLElement | null>(null)
const contentRef = ref<HTMLElement | null>(null)

function updatePosition(): void {
  if (!showHelp.value || !triggerRef.value || !contentRef.value) return
  
  const trigger = triggerRef.value
  const content = contentRef.value
  const rect = trigger.getBoundingClientRect()
  
  // Position relative to viewport
  content.style.top = `${rect.bottom + 8}px`
  content.style.left = `${rect.right - content.offsetWidth}px`
  
  // Ensure it doesn't go off-screen
  const contentRect = content.getBoundingClientRect()
  if (contentRect.right > window.innerWidth) {
    content.style.left = `${window.innerWidth - contentRect.width - 16}px`
  }
  if (contentRect.left < 0) {
    content.style.left = '16px'
  }
  if (contentRect.bottom > window.innerHeight) {
    content.style.top = `${rect.top - contentRect.height - 8}px`
  }
}

onMounted(() => {
  if (showHelp.value) {
    updatePosition()
    window.addEventListener('scroll', updatePosition, true)
    window.addEventListener('resize', updatePosition)
  }
})

onUnmounted(() => {
  window.removeEventListener('scroll', updatePosition, true)
  window.removeEventListener('resize', updatePosition)
})

function toggleHelp(): void {
  showHelp.value = !showHelp.value
  if (showHelp.value) {
    setTimeout(() => {
      updatePosition()
      window.addEventListener('scroll', updatePosition, true)
      window.addEventListener('resize', updatePosition)
    }, 0)
  } else {
    window.removeEventListener('scroll', updatePosition, true)
    window.removeEventListener('resize', updatePosition)
  }
}
</script>

<style scoped>
.ics-help-wrapper {
  position: relative;
  display: inline-block;
}

.ics-help-trigger {
  background: transparent;
  border: 1px solid var(--border);
  cursor: pointer;
  font-size: 14px;
  padding: 0;
  color: var(--muted);
  transition: var(--transition);
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
  line-height: 1;
}

.help-icon {
  display: inline-block;
  font-size: 12px;
  font-weight: 600;
}

.ics-help-trigger:hover {
  background: var(--panel);
  color: var(--text);
}

.ics-help-content {
  position: fixed;
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 20px;
  box-shadow: var(--shadow-lg);
  z-index: 100000;
  min-width: 280px;
  max-width: 400px;
}

.ics-help-wrapper {
  position: relative;
  display: inline-block;
}

.ics-help-content h3 {
  margin: 0 0 12px 0;
  font-size: 16px;
  font-weight: 600;
}

.ics-help-content ol {
  margin: 0 0 16px 0;
  padding-left: 20px;
}

.ics-help-content li {
  margin-bottom: 8px;
  font-size: 14px;
  line-height: 1.5;
  color: var(--text);
}

.ics-help-close {
  width: 100%;
  padding: 8px 16px;
  background: var(--panel);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  color: var(--text);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: var(--transition);
}

.ics-help-close:hover {
  background: var(--card);
  border-color: var(--brand);
}
</style>
