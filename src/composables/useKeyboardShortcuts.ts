import { onMounted, onUnmounted } from 'vue'
import { useTheme } from './useTheme'
import { useAppState } from './useAppState'
import { useError } from './useError'

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
  const { toggleTheme } = useTheme()
  const { state } = useAppState()
  const { clearError, error } = useError()

  const shortcuts: KeyboardShortcut[] = [
    {
      key: 'k',
      ctrl: true,
      meta: true,
      handler: () => {
        // Toggle between light and dark theme
        toggleTheme()
      },
      description: 'Theme wechseln',
      global: true
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
        // Download ICS file if there are visible milestones
        if (state.value.eventsView.length > 0) {
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
      key: 'ArrowUp',
      ctrl: true,
      meta: false,
      handler: () => {
        // Navigate to previous year in results
        const yearSeparators = Array.from(document.querySelectorAll('.year-sep')) as HTMLElement[]
        const currentScroll = window.scrollY
        let targetYear: HTMLElement | null = null
        
        for (let i = yearSeparators.length - 1; i >= 0; i--) {
          const rect = yearSeparators[i].getBoundingClientRect()
          if (rect.top < currentScroll + 100) {
            targetYear = yearSeparators[i]
            break
          }
        }
        
        if (targetYear) {
          const prevBtn = targetYear.querySelector('.year-nav-up') as HTMLButtonElement
          if (prevBtn && !prevBtn.disabled) {
            prevBtn.click()
          }
        }
      },
      description: 'Zu vorherigem Jahr springen',
      global: true
    },
    {
      key: 'ArrowDown',
      ctrl: true,
      meta: false,
      handler: () => {
        // Navigate to next year in results
        const yearSeparators = Array.from(document.querySelectorAll('.year-sep')) as HTMLElement[]
        const currentScroll = window.scrollY
        let targetYear: HTMLElement | null = null
        
        for (let i = 0; i < yearSeparators.length; i++) {
          const rect = yearSeparators[i].getBoundingClientRect()
          if (rect.top > currentScroll + 100) {
            targetYear = yearSeparators[i]
            break
          }
        }
        
        if (targetYear) {
          const nextBtn = targetYear.querySelector('.year-nav-down') as HTMLButtonElement
          if (nextBtn && !nextBtn.disabled) {
            nextBtn.click()
          }
        }
      },
      description: 'Zu nächstem Jahr springen',
      global: true
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
