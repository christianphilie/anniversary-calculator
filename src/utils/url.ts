/**
 * Shared utilities for URL parameter handling
 * Used by both useUrlState and share utilities
 */

/**
 * Safely gets a URL parameter value
 * @param params - URLSearchParams instance
 * @param key - Parameter key
 * @returns Parameter value or null
 */
export function getUrlParam(params: URLSearchParams, key: string): string | null {
  return params.get(key)
}

/**
 * Safely sets a URL parameter value
 * @param params - URLSearchParams instance
 * @param key - Parameter key
 * @param value - Parameter value (will be converted to string)
 */
export function setUrlParam(params: URLSearchParams, key: string, value: string | number | null | undefined): void {
  if (value === null || value === undefined) {
    params.delete(key)
  } else {
    params.set(key, String(value))
  }
}

/**
 * Validates a date parameter (YYYY-MM-DD format)
 * @param value - Date string to validate
 * @returns True if valid date format
 */
export function isValidDateParam(value: string | null): boolean {
  if (!value) return false
  return /^\d{4}-\d{2}-\d{2}$/.test(value)
}

/**
 * Validates a time parameter (HH:MM or HH:MM:SS format)
 * @param value - Time string to validate
 * @returns True if valid time format
 */
export function isValidTimeParam(value: string | null): boolean {
  if (!value) return false
  return /^([0-1][0-9]|2[0-3]):([0-5][0-9])(:([0-5][0-9]))?$/.test(value)
}

/**
 * Validates a year parameter (1900-2200 range)
 * @param value - Year string to validate
 * @returns Parsed year number or null if invalid
 */
export function parseYearParam(value: string | null): number | null {
  if (!value) return null
  const year = parseInt(value, 10)
  if (isNaN(year) || year < 1900 || year > 2200) {
    return null
  }
  return year
}

/**
 * Validates units parameter
 * @param value - Comma-separated units string
 * @param validUnits - Array of valid unit values
 * @returns Array of valid units or empty array
 */
export function parseUnitsParam(value: string | null, validUnits: string[]): string[] {
  if (!value) return []
  return value.split(',').filter(Boolean).filter(unit => validUnits.includes(unit))
}

/**
 * Validates patterns parameter
 * @param value - Comma-separated patterns string
 * @returns Patterns object or null if invalid
 */
export function parsePatternsParam(value: string | null): { rounded: boolean; repdigit: boolean } | null {
  if (!value) return null
  const set = new Set(value.split(',').filter(Boolean))
  return {
    rounded: set.has('rounded'),
    repdigit: set.has('repdigit')
  }
}

/**
 * Validates theme parameter
 * @param value - Theme string
 * @param validThemes - Array of valid theme values
 * @returns Theme value or null if invalid
 */
export function parseThemeParam(value: string | null, validThemes: string[]): string | null {
  if (!value) return null
  return validThemes.includes(value) ? value : null
}
