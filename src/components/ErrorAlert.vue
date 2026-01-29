<template>
  <div v-if="error" class="error-alert" role="alert" aria-live="polite">
    <div class="error-content">
      <span class="error-icon">⚠️</span>
      <span class="error-message">{{ error.message }}</span>
      <button
        class="error-close"
        aria-label="Fehler schließen"
        @click="clearError"
      >
        ✕
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useError } from '../composables/useError'

const { error, clearError } = useError()
</script>

<style scoped>
.error-alert {
  background: var(--card);
  border: 1px solid #ef4444;
  border-radius: var(--radius-lg);
  padding: 14px 18px;
  margin-bottom: 20px;
  animation: slideIn 0.2s cubic-bezier(0.4,0,0.2,1);
  box-shadow: 0 1px 3px 0 rgba(239,68,68,0.1),0 1px 2px 0 rgba(239,68,68,0.06);
}

.error-content {
  display: flex;
  align-items: center;
  gap: 10px;
}

.error-icon {
  font-size: 20px;
  flex-shrink: 0;
}

.error-message {
  flex: 1;
  color: #ef4444;
  font-weight: 600;
  font-size: 14px;
}

.error-close {
  background: transparent;
  border: none;
  color: var(--muted);
  cursor: pointer;
  font-size: 18px;
  padding: 0;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius);
  transition: all 0.15s cubic-bezier(0.4,0,0.2,1);
  flex-shrink: 0;
}

.error-close:hover {
  background: var(--panel);
  color: var(--text);
  transform: scale(1.1);
}

.error-close:focus-visible {
  outline: none;
  box-shadow: var(--focus);
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

[data-theme="dark"] .error-alert {
  border-color: #f87171;
}

[data-theme="dark"] .error-message {
  color: #f87171;
}
</style>
