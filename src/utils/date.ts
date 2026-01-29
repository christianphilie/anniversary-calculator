/**
 * Duration constants in milliseconds
 */
export const MS = {
  second: 1000,
  minute: 60000,
  hour: 3600000,
  day: 86400000,
  week: 604800000
} as const

/**
 * Returns the number of days in a given month
 * @param year - The year
 * @param month - The month (0-11)
 * @returns The number of days in the month
 */
function daysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate()
}

/**
 * Adds years to a date, handling month overflow correctly
 * @param date - The base date
 * @param n - Number of years to add
 * @returns A new Date object with years added
 */
export function addYears(date: Date, n: number): Date {
  const dt = new Date(date.getTime())
  const y = dt.getFullYear() + n
  const m = dt.getMonth()
  dt.setFullYear(y, m, Math.min(dt.getDate(), daysInMonth(y, m)))
  return dt
}

/**
 * Adds months to a date, handling year overflow and day clamping correctly
 * @param date - The base date
 * @param n - Number of months to add
 * @returns A new Date object with months added
 */
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

/**
 * Adds weeks to a date
 * @param date - The base date
 * @param n - Number of weeks to add
 * @returns A new Date object with weeks added
 */
export const addWeeks = (date: Date, n: number): Date => 
  new Date(date.getTime() + n * MS.week)

/**
 * Adds days to a date
 * @param date - The base date
 * @param n - Number of days to add
 * @returns A new Date object with days added
 */
export const addDays = (date: Date, n: number): Date => 
  new Date(date.getTime() + n * MS.day)

/**
 * Adds hours to a date
 * @param date - The base date
 * @param n - Number of hours to add
 * @returns A new Date object with hours added
 */
export const addHours = (date: Date, n: number): Date => 
  new Date(date.getTime() + n * MS.hour)

/**
 * Adds minutes to a date
 * @param date - The base date
 * @param n - Number of minutes to add
 * @returns A new Date object with minutes added
 */
export const addMinutes = (date: Date, n: number): Date => 
  new Date(date.getTime() + n * MS.minute)

/**
 * Adds seconds to a date
 * @param date - The base date
 * @param n - Number of seconds to add
 * @returns A new Date object with seconds added
 */
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
