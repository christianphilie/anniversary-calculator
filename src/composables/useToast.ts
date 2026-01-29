import { ref } from 'vue'
import type { Ref } from 'vue'

export interface Toast {
  id: string
  message: string
  type: 'success' | 'error' | 'info'
  duration?: number
}

interface ToastState {
  toasts: Ref<Toast[]>
  show: (message: string, type?: Toast['type'], duration?: number) => void
  success: (message: string, duration?: number) => void
  error: (message: string, duration?: number) => void
  info: (message: string, duration?: number) => void
  remove: (id: string) => void
}

let toastStateInstance: ToastState | null = null

function createToastState(): ToastState {
  const toasts: Ref<Toast[]> = ref([])
  let toastIdCounter = 0

  function show(message: string, type: Toast['type'] = 'info', duration = 3000): void {
    const id = `toast-${++toastIdCounter}-${Date.now()}`
    const toast: Toast = { id, message, type, duration }
    
    toasts.value.push(toast)

    if (duration > 0) {
      setTimeout(() => {
        remove(id)
      }, duration)
    }
  }

  function success(message: string, duration = 3000): void {
    show(message, 'success', duration)
  }

  function error(message: string, duration = 5000): void {
    show(message, 'error', duration)
  }

  function info(message: string, duration = 3000): void {
    show(message, 'info', duration)
  }

  function remove(id: string): void {
    const index = toasts.value.findIndex(t => t.id === id)
    if (index > -1) {
      toasts.value.splice(index, 1)
    }
  }

  return {
    toasts,
    show,
    success,
    error,
    info,
    remove
  }
}

export function useToast(): ToastState {
  if (!toastStateInstance) {
    toastStateInstance = createToastState()
  }
  return toastStateInstance
}
