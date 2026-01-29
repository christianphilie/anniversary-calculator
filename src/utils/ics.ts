import type { MilestoneEvent } from '../types'
import { MS } from './date'

const isoUTC = (d: Date): string =>
  d.getUTCFullYear().toString() +
  String(d.getUTCMonth() + 1).padStart(2, '0') +
  String(d.getUTCDate()).padStart(2, '0') +
  'T' +
  String(d.getUTCHours()).padStart(2, '0') +
  String(d.getUTCMinutes()).padStart(2, '0') +
  String(d.getUTCSeconds()).padStart(2, '0') +
  'Z'

const ymdUTC = (d: Date): string =>
  d.getUTCFullYear().toString() +
  String(d.getUTCMonth() + 1).padStart(2, '0') +
  String(d.getUTCDate()).padStart(2, '0')

const esc = (s: string): string =>
  s.replace(/\\/g, '\\\\')
    .replace(/\n/g, '\\n')
    .replace(/,/g, '\\,')
    .replace(/;/g, '\\;')

export function buildICS(events: MilestoneEvent[]): string {
  const now = new Date()
  const out: string[] = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//JubilaeumsFinder//DE',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH'
  ]

  for (const ev of events) {
    out.push(
      'BEGIN:VEVENT',
      `UID:${ev.id}@jubilaeum`,
      `DTSTAMP:${isoUTC(now)}`,
      `SUMMARY:${esc(ev.baseTitle)} ${esc(ev.since)}`,
      `DESCRIPTION:${esc(ev.desc)}`
    )

    if (['days', 'weeks', 'months', 'years'].includes(ev.unit)) {
      const start = new Date(ev.date)
      const end = new Date(start.getTime() + MS.day)
      out.push(
        `DTSTART;VALUE=DATE:${ymdUTC(start)}`,
        `DTEND;VALUE=DATE:${ymdUTC(end)}`
      )
    } else {
      const start = new Date(ev.date)
      const end = new Date(start.getTime() + MS.hour)
      out.push(
        `DTSTART:${isoUTC(start)}`,
        `DTEND:${isoUTC(end)}`
      )
    }

    out.push('END:VEVENT')
  }

  out.push('END:VCALENDAR')
  return out.join('\r\n')
}

export function downloadICS(filename: string, content: string): void {
  const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  setTimeout(() => URL.revokeObjectURL(url), 2000)
}
