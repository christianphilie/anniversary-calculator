import { ref, computed } from 'vue'
import type { Ref } from 'vue'
import de from './locales/de'
import en from './locales/en'
import { updateFormatters } from '../utils/i18n'
import { safeLocalStorageGet, safeLocalStorageSet } from '../utils/storage'
import { warn } from '../utils/logger'

export type Locale = 'de' | 'en'

const LOCALE_KEY = 'app-locale'

/**
 * i18n Architecture Note:
 * 
 * This file (src/i18n/index.ts) handles:
 * - Translation management (t function)
 * - Locale switching
 * - Message loading from locale files
 * 
 * The file src/utils/i18n.ts handles:
 * - Date/number formatting (Intl.DateTimeFormat, Intl.NumberFormat)
 * - Unit label formatting (getUnitLabel, humanDiff)
 * - Locale-aware formatting utilities
 * 
 * This separation is intentional:
 * - i18n/index.ts: High-level translation system
 * - utils/i18n.ts: Low-level formatting utilities
 * 
 * Both files work together but serve different purposes.
 */

// Singleton instance
let i18nInstance: ReturnType<typeof createI18n> | null = null

function createI18n() {
  const initialLocale = (safeLocalStorageGet(LOCALE_KEY, 'de')) as Locale
  const locale: Ref<Locale> = ref(initialLocale)
  
  // Initialize formatters with initial locale
  updateFormatters(initialLocale)
  
  const messages = {
    de,
    en
  }

  const t = computed(() => {
    return (key: string, params?: Record<string, string | number>): string => {
      const keys = key.split('.')
      let value: any = messages[locale.value]
      
      for (const k of keys) {
        value = value?.[k]
      }
      
      if (typeof value !== 'string') {
        warn(`Translation missing for key: ${key}`)
        return key
      }
      
      // Replace placeholders
      if (params) {
        return value.replace(/\{\{(\w+)\}\}/g, (match, paramKey) => {
          return params[paramKey]?.toString() || match
        })
      }
      
      return value
    }
  })

  function setLocale(newLocale: Locale): void {
    locale.value = newLocale
    safeLocalStorageSet(LOCALE_KEY, newLocale)
    document.documentElement.lang = newLocale
    updateFormatters(newLocale)
  }

  return {
    locale,
    t,
    setLocale
  }
}

/**
 * Composable hook for internationalization.
 * Provides reactive translation function and locale management.
 * 
 * @returns Object with locale, translation function, and setLocale method
 * @example
 * ```typescript
 * const { locale, t, setLocale } = useI18n()
 * const text = t.value('common.save')
 * setLocale('en')
 * ```
 */
export function useI18n() {
  if (!i18nInstance) {
    i18nInstance = createI18n()
    // Set initial lang attribute
    document.documentElement.lang = i18nInstance.locale.value
  }
  return i18nInstance
}
