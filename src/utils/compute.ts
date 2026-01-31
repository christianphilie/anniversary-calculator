import type { MilestoneEvent, Unit, Patterns } from '../types'
import { CONFIG } from '../types'
import { addYears, addMonths, addWeeks, addDays, addHours, addMinutes, addSeconds, diffMonths, yearsBetween, MS } from './date'
import { buildCandidates, classifyPatterns } from './patterns'
import { getUnitLabel, humanDiff, getDateFormatter, getNumberFormatter } from './i18n'

type UnitAdder = (date: Date, n: number) => Date

const unitAdder: Record<Unit, UnitAdder> = {
  years: addYears,
  months: addMonths,
  weeks: addWeeks,
  days: addDays,
  hours: addHours,
  minutes: addMinutes,
  seconds: addSeconds
}

const unitMs: Partial<Record<Unit, number>> = {
  weeks: MS.week,
  days: MS.day,
  hours: MS.hour,
  minutes: MS.minute,
  seconds: MS.second
}

export interface ComputeOptions {
  label: string
  units: Unit[]
  patterns: Patterns
  locale?: 'de' | 'en'
}

/**
 * Computes milestone events within a given date range window (inclusive)
 * 
 * @param start - The starting date for milestone calculations
 * @param opts - Options including label, units, and patterns to match
 * @param from - The start of the date range window (inclusive)
 * @param to - The end of the date range window (inclusive)
 * @returns Array of milestone events sorted by date and then by number
 * 
 * @example
 * ```ts
 * const events = computeRangeWindow(
 *   new Date('2020-01-01'),
 *   { label: 'Birthday', units: ['years'], patterns: { rounded: true, repdigit: false } },
 *   new Date('2020-01-01'),
 *   new Date('2030-01-01')
 * )
 * ```
 */
export function computeRangeWindow(
  start: Date,
  opts: ComputeOptions,
  from: Date,
  to: Date
): MilestoneEvent[] {
  const evs: MilestoneEvent[] = []

  // Pre-classify patterns for all candidates to avoid redundant calculations
  // Build candidates once per unit and cache pattern classification
  const patternCache = new Map<number, { rounded: boolean; repdigit: boolean }>()

  function getPatterns(n: number): { rounded: boolean; repdigit: boolean } {
    if (!patternCache.has(n)) {
      patternCache.set(n, classifyPatterns(n))
    }
    return patternCache.get(n)!
  }

  function push(date: Date, n: number, unit: Unit, patterns: { rounded: boolean; repdigit: boolean }): void {
    if (date < from || date > to) return
    if (n < CONFIG.MIN_N[unit]) return

    const locale = opts.locale || 'de'
    const sinceText = locale === 'en' ? 'since' : 'seit'
    const timeSuffix = locale === 'en' ? '' : ' Uhr'
    const formattedStart = getDateFormatter(locale).format(start) + timeSuffix
    
    const baseTitle = `${getNumberFormatter(locale).format(n)} ${getUnitLabel(unit, n, locale)}`
    // If no label, use "seit [Datum] um [Uhrzeit]" instead of "seit Start"
    const since = opts.label 
      ? `${sinceText} ${opts.label}`
      : (locale === 'en' 
        ? `since ${formattedStart}` 
        : `seit ${formattedStart}`)
    const desc = `${getNumberFormatter(locale).format(n)} ${getUnitLabel(unit, n, locale)} ${sinceText} ${formattedStart}`

    evs.push({
      id: `${unit}-${n}-${date.getTime()}`,
      unit,
      n,
      date,
      baseTitle,
      since,
      inHuman: humanDiff(new Date(), date, locale),
      desc,
      patterns
    })
  }

  for (const unit of opts.units) {
    const add = unitAdder[unit]

    if (unit === 'years') {
      const maxN = yearsBetween(start, to) + 2
      const candidates = buildCandidates(maxN, opts.patterns)
      for (const n of candidates) {
        push(add(start, n), n, unit, getPatterns(n))
      }
    } else if (unit === 'months') {
      const maxN = diffMonths(start, to) + 2
      const candidates = buildCandidates(maxN, opts.patterns)
      for (const n of candidates) {
        push(add(start, n), n, unit, getPatterns(n))
      }
    } else {
      const per = unitMs[unit]
      if (per) {
        const maxN = Math.floor((to.getTime() - start.getTime()) / per) + 1
        const candidates = buildCandidates(maxN, opts.patterns)
        for (const n of candidates) {
          push(add(start, n), n, unit, getPatterns(n))
        }
      }
    }
  }

  evs.sort((a, b) => a.date.getTime() - b.date.getTime() || a.n - b.n)
  return evs
}
