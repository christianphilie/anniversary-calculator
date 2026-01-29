import { describe, it, expect } from 'vitest'
import {
  addYears,
  addMonths,
  addWeeks,
  addDays,
  addHours,
  addMinutes,
  addSeconds,
  diffMonths,
  yearsBetween,
  toLocalDateInputValue,
  MS
} from '@/utils/date'

describe('date utilities', () => {
  describe('addYears', () => {
    it('should add years correctly', () => {
      const date = new Date(2020, 0, 1)
      const result = addYears(date, 5)
      expect(result.getFullYear()).toBe(2025)
      expect(result.getMonth()).toBe(0)
      expect(result.getDate()).toBe(1)
    })

    it('should handle leap year dates correctly', () => {
      const date = new Date(2020, 1, 29) // Feb 29, 2020 (leap year)
      const result = addYears(date, 1)
      expect(result.getFullYear()).toBe(2021)
      expect(result.getMonth()).toBe(1)
      expect(result.getDate()).toBe(28) // Feb 28, 2021 (not a leap year)
    })

    it('should handle negative years', () => {
      const date = new Date(2020, 0, 1)
      const result = addYears(date, -5)
      expect(result.getFullYear()).toBe(2015)
    })
  })

  describe('addMonths', () => {
    it('should add months correctly', () => {
      const date = new Date(2020, 0, 1)
      const result = addMonths(date, 3)
      expect(result.getFullYear()).toBe(2020)
      expect(result.getMonth()).toBe(3)
      expect(result.getDate()).toBe(1)
    })

    it('should handle year overflow', () => {
      const date = new Date(2020, 10, 1) // November
      const result = addMonths(date, 3)
      expect(result.getFullYear()).toBe(2021)
      expect(result.getMonth()).toBe(1) // February
    })

    it('should clamp day when month has fewer days', () => {
      const date = new Date(2020, 0, 31) // Jan 31
      const result = addMonths(date, 1) // Feb
      expect(result.getMonth()).toBe(1)
      expect(result.getDate()).toBe(29) // Feb 29, 2020 (leap year)
    })
  })

  describe('addWeeks', () => {
    it('should add weeks correctly', () => {
      const date = new Date(2020, 0, 1)
      const result = addWeeks(date, 2)
      const expected = new Date(date.getTime() + 2 * MS.week)
      expect(result.getTime()).toBe(expected.getTime())
    })
  })

  describe('addDays', () => {
    it('should add days correctly', () => {
      const date = new Date(2020, 0, 1)
      const result = addDays(date, 10)
      const expected = new Date(date.getTime() + 10 * MS.day)
      expect(result.getTime()).toBe(expected.getTime())
    })
  })

  describe('addHours', () => {
    it('should add hours correctly', () => {
      const date = new Date(2020, 0, 1, 10, 0, 0)
      const result = addHours(date, 5)
      expect(result.getHours()).toBe(15)
    })
  })

  describe('addMinutes', () => {
    it('should add minutes correctly', () => {
      const date = new Date(2020, 0, 1, 10, 30, 0)
      const result = addMinutes(date, 15)
      expect(result.getMinutes()).toBe(45)
    })
  })

  describe('addSeconds', () => {
    it('should add seconds correctly', () => {
      const date = new Date(2020, 0, 1, 10, 0, 30)
      const result = addSeconds(date, 15)
      expect(result.getSeconds()).toBe(45)
    })
  })

  describe('diffMonths', () => {
    it('should calculate month difference correctly', () => {
      const a = new Date(2020, 0, 1)
      const b = new Date(2020, 5, 1)
      expect(diffMonths(a, b)).toBe(5)
    })

    it('should handle year boundaries', () => {
      const a = new Date(2020, 10, 1) // November 2020
      const b = new Date(2021, 2, 1) // March 2021
      // Nov -> Dec (1), Dec -> Jan (2), Jan -> Feb (3), Feb -> Mar (4)
      expect(diffMonths(a, b)).toBe(4)
    })
  })

  describe('yearsBetween', () => {
    it('should calculate years between dates', () => {
      const a = new Date(2020, 0, 1)
      const b = new Date(2025, 0, 1)
      const result = yearsBetween(a, b)
      expect(result).toBeGreaterThanOrEqual(4)
      expect(result).toBeLessThanOrEqual(5)
    })
  })

  describe('toLocalDateInputValue', () => {
    it('should format date as YYYY-MM-DD', () => {
      const date = new Date(2020, 0, 15)
      const result = toLocalDateInputValue(date)
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/)
      expect(result).toContain('2020')
    })
  })
})
