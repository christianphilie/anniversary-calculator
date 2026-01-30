import type { Unit } from '../types'

// German unit labels
const unitDE: Record<Unit, [string, string, string]> = {
  years: ['Jahr', 'Jahre', 'Jahren'],
  months: ['Monat', 'Monate', 'Monaten'],
  weeks: ['Woche', 'Wochen', 'Wochen'],
  days: ['Tag', 'Tage', 'Tagen'],
  hours: ['Stunde', 'Stunden', 'Stunden'],
  minutes: ['Minute', 'Minuten', 'Minuten'],
  seconds: ['Sekunde', 'Sekunden', 'Sekunden']
}

export function labelDE(unit: Unit, n: number): string {
  return n === 1 ? unitDE[unit][0] : unitDE[unit][1]
}

export function dativeDE(unit: Unit, n: number): string {
  return n === 1 ? unitDE[unit][0] : unitDE[unit][2]
}

// English unit labels
const unitEN: Record<Unit, [string, string]> = {
  years: ['year', 'years'],
  months: ['month', 'months'],
  weeks: ['week', 'weeks'],
  days: ['day', 'days'],
  hours: ['hour', 'hours'],
  minutes: ['minute', 'minutes'],
  seconds: ['second', 'seconds']
}

export function labelEN(unit: Unit, n: number): string {
  return n === 1 ? unitEN[unit][0] : unitEN[unit][1]
}

export function getUnitLabel(unit: Unit, n: number, locale: 'de' | 'en' = 'de'): string {
  return locale === 'en' ? labelEN(unit, n) : labelDE(unit, n)
}

export function humanDiff(from: Date, to: Date, locale: 'de' | 'en' = 'de'): string {
  const future = to >= from
  const ms = Math.abs(to.getTime() - from.getTime())
  const s = Math.floor(ms / 1000)
  const m = Math.floor(s / 60)
  const h = Math.floor(m / 60)
  const d = Math.floor(h / 24)
  const mo = Math.floor(d / 30.44)
  const y = Math.floor(d / 365.2425)

  if (locale === 'en') {
    const prefix = future ? 'in ' : ''
    const suffix = future ? '' : ' ago'
    
    if (y > 0) return `${prefix}${y} ${labelEN('years', y)}${suffix}`
    if (mo > 0) return `${prefix}${mo} ${labelEN('months', mo)}${suffix}`
    const w = Math.floor(d / 7)
    if (w > 0) return `${prefix}${w} ${labelEN('weeks', w)}${suffix}`
    if (d > 0) return `${prefix}${d} ${labelEN('days', d)}${suffix}`
    if (h > 0) return `${prefix}${h} ${labelEN('hours', h)}${suffix}`
    if (m > 0) return `${prefix}${m} ${labelEN('minutes', m)}${suffix}`
    return `${prefix}${s} ${labelEN('seconds', s)}${suffix}`
  }

  // German
  const prefix = future ? 'in ' : 'vor '

  if (y > 0) return `${prefix}${y} ${dativeDE('years', y)}`
  if (mo > 0) return `${prefix}${mo} ${dativeDE('months', mo)}`
  const w = Math.floor(d / 7)
  if (w > 0) return `${prefix}${w} ${dativeDE('weeks', w)}`
  if (d > 0) return `${prefix}${d} ${dativeDE('days', d)}`
  if (h > 0) return `${prefix}${h} ${dativeDE('hours', h)}`
  if (m > 0) return `${prefix}${m} ${dativeDE('minutes', m)}`
  return `${prefix}${s} ${dativeDE('seconds', s)}`
}

// Formatters - reactive to locale
export function getDateFormatter(locale: 'de' | 'en' = 'de'): Intl.DateTimeFormat {
  return new Intl.DateTimeFormat(locale === 'en' ? 'en-US' : 'de-DE', {
    dateStyle: 'full',
    timeStyle: 'short'
  })
}

export function getNumberFormatter(locale: 'de' | 'en' = 'de'): Intl.NumberFormat {
  return new Intl.NumberFormat(locale === 'en' ? 'en-US' : 'de-DE')
}

// Legacy exports for backward compatibility (will use current locale)
let currentLocale: 'de' | 'en' = 'de'

// Update formatters when locale changes
export function updateFormatters(locale: 'de' | 'en'): void {
  currentLocale = locale
}

// Reactive formatters that use current locale
export function fmtFull(): Intl.DateTimeFormat {
  return getDateFormatter(currentLocale)
}

export function fmtNum(): Intl.NumberFormat {
  return getNumberFormatter(currentLocale)
}
