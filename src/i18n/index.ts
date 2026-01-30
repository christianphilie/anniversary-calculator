import { ref, computed } from 'vue'
import type { Ref } from 'vue'
import de from './locales/de'
import en from './locales/en'
import { updateFormatters } from '../utils/i18n'

export type Locale = 'de' | 'en'

const LOCALE_KEY = 'app-locale'

// Singleton instance
let i18nInstance: ReturnType<typeof createI18n> | null = null

function createI18n() {
  const initialLocale = (localStorage.getItem(LOCALE_KEY) || 'de') as Locale
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
        console.warn(`Translation missing for key: ${key}`)
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
    localStorage.setItem(LOCALE_KEY, newLocale)
    document.documentElement.lang = newLocale
    updateFormatters(newLocale)
  }

  return {
    locale,
    t,
    setLocale
  }
}

export function useI18n() {
  if (!i18nInstance) {
    i18nInstance = createI18n()
    // Set initial lang attribute
    document.documentElement.lang = i18nInstance.locale.value
  }
  return i18nInstance
}
