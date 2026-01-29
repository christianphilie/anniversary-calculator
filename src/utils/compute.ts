import type { MilestoneEvent, Unit, Patterns } from '../types'
import { CONFIG } from '../types'
import { addYears, addMonths, addWeeks, addDays, addHours, addMinutes, addSeconds, diffMonths, yearsBetween, MS } from './date'
import { buildCandidates, classifyPatterns } from './patterns'
import { labelDE, humanDiff, fmtNum, fmtFull } from './i18n'

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

  function push(date: Date, n: number, unit: Unit): void {
    if (date < from || date > to) return
    if (n < CONFIG.MIN_N[unit]) return

    const baseTitle = `${fmtNum.format(n)} ${labelDE(unit, n)}`
    const since = `seit ${opts.label || 'Start'}`
    const startText = fmtFull.format(start) + ' Uhr'
    const desc = `${fmtNum.format(n)} ${labelDE(unit, n)} seit ${startText}`

    evs.push({
      id: `${unit}-${n}-${date.getTime()}`,
      unit,
      n,
      date,
      baseTitle,
      since,
      inHuman: humanDiff(new Date(), date),
      desc,
      patterns: classifyPatterns(n)
    })
  }

  for (const unit of opts.units) {
    const add = unitAdder[unit]

    if (unit === 'years') {
      const maxN = yearsBetween(start, to) + 2
      for (const n of buildCandidates(maxN, opts.patterns)) {
        push(add(start, n), n, unit)
      }
    } else if (unit === 'months') {
      const maxN = diffMonths(start, to) + 2
      for (const n of buildCandidates(maxN, opts.patterns)) {
        push(add(start, n), n, unit)
      }
    } else {
      const per = unitMs[unit]
      if (per) {
        const maxN = Math.floor((to.getTime() - start.getTime()) / per) + 1
        for (const n of buildCandidates(maxN, opts.patterns)) {
          push(add(start, n), n, unit)
        }
      }
    }
  }

  evs.sort((a, b) => a.date.getTime() - b.date.getTime() || a.n - b.n)
  return evs
}
