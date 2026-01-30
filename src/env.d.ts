/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  // Use Record<string, never> instead of {} for better type safety
  const component: DefineComponent<Record<string, never>, Record<string, never>, unknown>
  export default component
}

// Extend Vite's import.meta.env types if needed
interface ImportMetaEnv {
  readonly DEV: boolean
  readonly PROD: boolean
  readonly MODE: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
