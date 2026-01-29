import { ref, provide, inject } from 'vue'
import type { Ref } from 'vue'

export interface AppError {
  message: string
  code?: string
  timestamp: Date
}

const ERROR_KEY = Symbol('error')

interface ErrorState {
  error: Ref<AppError | null>
  hasError: Ref<boolean>
  setError: (message: string, code?: string) => void
  clearError: () => void
  handleError: (err: unknown, defaultMessage?: string) => void
}

// Singleton instance
let errorStateInstance: ErrorState | null = null

function createErrorState(): ErrorState {
  const error: Ref<AppError | null> = ref(null)
  const hasError = ref(false)
  let timeoutId: ReturnType<typeof setTimeout> | null = null

  function setError(message: string, code?: string): void {
    if (timeoutId) {
      clearTimeout(timeoutId)
      timeoutId = null
    }

    error.value = {
      message,
      code,
      timestamp: new Date()
    }
    hasError.value = true
    
    // Auto-clear error after 5 seconds
    timeoutId = setTimeout(() => {
      clearError()
    }, 5000)
  }

  function clearError(): void {
    if (timeoutId) {
      clearTimeout(timeoutId)
      timeoutId = null
    }
    error.value = null
    hasError.value = false
  }

  function handleError(err: unknown, defaultMessage = 'Ein unerwarteter Fehler ist aufgetreten'): void {
    if (err instanceof Error) {
      setError(err.message, err.name)
    } else if (typeof err === 'string') {
      setError(err)
    } else {
      setError(defaultMessage)
    }
    console.error('Error:', err)
  }

  return {
    error,
    hasError,
    setError,
    clearError,
    handleError
  }
}

export function useError(): ErrorState {
  // Try to inject first (if provided by parent)
  const injected = inject<ErrorState | undefined>(ERROR_KEY)
  if (injected) {
    return injected
  }

  // Otherwise use singleton instance
  if (!errorStateInstance) {
    errorStateInstance = createErrorState()
  }
  return errorStateInstance
}

export function provideError(): ErrorState {
  const errorState = createErrorState()
  provide(ERROR_KEY, errorState)
  return errorState
}
