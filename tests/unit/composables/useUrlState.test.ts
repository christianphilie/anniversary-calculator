import { describe, it, expect, beforeEach } from 'vitest'
import type { AppState } from '@/types'
import { useUrlState } from '@/composables/useUrlState'

function createState(start: Date | null): { value: AppState } {
  return {
    value: {
      start,
      label: 'Test',
      units: ['years', 'months'],
      patterns: { rounded: true, repdigit: false },
      eventsAll: [],
      eventsView: [],
      selected: new Set<string>(),
      favoriteIds: new Set<string>(),
      exportOnlyFavorites: false,
      yearFrom: 2020,
      yearTo: 2030
    }
  }
}

describe('useUrlState', () => {
  beforeEach(() => {
    window.history.replaceState({}, '', '/')
  })

  it('encodes time into URL when start date exists', () => {
    const state = createState(new Date(2020, 0, 15, 5, 6, 7))
    const { encodeStateToURL } = useUrlState(state)

    encodeStateToURL()

    const params = new URLSearchParams(window.location.search)
    expect(params.get('d')).toBe('2020-01-15')
    expect(params.get('t')).toBe('05:06:07')
  })

  it('loads valid time from URL', () => {
    window.history.replaceState({}, '', '/?t=09:45:12')

    const state = createState(null)
    const { loadStateFromURL } = useUrlState(state)

    expect(loadStateFromURL().time).toBe('09:45:12')
  })

  it('ignores invalid time from URL', () => {
    window.history.replaceState({}, '', '/?t=99:00')

    const state = createState(null)
    const { loadStateFromURL } = useUrlState(state)

    expect(loadStateFromURL().time).toBeUndefined()
  })
})
