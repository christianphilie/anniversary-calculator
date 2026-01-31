<template>
  <div class="ics-help-wrapper">
    <button
      ref="triggerRef"
      class="ics-help-trigger"
      :aria-label="t('export.icsHelpTitle')"
      :title="t('export.icsHelpTitle')"
      @click="(e) => toggleHelp(e)"
    >
      <span aria-hidden="true" class="help-icon">?</span>
    </button>
    <div v-if="showHelp" ref="contentRef" class="ics-help-content">
      <button class="ics-help-close" @click.stop="toggleHelp" :aria-label="t('common.close')" type="button">
        ×
      </button>
      <h3>{{ t('export.icsHelpTitle') }}</h3>
      <ol>
        <li>{{ t('export.icsHelpStep1') }}</li>
        <li>{{ t('export.icsHelpStep2') }}</li>
        <li>{{ t('export.icsHelpStep3') }}</li>
        <li>{{ t('export.icsHelpStep4') }}</li>
      </ol>
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
  
  // Wait for content to be rendered to get accurate dimensions
  requestAnimationFrame(() => {
    if (!contentRef.value) return
    
    // Position relative to viewport - try to position below trigger, centered over export panel
    let top = rect.bottom + 8
    
    // Find the export panel to center the help over it
    const exportPanel = trigger.closest('.panel')
    let left = 0
    
    if (exportPanel) {
      const panelRect = exportPanel.getBoundingClientRect()
      // Center the help content over the panel, extending equally on both sides
      left = panelRect.left + (panelRect.width / 2) - (content.offsetWidth / 2)
    } else {
      // Fallback: align to right of trigger
      left = rect.right - content.offsetWidth
    }
    
    // Ensure it doesn't go off-screen horizontally
    if (left < 16) {
      left = 16
    }
    if (left + content.offsetWidth > window.innerWidth - 16) {
      left = window.innerWidth - content.offsetWidth - 16
    }
    
    // Ensure it doesn't go off-screen vertically - prefer above if not enough space below
    if (top + content.offsetHeight > window.innerHeight - 16) {
      top = rect.top - content.offsetHeight - 8
      // If still doesn't fit above, position it in the middle of the viewport
      if (top < 16) {
        top = Math.max(16, (window.innerHeight - content.offsetHeight) / 2)
      }
    }
    
    content.style.top = `${top}px`
    content.style.left = `${left}px`
  })
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

function toggleHelp(e?: Event): void {
  if (e) {
    e.stopPropagation()
  }
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

.ics-help-close {
  position: absolute;
  top: 8px;
  right: 8px;
  background: transparent;
  border: none;
  color: var(--muted);
  font-size: 24px;
  font-weight: 300;
  line-height: 1;
  cursor: pointer;
  transition: var(--transition);
  padding: 4px 8px;
  width: auto;
  height: auto;
  display: flex;
  align-items: center;
  justify-content: center;
}

.ics-help-close:hover {
  color: var(--text);
}

.ics-help-content h3 {
  margin: 0 0 12px 0;
  font-size: 16px;
  font-weight: 600;
  padding-right: 32px;
}

.ics-help-content ol {
  margin: 0;
  padding-left: 20px;
}

.ics-help-content li {
  margin-bottom: 8px;
  font-size: 14px;
  line-height: 1.5;
  color: var(--text);
}
</style>
