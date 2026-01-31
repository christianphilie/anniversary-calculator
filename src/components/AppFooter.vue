<template>
  <footer class="app-footer">
    <div class="footer-content">
      <p class="footer-text">
        Made with <span class="heart">❤️</span> by
        <a
          href="https://github.com/christianphilie"
          target="_blank"
          rel="noopener noreferrer"
          class="footer-link"
        >
          christianphilie
        </a>
      </p>
      <p class="footer-links">
        <a
          href="https://github.com/christianphilie/anniversary-calculator"
          target="_blank"
          rel="noopener noreferrer"
          class="footer-link"
          :aria-label="t('footer.viewOnGitHub')"
        >
          <span aria-hidden="true">🔗</span> {{ t('footer.viewOnGitHub') }}
        </a>
      </p>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { useI18n } from '../i18n'

const { t } = useI18n()
</script>

<style scoped>
.app-footer {
  margin-top: 24px;
  padding: 16px 0;
  border-top: 1px solid var(--border);
}

.footer-content {
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 13px;
  color: var(--muted);
  line-height: 1.5;
  text-align: center;
  align-items: center;
}

.footer-text {
  margin: 0;
  padding: 0;
}

.footer-links {
  margin: 0;
  padding: 0;
}

.heart {
  display: inline-block;
  animation: heartbeat 1.5s ease-in-out infinite;
}

@keyframes heartbeat {
  0%, 100% {
    transform: scale(1);
  }
  10%, 30% {
    transform: scale(1.1);
  }
  20%, 40% {
    transform: scale(1);
  }
}

.footer-link {
  color: var(--text);
  text-decoration: none;
  font-weight: 500;
  transition: var(--transition);
  display: inline-flex;
  align-items: center;
  gap: 4px;
  border-bottom: 1px solid transparent;
}

.footer-link:hover {
  color: var(--brand);
  border-bottom-color: var(--brand);
}

.footer-link:focus-visible {
  outline: none;
  box-shadow: var(--focus);
  border-radius: 4px;
}

@media (max-width: 768px) {
  .app-footer {
    margin-top: 20px;
    padding: 12px 0;
  }
  
  .footer-content {
    font-size: 12px;
  }
}
</style>
