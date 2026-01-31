export type Unit = 'years' | 'months' | 'weeks' | 'days' | 'hours' | 'minutes' | 'seconds'

export type PatternType = 'rounded' | 'repdigit'

export interface Patterns {
  rounded: boolean
  repdigit: boolean
}

export interface MilestoneEvent {
  id: string
  unit: Unit
  n: number
  date: Date
  baseTitle: string
  since: string
  inHuman: string
  desc: string
  patterns: {
    rounded: boolean
    repdigit: boolean
  }
}

export interface AppState {
  start: Date | null
  label: string
  units: Unit[]
  patterns: Patterns
  eventsAll: MilestoneEvent[]
  eventsView: MilestoneEvent[]
  selected: Set<string>
  yearFrom: number | null
  yearTo: number | null
}

export interface ThemeMode {
  mode: 'light' | 'dark' | 'system'
}

export const CONFIG = {
  MAX_SPAN: 300,
  DEBOUNCE_DELAY: 120,
  MIN_N: {
    seconds: 10_000_000,
    minutes: 100_000,
    hours: 1_000,
    days: 100,
    weeks: 10,
    months: 10,
    years: 1
  },
  REPDIGIT_MAX_LENGTH: 12,
  DEFAULT_TIME: '12:00:00'
} as const
