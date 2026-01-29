
// Duration constants in milliseconds
export const MS = {
  second: 1000,
  minute: 60000,
  hour: 3600000,
  day: 86400000,
  week: 604800000
} as const

// Date math with clamping for months/years
function daysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate()
}

export function addYears(date: Date, n: number): Date {
  const dt = new Date(date.getTime())
  const y = dt.getFullYear() + n
  const m = dt.getMonth()
  dt.setFullYear(y, m, Math.min(dt.getDate(), daysInMonth(y, m)))
  return dt
}

export function addMonths(date: Date, n: number): Date {
  const dt = new Date(date.getTime())
  const y = dt.getFullYear()
  const m = dt.getMonth()
  const t = m + n
  const ny = y + Math.floor(t / 12)
  const nm = ((t % 12) + 12) % 12
  dt.setFullYear(ny, nm, Math.min(dt.getDate(), daysInMonth(ny, nm)))
  return dt
}

export const addWeeks = (date: Date, n: number): Date => 
  new Date(date.getTime() + n * MS.week)

export const addDays = (date: Date, n: number): Date => 
  new Date(date.getTime() + n * MS.day)

export const addHours = (date: Date, n: number): Date => 
  new Date(date.getTime() + n * MS.hour)

export const addMinutes = (date: Date, n: number): Date => 
  new Date(date.getTime() + n * MS.minute)

export const addSeconds = (date: Date, n: number): Date => 
  new Date(date.getTime() + n * MS.second)

export function diffMonths(a: Date, b: Date): number {
  return (b.getFullYear() - a.getFullYear()) * 12 + (b.getMonth() - a.getMonth())
}

export function yearsBetween(a: Date, b: Date): number {
  return Math.floor((b.getTime() - a.getTime()) / MS.day / 365.2425)
}

export function toLocalDateInputValue(date: Date): string {
  const z = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
  return z.toISOString().slice(0, 10)
}
