<template>
  <Teleport to="body">
    <div class="toast-container" aria-live="polite" aria-atomic="true">
      <TransitionGroup name="toast" tag="div">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          :class="['toast', `toast-${toast.type}`]"
          role="alert"
        >
          <span class="toast-icon">{{ getIcon(toast.type) }}</span>
          <span class="toast-message">{{ toast.message }}</span>
          <button
            class="toast-close"
            aria-label="Schließen"
            @click="remove(toast.id)"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { Teleport, TransitionGroup } from 'vue'
import { useToast } from '../composables/useToast'

const { toasts, remove } = useToast()

function getIcon(type: 'success' | 'error' | 'info'): string {
  const icons = {
    success: '✓',
    error: '✕',
    info: 'ℹ'
  }
  return icons[type]
}
</script>

<style scoped>
.toast-container {
  position: fixed;
  top: 24px;
  right: 24px;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 8px;
  pointer-events: none;
}

.toast {
  display: flex;
  align-items: center;
  gap: 12px;
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 14px 16px;
  box-shadow: var(--shadow-lg);
  min-width: 300px;
  max-width: 400px;
  pointer-events: auto;
  animation: slideInRight 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.toast-success {
  border-left: 3px solid #10b981;
}

.toast-error {
  border-left: 3px solid #ef4444;
}

.toast-info {
  border-left: 3px solid var(--brand);
}

.toast-icon {
  font-size: 18px;
  font-weight: 600;
  flex-shrink: 0;
  width: 20px;
  text-align: center;
}

.toast-success .toast-icon {
  color: #10b981;
}

.toast-error .toast-icon {
  color: #ef4444;
}

.toast-info .toast-icon {
  color: var(--brand);
}

.toast-message {
  flex: 1;
  font-size: 14px;
  font-weight: 500;
  color: var(--text);
  line-height: 1.4;
}

.toast-close {
  background: transparent;
  border: none;
  color: var(--muted);
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius);
  transition: var(--transition);
  flex-shrink: 0;
  width: 24px;
  height: 24px;
}

.toast-close:hover {
  background: var(--panel);
  color: var(--text);
}

.toast-enter-active,
.toast-leave-active {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(100%);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

[data-theme="dark"] .toast-success {
  border-left-color: #34d399;
}

[data-theme="dark"] .toast-error {
  border-left-color: #f87171;
}
</style>
