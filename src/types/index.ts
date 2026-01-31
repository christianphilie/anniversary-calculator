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
  DEFAULT_TIME: '12:00:00',
  // Year range constants
  MAX_YEARS_IN_FUTURE: 100, // Maximum years in the future from current year
  YEARS_TO_ADD_ON_EXPAND: 10, // Years to add when expanding range
  // UI constants
  STICKY_HEADER_OFFSET_DESKTOP: 192, // Total height of sticky elements on desktop
  STICKY_HEADER_OFFSET_MOBILE: 92, // Total height of sticky elements on mobile
  SCROLL_THRESHOLD: 100 // Pixels threshold for scroll detection
} as const
