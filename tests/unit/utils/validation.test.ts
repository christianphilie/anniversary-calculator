import { describe, it, expect } from 'vitest'
import {
  validateDate,
  validateTime,
  validateLabel,
  validateYearRange,
  validateUnits,
  validatePatterns,
  parseDate
} from '@/utils/validation'
import { CONFIG } from '@/types'

describe('validation utilities', () => {
  describe('validateDate', () => {
    it('should accept valid dates', () => {
      const result = validateDate('2020-01-15')
      expect(result.valid).toBe(true)
    })

    it('should reject empty dates', () => {
      const result = validateDate('')
      expect(result.valid).toBe(false)
      expect(result.error).toBeDefined()
    })

    it('should reject dates before 1900', () => {
      const result = validateDate('1899-01-01')
      expect(result.valid).toBe(false)
      expect(result.error).toContain('1900')
    })

    it('should reject dates after 2200', () => {
      const result = validateDate('2201-01-01')
      expect(result.valid).toBe(false)
      expect(result.error).toContain('2200')
    })
  })

  describe('validateTime', () => {
    it('should accept valid time formats', () => {
      expect(validateTime('10:30').valid).toBe(true)
      expect(validateTime('10:30:45').valid).toBe(true)
      expect(validateTime('23:59').valid).toBe(true)
    })

    it('should accept empty time (optional)', () => {
      expect(validateTime('').valid).toBe(true)
    })

    it('should reject invalid time formats', () => {
      expect(validateTime('25:00').valid).toBe(false)
      expect(validateTime('10:60').valid).toBe(false)
      expect(validateTime('abc').valid).toBe(false)
      expect(validateTime('10:30:60').valid).toBe(false)
    })
  })

  describe('validateLabel', () => {
    it('should accept valid labels', () => {
      expect(validateLabel('Geburtstag').valid).toBe(true)
      expect(validateLabel('Hochzeit').valid).toBe(true)
      expect(validateLabel('Kennenlernen').valid).toBe(true)
    })

    it('should reject labels longer than 100 characters', () => {
      const longLabel = 'a'.repeat(101)
      const result = validateLabel(longLabel)
      expect(result.valid).toBe(false)
      expect(result.error).toContain('100')
    })

    it('should reject labels with dangerous characters', () => {
      expect(validateLabel('<script>').valid).toBe(false)
      expect(validateLabel('Test"').valid).toBe(false)
      expect(validateLabel("Test'").valid).toBe(false)
      expect(validateLabel('Test&').valid).toBe(false)
    })
  })

  describe('validateYearRange', () => {
    it('should accept valid year ranges', () => {
      const result = validateYearRange(2020, 2030, 2020)
      expect(result.valid).toBe(true)
    })

    it('should reject yearFrom before startYear', () => {
      const result = validateYearRange(2019, 2030, 2020)
      expect(result.valid).toBe(false)
      expect(result.error).toContain('mindestens')
    })

    it('should reject yearTo after max span', () => {
      const startYear = 2020
      const maxYear = startYear + CONFIG.MAX_SPAN
      const result = validateYearRange(startYear, maxYear + 1, startYear)
      expect(result.valid).toBe(false)
    })

    it('should reject yearTo before yearFrom', () => {
      const result = validateYearRange(2020, 2019, 2020)
      expect(result.valid).toBe(false)
      expect(result.error).toContain('nach')
    })
  })

  describe('validateUnits', () => {
    it('should accept non-empty unit arrays', () => {
      expect(validateUnits(['years']).valid).toBe(true)
      expect(validateUnits(['years', 'months']).valid).toBe(true)
    })

    it('should reject empty unit arrays', () => {
      const result = validateUnits([])
      expect(result.valid).toBe(false)
      expect(result.error).toContain('mindestens eine Einheit')
    })
  })

  describe('validatePatterns', () => {
    it('should accept patterns with at least one enabled', () => {
      expect(validatePatterns({ rounded: true, repdigit: false }).valid).toBe(true)
      expect(validatePatterns({ rounded: false, repdigit: true }).valid).toBe(true)
      expect(validatePatterns({ rounded: true, repdigit: true }).valid).toBe(true)
    })

    it('should reject patterns with both disabled', () => {
      const result = validatePatterns({ rounded: false, repdigit: false })
      expect(result.valid).toBe(false)
      expect(result.error).toContain('mindestens ein Muster')
    })
  })

  describe('parseDate', () => {
    it('should parse valid date and time', () => {
      const result = parseDate('2020-01-15', '10:30:00')
      expect(result.error).toBeUndefined()
      expect(result.date).toBeInstanceOf(Date)
      expect(result.date.getFullYear()).toBe(2020)
      expect(result.date.getMonth()).toBe(0)
      expect(result.date.getDate()).toBe(15)
      expect(result.date.getHours()).toBe(10)
      expect(result.date.getMinutes()).toBe(30)
    })

    it('should use default time when not provided', () => {
      const result = parseDate('2020-01-15', '')
      expect(result.error).toBeUndefined()
      expect(result.date.getHours()).toBe(12) // Default time
    })

    it('should return error for invalid date', () => {
      const result = parseDate('invalid', '10:30')
      expect(result.error).toBeDefined()
    })

    it('should return error for invalid time', () => {
      const result = parseDate('2020-01-15', '25:00')
      expect(result.error).toBeDefined()
    })
  })
})
