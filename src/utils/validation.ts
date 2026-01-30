import { CONFIG } from '../types'

export interface ValidationResult {
  valid: boolean
  error?: string
}

export function validateDate(dateStr: string): ValidationResult {
  if (!dateStr) {
    return { valid: false, error: 'Bitte wähle ein Datum aus' }
  }

  const date = new Date(dateStr)
  if (isNaN(date.getTime())) {
    return { valid: false, error: 'Ungültiges Datum' }
  }

  const year = date.getFullYear()
  const minYear = 1900
  const maxYear = 2200

  if (year < minYear) {
    return { valid: false, error: `Das Datum muss nach ${minYear} sein` }
  }

  if (year > maxYear) {
    return { valid: false, error: `Das Datum muss vor ${maxYear} sein` }
  }

  return { valid: true }
}

export function validateTime(timeStr: string): ValidationResult {
  if (!timeStr) {
    return { valid: true } // Time is optional
  }

  const timeRegex = /^([0-1][0-9]|2[0-3]):([0-5][0-9])(:([0-5][0-9]))?$/
  if (!timeRegex.test(timeStr)) {
    return { valid: false, error: 'Ungültiges Zeitformat (erwartet: HH:MM oder HH:MM:SS)' }
  }

  return { valid: true }
}

import { isSafeString } from './sanitize'

export function validateLabel(label: string): ValidationResult {
  if (label.length > 100) {
    return { valid: false, error: 'Der Titel darf maximal 100 Zeichen lang sein' }
  }

  // Check for potentially dangerous characters
  const dangerousChars = /[<>\"'&]/
  if (dangerousChars.test(label)) {
    return { valid: false, error: 'Der Titel enthält ungültige Zeichen' }
  }

  // Additional safety check
  if (!isSafeString(label)) {
    return { valid: false, error: 'Der Titel enthält nicht erlaubte Zeichen' }
  }

  return { valid: true }
}

// Constants for year validation
const MIN_YEAR = 1900
const MAX_YEAR = 2200
const MAX_YEAR_SPAN = 300 // Maximum years between yearFrom and yearTo

export function validateYearRange(yearFrom: number, yearTo: number, startYear: number): ValidationResult {
  // Validate yearFrom bounds
  if (yearFrom < MIN_YEAR) {
    return { valid: false, error: `Das Startjahr muss mindestens ${MIN_YEAR} sein` }
  }
  
  if (yearFrom > MAX_YEAR) {
    return { valid: false, error: `Das Startjahr darf maximal ${MAX_YEAR} sein` }
  }

  // Validate yearTo bounds
  if (yearTo < MIN_YEAR) {
    return { valid: false, error: `Das Endjahr muss mindestens ${MIN_YEAR} sein` }
  }
  
  if (yearTo > MAX_YEAR) {
    return { valid: false, error: `Das Endjahr darf maximal ${MAX_YEAR} sein` }
  }

  // Validate against startYear
  if (yearFrom < startYear) {
    return { valid: false, error: `Das Startjahr muss mindestens ${startYear} sein` }
  }

  // Validate maximum span
  const span = yearTo - yearFrom
  if (span > MAX_YEAR_SPAN) {
    return {
      valid: false,
      error: `Der Jahresbereich darf maximal ${MAX_YEAR_SPAN} Jahre umfassen`
    }
  }

  // Validate against CONFIG.MAX_SPAN
  if (yearTo > startYear + CONFIG.MAX_SPAN) {
    return {
      valid: false,
      error: `Das Endjahr darf maximal ${startYear + CONFIG.MAX_SPAN} sein`
    }
  }

  if (yearTo < yearFrom) {
    return { valid: false, error: 'Das Endjahr muss nach dem Startjahr liegen' }
  }

  // Validate that numbers are actually numbers (not NaN, Infinity, etc.)
  if (!Number.isFinite(yearFrom) || !Number.isFinite(yearTo)) {
    return { valid: false, error: 'Ungültige Jahreswerte' }
  }

  return { valid: true }
}

export function validateUnits(units: string[]): ValidationResult {
  if (units.length === 0) {
    return { valid: false, error: 'Bitte wähle mindestens eine Einheit aus' }
  }

  return { valid: true }
}

export function validatePatterns(patterns: { rounded: boolean; repdigit: boolean }): ValidationResult {
  if (!patterns.rounded && !patterns.repdigit) {
    return { valid: false, error: 'Bitte wähle mindestens ein Muster aus' }
  }

  return { valid: true }
}

export function parseDate(dateStr: string, timeStr: string): { date: Date; error?: string } {
  const dateValidation = validateDate(dateStr)
  if (!dateValidation.valid) {
    return { date: new Date(), error: dateValidation.error }
  }

  const timeValidation = validateTime(timeStr)
  if (!timeValidation.valid) {
    return { date: new Date(), error: timeValidation.error }
  }

  try {
    const [y, m, d] = dateStr.split('-').map(Number)
    const time = timeStr || '12:00:00'
    const [hh, mm, ss = '00'] = time.split(':')
    
    const date = new Date(y, m - 1, d, Number(hh), Number(mm), Number(ss))

    if (isNaN(date.getTime())) {
      return { date: new Date(), error: 'Ungültiges Datum oder Zeit' }
    }

    return { date }
  } catch (err) {
    return { date: new Date(), error: 'Fehler beim Parsen des Datums' }
  }
}
