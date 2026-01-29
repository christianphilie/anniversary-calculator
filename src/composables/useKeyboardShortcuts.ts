import { onMounted, onUnmounted } from 'vue'
import { useTheme } from './useTheme'
import { useAppState } from './useAppState'
import { useError } from './useError'
import { copyToClipboard, formatMilestoneText } from '../utils/clipboard'
import { useToast } from './useToast'

export interface KeyboardShortcut {
  key: string
  ctrl?: boolean
  meta?: boolean
  shift?: boolean
  alt?: boolean
  handler: () => void
  description: string
  global?: boolean // If true, works even when input is focused
}

export function useKeyboardShortcuts() {
  const { applyTheme, themeMode } = useTheme()
  const { state, selectAll, visibleSelected } = useAppState()
  const { clearError, error } = useError()
  const { success } = useToast()

  const shortcuts: KeyboardShortcut[] = [
    {
      key: 'k',
      ctrl: true,
      meta: true,
      handler: () => {
        // Cycle through themes: light -> dark -> system -> light
        const themes: Array<'light' | 'dark' | 'system'> = ['light', 'dark', 'system']
        const currentIndex = themes.indexOf(themeMode.value)
        const nextIndex = (currentIndex + 1) % themes.length
        applyTheme(themes[nextIndex])
      },
      description: 'Theme wechseln',
      global: true
    },
    {
      key: 'a',
      ctrl: true,
      meta: true,
      handler: () => {
        if (state.value.eventsView.length > 0) {
          selectAll()
        }
      },
      description: 'Alle Meilensteine auswählen',
      global: false // Only when not in input field
    },
    {
      key: 'Escape',
      handler: () => {
        if (error.value) {
          clearError()
        }
      },
      description: 'Fehler schließen',
      global: true
    },
    {
      key: 'Enter',
      ctrl: true,
      meta: true,
      handler: () => {
        // Trigger form submit if in InputPanel
        const form = document.querySelector('form')
        if (form) {
          const submitEvent = new Event('submit', { bubbles: true, cancelable: true })
          form.dispatchEvent(submitEvent)
        }
      },
      description: 'Berechnung starten',
      global: false
    },
    {
      key: 'd',
      ctrl: true,
      meta: true,
      handler: () => {
        // Download if there are selected milestones
        if (visibleSelected.value.length > 0) {
          const downloadBtn = document.querySelector('[aria-label*="Kalenderdatei"]') as HTMLButtonElement
          if (downloadBtn && !downloadBtn.disabled) {
            downloadBtn.click()
          }
        }
      },
      description: 'Kalenderdatei herunterladen',
      global: false
    },
    {
      key: 'c',
      ctrl: true,
      meta: true,
      handler: async () => {
        // Copy first selected milestone if any
        if (visibleSelected.value.length > 0) {
          const firstSelected = visibleSelected.value[0]
          const text = formatMilestoneText(firstSelected, state.value.label)
          const copied = await copyToClipboard(text)
          if (copied) {
            success('Meilenstein kopiert')
          }
        }
      },
      description: 'Ersten ausgewählten Meilenstein kopieren',
      global: false
    }
  ]

  function handleKeyDown(event: KeyboardEvent): void {
    // Don't trigger shortcuts when user is typing in input fields
    const target = event.target as HTMLElement
    const isInput = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable
    
    // Check if a shortcut matches
    for (const shortcut of shortcuts) {
      // Skip if shortcut is not global and user is typing
      if (!shortcut.global && isInput) {
        continue
      }

      // Check modifier keys
      const ctrlMatch = shortcut.ctrl ? (event.ctrlKey || event.metaKey) : !event.ctrlKey && !event.metaKey
      const metaMatch = shortcut.meta ? (event.ctrlKey || event.metaKey) : !event.ctrlKey && !event.metaKey
      const shiftMatch = shortcut.shift === undefined ? true : event.shiftKey === shortcut.shift
      const altMatch = shortcut.alt === undefined ? true : event.altKey === shortcut.alt

      // Check if key matches (case-insensitive for letter keys)
      const keyMatch = shortcut.key.toLowerCase() === event.key.toLowerCase()

      if (keyMatch && ctrlMatch && metaMatch && shiftMatch && altMatch) {
        event.preventDefault()
        event.stopPropagation()
        shortcut.handler()
        break
      }
    }
  }

  onMounted(() => {
    window.addEventListener('keydown', handleKeyDown)
  })

  onUnmounted(() => {
    window.removeEventListener('keydown', handleKeyDown)
  })

  return {
    shortcuts
  }
}
