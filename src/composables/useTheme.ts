import { ref, onMounted } from 'vue'
import type { Ref } from 'vue'

export type ThemeMode = 'light' | 'dark'

export function useTheme() {
  const themeMode: Ref<ThemeMode> = ref('light')
  const currentTheme = ref<'light' | 'dark'>('light')

  const mm = window.matchMedia('(prefers-color-scheme: dark)')

  function getSystemTheme(): 'light' | 'dark' {
    return mm.matches ? 'dark' : 'light'
  }

  function applyTheme(mode: ThemeMode): void {
    themeMode.value = mode
    currentTheme.value = mode
    document.body.setAttribute('data-theme', mode)
    document.body.dataset.themeMode = mode
    
    // Store in sessionStorage for session persistence
    try {
      sessionStorage.setItem('themeMode', mode)
    } catch (e) {
      // Ignore storage errors
    }
  }

  function toggleTheme(): void {
    const newMode: ThemeMode = currentTheme.value === 'light' ? 'dark' : 'light'
    applyTheme(newMode)
  }

  function updateSystemTheme(): void {
    // Only update if no manual selection was made (check sessionStorage)
    try {
      const saved = sessionStorage.getItem('themeMode')
      if (!saved) {
        // No manual selection, use system preference
        const systemTheme = getSystemTheme()
        applyTheme(systemTheme)
      }
    } catch (e) {
      // Ignore storage errors
    }
  }

  onMounted(() => {
    // Check sessionStorage first (manual selection)
    let saved: ThemeMode | null = null
    try {
      const sessionValue = sessionStorage.getItem('themeMode')
      if (sessionValue === 'light' || sessionValue === 'dark') {
        saved = sessionValue as ThemeMode
      }
    } catch (e) {
      // Ignore storage errors
    }

    // If no manual selection, use system preference
    if (!saved) {
      saved = getSystemTheme()
    }

    applyTheme(saved)

    // Listen for system theme changes (only if no manual selection)
    if (mm.addEventListener) {
      mm.addEventListener('change', updateSystemTheme)
    }
  })

  return {
    themeMode,
    currentTheme,
    applyTheme,
    toggleTheme
  }
}
