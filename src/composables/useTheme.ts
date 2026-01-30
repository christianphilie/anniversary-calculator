import { ref, onMounted } from 'vue'
import type { Ref } from 'vue'
import { safeLocalStorageGet, safeLocalStorageSet } from '../utils/storage'

export type ThemeMode = 'light' | 'dark' | 'system'

export function useTheme() {
  const themeMode: Ref<ThemeMode> = ref('system')
  const currentTheme = ref<'light' | 'dark'>('light')

  const mm = window.matchMedia('(prefers-color-scheme: dark)')

  function applyTheme(mode: ThemeMode): void {
    themeMode.value = mode
    let theme: 'light' | 'dark'

    if (mode === 'system') {
      theme = mm.matches ? 'dark' : 'light'
    } else {
      theme = mode
    }

    currentTheme.value = theme
    document.body.setAttribute('data-theme', theme)
    document.body.dataset.themeMode = mode
    safeLocalStorageSet('themeMode', mode)
  }

  function updateSystemTheme(): void {
    if (themeMode.value === 'system') {
      applyTheme('system')
    }
  }

  onMounted(() => {
    const saved = (safeLocalStorageGet('themeMode', 'system')) as ThemeMode
    applyTheme(saved)

    if (mm.addEventListener) {
      mm.addEventListener('change', updateSystemTheme)
    }
  })

  return {
    themeMode,
    currentTheme,
    applyTheme
  }
}
