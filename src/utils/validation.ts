import { CONFIG } from '../types'
import { isSafeString } from './sanitize'

export interface ValidationResult {
  valid: boolean
  error?: string
}

// Type for translation function
type TranslateFunction = (key: string, params?: Record<string, string | number>) => string

// Default translation function (fallback to German)
function defaultT(key: string, params?: Record<string, string | number>): string {
  const translations: Record<string, string> = {
    'validation.dateRequired': 'Bitte wähle ein Datum aus',
    'validation.dateInvalid': 'Ungültiges Datum',
    'validation.dateTooOld': `Das Datum muss nach ${params?.year || 1900} sein`,
    'validation.dateTooNew': `Das Datum muss vor ${params?.year || 2200} sein`,
    'validation.timeInvalid': 'Ungültiges Zeitformat (erwartet: HH:MM oder HH:MM:SS)',
    'validation.labelTooLong': 'Der Titel darf maximal 100 Zeichen lang sein',
    'validation.labelInvalidChars': 'Der Titel enthält ungültige Zeichen',
    'validation.labelNotAllowedChars': 'Der Titel enthält nicht erlaubte Zeichen',
    'validation.yearFromTooEarly': `Das Startjahr muss mindestens ${params?.year || 1900} sein`,
    'validation.yearFromTooLate': `Das Startjahr darf maximal ${params?.year || 2200} sein`,
    'validation.yearToTooEarly': `Das Endjahr muss mindestens ${params?.year || 1900} sein`,
    'validation.yearToTooLate': `Das Endjahr darf maximal ${params?.year || 2200} sein`,
    'validation.yearToBeforeFrom': 'Das Endjahr muss nach dem Startjahr liegen',
    'validation.yearSpanTooLarge': `Der Jahresbereich darf maximal ${params?.span || 300} Jahre umfassen`,
    'validation.yearRangeInvalid': 'Ungültige Jahreswerte',
    'validation.unitsRequired': 'Bitte wähle mindestens eine Einheit aus',
    'validation.patternsRequired': 'Bitte wähle mindestens ein Muster aus',
    'validation.dateParseError': 'Ungültiges Datum oder Zeit',
    'validation.dateParseFailed': 'Fehler beim Parsen des Datums'
  }
  return translations[key] || key
}

export function validateDate(dateStr: string, t: TranslateFunction = defaultT): ValidationResult {
  if (!dateStr) {
    return { valid: false, error: t('validation.dateRequired') }
  }

  const date = new Date(dateStr)
  if (isNaN(date.getTime())) {
    return { valid: false, error: t('validation.dateInvalid') }
  }

  const year = date.getFullYear()
  const minYear = 1900
  const maxYear = 2200

  if (year < minYear) {
    return { valid: false, error: t('validation.dateTooOld', { year: minYear }) }
  }

  if (year > maxYear) {
    return { valid: false, error: t('validation.dateTooNew', { year: maxYear }) }
  }

  return { valid: true }
}

export function validateTime(timeStr: string, t: TranslateFunction = defaultT): ValidationResult {
  if (!timeStr) {
    return { valid: true } // Time is optional
  }

  const timeRegex = /^([0-1][0-9]|2[0-3]):([0-5][0-9])(:([0-5][0-9]))?$/
  if (!timeRegex.test(timeStr)) {
    return { valid: false, error: t('validation.timeInvalid') }
  }

  return { valid: true }
}

export function validateLabel(label: string, t: TranslateFunction = defaultT): ValidationResult {
  if (label.length > 100) {
    return { valid: false, error: t('validation.labelTooLong') }
  }

  // Check for potentially dangerous characters (but allow apostrophes)
  const dangerousChars = /[<>\"&]/
  if (dangerousChars.test(label)) {
    return { valid: false, error: t('validation.labelInvalidChars') }
  }

  // Additional safety check (now allows apostrophes)
  if (!isSafeString(label)) {
    return { valid: false, error: t('validation.labelNotAllowedChars') }
  }

  return { valid: true }
}

// Constants for year validation
const MIN_YEAR = 1900
const MAX_YEAR = 2200
const MAX_YEAR_SPAN = 300 // Maximum years between yearFrom and yearTo

export function validateYearRange(
  yearFrom: number,
  yearTo: number,
  startYear: number,
  t: TranslateFunction = defaultT
): ValidationResult {
  // Validate yearFrom bounds
  if (yearFrom < MIN_YEAR) {
    return { valid: false, error: t('validation.yearFromTooEarly', { year: MIN_YEAR }) }
  }
  
  if (yearFrom > MAX_YEAR) {
    return { valid: false, error: t('validation.yearFromTooLate', { year: MAX_YEAR }) }
  }

  // Validate yearTo bounds
  if (yearTo < MIN_YEAR) {
    return { valid: false, error: t('validation.yearToTooEarly', { year: MIN_YEAR }) }
  }
  
  if (yearTo > MAX_YEAR) {
    return { valid: false, error: t('validation.yearToTooLate', { year: MAX_YEAR }) }
  }

  // Validate against startYear
  if (yearFrom < startYear) {
    return { valid: false, error: t('validation.yearFromTooEarly', { year: startYear }) }
  }

  // Validate maximum span
  const span = yearTo - yearFrom
  if (span > MAX_YEAR_SPAN) {
    return {
      valid: false,
      error: t('validation.yearSpanTooLarge', { span: MAX_YEAR_SPAN })
    }
  }

  // Validate against CONFIG.MAX_SPAN
  if (yearTo > startYear + CONFIG.MAX_SPAN) {
    return {
      valid: false,
      error: t('validation.yearToTooLate', { year: startYear + CONFIG.MAX_SPAN })
    }
  }

  if (yearTo < yearFrom) {
    return { valid: false, error: t('validation.yearToBeforeFrom') }
  }

  // Validate that numbers are actually numbers (not NaN, Infinity, etc.)
  if (!Number.isFinite(yearFrom) || !Number.isFinite(yearTo)) {
    return { valid: false, error: t('validation.yearRangeInvalid') }
  }

  return { valid: true }
}

export function validateUnits(units: string[], t: TranslateFunction = defaultT): ValidationResult {
  if (units.length === 0) {
    return { valid: false, error: t('validation.unitsRequired') }
  }

  return { valid: true }
}

export function validatePatterns(
  patterns: { rounded: boolean; repdigit: boolean },
  t: TranslateFunction = defaultT
): ValidationResult {
  if (!patterns.rounded && !patterns.repdigit) {
    return { valid: false, error: t('validation.patternsRequired') }
  }

  return { valid: true }
}

export function parseDate(
  dateStr: string,
  timeStr: string,
  t: TranslateFunction = defaultT
): { date: Date; error?: string } {
  const dateValidation = validateDate(dateStr, t)
  if (!dateValidation.valid) {
    return { date: new Date(), error: dateValidation.error }
  }

  const timeValidation = validateTime(timeStr, t)
  if (!timeValidation.valid) {
    return { date: new Date(), error: timeValidation.error }
  }

  try {
    const [y, m, d] = dateStr.split('-').map(Number)
    const time = timeStr || '12:00:00'
    const [hh, mm, ss = '00'] = time.split(':')
    
    const date = new Date(y, m - 1, d, Number(hh), Number(mm), Number(ss))

    if (isNaN(date.getTime())) {
      return { date: new Date(), error: t('validation.dateParseError') }
    }

    return { date }
  } catch (err) {
    return { date: new Date(), error: t('validation.dateParseFailed') }
  }
}
