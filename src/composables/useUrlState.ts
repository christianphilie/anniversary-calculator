import type { AppState } from '../types'
import { toLocalDateInputValue } from '../utils/date'
import { sanitizeUrlParam, sanitizeLabel } from '../utils/sanitize'
import { parseShareUrl } from '../utils/share'
import { safeLocalStorageGet } from '../utils/storage'

export function useUrlState(state: { value: AppState }) {
  function encodeStateToURL(): void {
    const params = new URLSearchParams()

    if (state.value.label) {
      params.set('l', state.value.label)
    }

    if (state.value.start) {
      params.set('d', toLocalDateInputValue(state.value.start))
      // Time would need to be stored separately
      if (state.value.yearFrom !== null) {
        params.set('yf', String(state.value.yearFrom))
      }
      if (state.value.yearTo !== null) {
        params.set('yt', String(state.value.yearTo))
      }
    }

    params.set('u', state.value.units.join(','))
    params.set(
      'p',
      Object.entries(state.value.patterns)
        .filter(([, v]) => v)
        .map(([k]) => k)
        .join(',')
    )

    const themeMode = safeLocalStorageGet('themeMode', '')
    if (themeMode) {
      params.set('theme', themeMode)
    }

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

    // Sanitize label
    const labelParam = sanitizeUrlParam(q.get('l'))
    if (labelParam) {
      result.label = sanitizeLabel(labelParam)
    }

    // Validate date format (YYYY-MM-DD)
    const dateParam = q.get('d')
    if (dateParam && /^\d{4}-\d{2}-\d{2}$/.test(dateParam)) {
      result.date = dateParam
    }

    // Validate time format (HH:MM or HH:MM:SS)
    const timeParam = q.get('t')
    if (timeParam && /^([0-1][0-9]|2[0-3]):([0-5][0-9])(:([0-5][0-9]))?$/.test(timeParam)) {
      result.time = timeParam
    }

    // Validate units
    const u = q.get('u')
    if (u) {
      const validUnits = ['years', 'months', 'weeks', 'days', 'hours', 'minutes', 'seconds']
      const units = u.split(',').filter(Boolean).filter(unit => validUnits.includes(unit))
      if (units.length > 0) {
        result.units = units
      }
    }

    // Validate patterns
    const p = q.get('p')
    if (p) {
      const set = new Set(p.split(',').filter(Boolean))
      result.patterns = {
        rounded: set.has('rounded'),
        repdigit: set.has('repdigit')
      }
    }

    // Validate theme
    const themeParam = q.get('theme')
    if (themeParam && ['light', 'dark', 'system'].includes(themeParam)) {
      result.theme = themeParam
    }

    // Validate year range
    const yfParam = q.get('yf')
    if (yfParam) {
      const yearFrom = parseInt(yfParam, 10)
      if (!isNaN(yearFrom) && yearFrom >= 1900 && yearFrom <= 2200) {
        result.yearFrom = yearFrom
      }
    }

    const ytParam = q.get('yt')
    if (ytParam) {
      const yearTo = parseInt(ytParam, 10)
      if (!isNaN(yearTo) && yearTo >= 1900 && yearTo <= 2200) {
        result.yearTo = yearTo
      }
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
