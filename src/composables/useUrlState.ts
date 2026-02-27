import type { AppState } from '../types'
import { toLocalDateInputValue, toLocalTimeInputValue } from '../utils/date'
import { sanitizeUrlParam, sanitizeLabel } from '../utils/sanitize'
import { parseShareUrl } from '../utils/share'
import { safeLocalStorageGet } from '../utils/storage'
import {
  getUrlParam,
  setUrlParam,
  isValidDateParam,
  isValidTimeParam,
  parseYearParam,
  parseUnitsParam,
  parsePatternsParam,
  parseThemeParam
} from '../utils/url'

const VALID_UNITS = ['years', 'months', 'weeks', 'days', 'hours', 'minutes', 'seconds'] as const
const VALID_THEMES = ['light', 'dark', 'system'] as const

export function useUrlState(state: { value: AppState }) {
  function encodeStateToURL(): void {
    const params = new URLSearchParams()

    setUrlParam(params, 'l', state.value.label)

    if (state.value.start) {
      setUrlParam(params, 'd', toLocalDateInputValue(state.value.start))
      setUrlParam(params, 't', toLocalTimeInputValue(state.value.start))
      setUrlParam(params, 'yf', state.value.yearFrom)
      setUrlParam(params, 'yt', state.value.yearTo)
    }

    setUrlParam(params, 'u', state.value.units.join(','))
    setUrlParam(
      params,
      'p',
      Object.entries(state.value.patterns)
        .filter(([, v]) => v)
        .map(([k]) => k)
        .join(',')
    )

    const themeMode = safeLocalStorageGet('themeMode', '')
    setUrlParam(params, 'theme', themeMode || null)

    // Remove milestone IDs parameter if present (not needed for sharing)
    params.delete('m')

    history.replaceState(null, '', '?' + params.toString())
  }

  function loadStateFromURL(): {
    label?: string
    date?: string
    time?: string
    units?: string[]
    patterns?: { rounded: boolean; repdigit: boolean }
    theme?: string
    yearFrom?: number
    yearTo?: number
    milestoneIds?: string[]
  } {
    const q = new URLSearchParams(location.search)
    const result: ReturnType<typeof loadStateFromURL> = {}

    // Sanitize and validate label
    const labelParam = sanitizeUrlParam(getUrlParam(q, 'l'))
    if (labelParam) {
      result.label = sanitizeLabel(labelParam)
    }

    // Validate date format (YYYY-MM-DD)
    const dateParam = getUrlParam(q, 'd')
    if (isValidDateParam(dateParam) && dateParam !== null) {
      result.date = dateParam
    }

    // Validate time format (HH:MM or HH:MM:SS)
    const timeParam = getUrlParam(q, 't')
    if (isValidTimeParam(timeParam) && timeParam !== null) {
      result.time = timeParam
    }

    // Validate units
    const unitsParam = getUrlParam(q, 'u')
    const units = parseUnitsParam(unitsParam, VALID_UNITS as unknown as string[])
    if (units.length > 0) {
      result.units = units as typeof VALID_UNITS[number][]
    }

    // Validate patterns
    const patternsParam = getUrlParam(q, 'p')
    const patterns = parsePatternsParam(patternsParam)
    if (patterns) {
      result.patterns = patterns
    }

    // Validate theme
    const themeParam = parseThemeParam(getUrlParam(q, 'theme'), VALID_THEMES as unknown as string[])
    if (themeParam) {
      result.theme = themeParam
    }

    // Validate year range
    const yearFrom = parseYearParam(getUrlParam(q, 'yf'))
    if (yearFrom !== null) {
      result.yearFrom = yearFrom
    }

    const yearTo = parseYearParam(getUrlParam(q, 'yt'))
    if (yearTo !== null) {
      result.yearTo = yearTo
    }

    // Parse milestone IDs from share URL
    const milestoneIds = parseShareUrl()
    if (milestoneIds.length > 0) {
      result.milestoneIds = milestoneIds
    }

    return result
  }

  return {
    encodeStateToURL,
    loadStateFromURL
  }
}
