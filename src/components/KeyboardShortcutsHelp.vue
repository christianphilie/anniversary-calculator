<template>
  <div v-if="showHelp" class="shortcuts-help" role="dialog" aria-labelledby="shortcuts-title" aria-modal="true">
    <div class="shortcuts-content">
      <div class="shortcuts-header">
        <h2 id="shortcuts-title">Tastenkürzel</h2>
        <button
          class="btn-icon"
          aria-label="Hilfe schließen"
          @click="showHelp = false"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
      <div class="shortcuts-list">
        <div v-for="shortcut in shortcuts" :key="shortcut.key" class="shortcut-item">
          <div class="shortcut-keys">
            <kbd v-if="shortcut.ctrl || shortcut.meta">⌘</kbd>
            <kbd v-if="shortcut.shift">⇧</kbd>
            <kbd v-if="shortcut.alt">⌥</kbd>
            <kbd>{{ formatKey(shortcut.key) }}</kbd>
          </div>
          <div class="shortcut-description">{{ shortcut.description }}</div>
        </div>
      </div>
    </div>
    <div class="shortcuts-overlay" @click="showHelp = false"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useKeyboardShortcuts } from '../composables/useKeyboardShortcuts'

const { shortcuts } = useKeyboardShortcuts()
const showHelp = ref(false)

function formatKey(key: string): string {
  const keyMap: Record<string, string> = {
    'Escape': 'Esc',
    'Enter': 'Enter',
    ' ': 'Space'
  }
  return keyMap[key] || key.toUpperCase()
}

function handleKeyDown(event: KeyboardEvent): void {
  // Show help with ? key (Shift + ? = /)
  if (event.key === '?' && event.shiftKey && !event.ctrlKey && !event.metaKey) {
    const target = event.target as HTMLElement
    const isInput = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA'
    if (!isInput) {
      event.preventDefault()
      showHelp.value = true
    }
  }
  
  // Close help with Escape
  if (event.key === 'Escape' && showHelp.value) {
    showHelp.value = false
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown)
})
</script>

<style scoped>
.shortcuts-help {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.shortcuts-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
}

.shortcuts-content {
  position: relative;
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  max-width: 500px;
  width: 100%;
  max-height: 80vh;
  overflow-y: auto;
  z-index: 1;
}

.shortcuts-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid var(--border);
}

.shortcuts-header h2 {
  font-size: 20px;
  font-weight: 600;
  margin: 0;
  letter-spacing: -0.01em;
}

.shortcuts-list {
  padding: 16px 24px 24px;
}

.shortcut-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 12px 0;
  border-bottom: 1px solid var(--border);
}

.shortcut-item:last-child {
  border-bottom: none;
}

.shortcut-keys {
  display: flex;
  gap: 4px;
  flex-shrink: 0;
}

.shortcut-keys kbd {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 24px;
  height: 24px;
  padding: 0 8px;
  background: var(--panel);
  border: 1px solid var(--border);
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
  font-family: ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace;
  color: var(--text);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.shortcut-description {
  font-size: 14px;
  color: var(--text);
  text-align: right;
  flex: 1;
}

.btn-icon {
  background: transparent;
  border: 1px solid var(--border);
  color: var(--muted);
  cursor: pointer;
  padding: 6px;
  border-radius: var(--radius);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: var(--transition);
  width: 32px;
  height: 32px;
  flex-shrink: 0;
}

.btn-icon:hover {
  background: var(--panel);
  border-color: var(--brand);
  color: var(--text);
}
</style>
