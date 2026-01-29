import type { AppState } from '../types'
import { toLocalDateInputValue } from '../utils/date'

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

    const themeMode = localStorage.getItem('themeMode')
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
  } {
    const q = new URLSearchParams(location.search)
    const result: ReturnType<typeof loadStateFromURL> = {}

    if (q.get('l')) result.label = q.get('l')!
    if (q.get('d')) result.date = q.get('d')!
    if (q.get('t')) result.time = q.get('t')!

    const u = q.get('u')
    if (u) {
      result.units = u.split(',').filter(Boolean)
    }

    const p = q.get('p')
    if (p) {
      const set = new Set(p.split(',').filter(Boolean))
      result.patterns = {
        rounded: set.has('rounded'),
        repdigit: set.has('repdigit')
      }
    }

    if (q.get('theme')) result.theme = q.get('theme')!
    if (q.get('yf')) result.yearFrom = parseInt(q.get('yf')!, 10)
    if (q.get('yt')) result.yearTo = parseInt(q.get('yt')!, 10)

    return result
  }

  return {
    encodeStateToURL,
    loadStateFromURL
  }
}
