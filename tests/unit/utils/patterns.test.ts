import { describe, it, expect } from 'vitest'
import {
  isPowerOf10,
  isKTimesPow10,
  isRounded,
  isRepdigit,
  buildCandidates,
  classifyPatterns
} from '@/utils/patterns'

describe('pattern utilities', () => {
  describe('isPowerOf10', () => {
    it('should identify powers of 10', () => {
      expect(isPowerOf10(10)).toBe(true)
      expect(isPowerOf10(100)).toBe(true)
      expect(isPowerOf10(1000)).toBe(true)
      expect(isPowerOf10(10000)).toBe(true)
    })

    it('should reject non-powers of 10', () => {
      expect(isPowerOf10(5)).toBe(false)
      expect(isPowerOf10(15)).toBe(false)
      expect(isPowerOf10(99)).toBe(false)
      expect(isPowerOf10(101)).toBe(false)
    })

    it('should reject numbers less than 10', () => {
      expect(isPowerOf10(1)).toBe(false)
      expect(isPowerOf10(9)).toBe(false)
    })
  })

  describe('isKTimesPow10', () => {
    it('should identify K times powers of 10', () => {
      expect(isKTimesPow10(20)).toBe(true) // 2 * 10
      expect(isKTimesPow10(300)).toBe(true) // 3 * 100
      expect(isKTimesPow10(5000)).toBe(true) // 5 * 1000
      expect(isKTimesPow10(70000)).toBe(true) // 7 * 10000
    })

    it('should reject non-K-times-powers', () => {
      expect(isKTimesPow10(15)).toBe(false)
      expect(isKTimesPow10(25)).toBe(false)
      expect(isKTimesPow10(99)).toBe(false)
    })
  })

  describe('isRounded', () => {
    it('should identify rounded numbers', () => {
      expect(isRounded(10)).toBe(true)
      expect(isRounded(100)).toBe(true)
      expect(isRounded(500)).toBe(true)
      expect(isRounded(1000)).toBe(true)
      expect(isRounded(2000)).toBe(true)
    })

    it('should reject non-rounded numbers', () => {
      expect(isRounded(15)).toBe(false)
      expect(isRounded(99)).toBe(false)
      expect(isRounded(123)).toBe(false)
    })
  })

  describe('isRepdigit', () => {
    it('should identify repdigits', () => {
      expect(isRepdigit(11)).toBe(true)
      expect(isRepdigit(222)).toBe(true)
      expect(isRepdigit(3333)).toBe(true)
      expect(isRepdigit(44444)).toBe(true)
      expect(isRepdigit(555555)).toBe(true)
    })

    it('should reject non-repdigits', () => {
      expect(isRepdigit(12)).toBe(false)
      expect(isRepdigit(123)).toBe(false)
      expect(isRepdigit(112)).toBe(false)
      expect(isRepdigit(1)).toBe(false) // Single digit
    })
  })

  describe('buildCandidates', () => {
    it('should build rounded candidates', () => {
      const result = buildCandidates(1000, { rounded: true, repdigit: false })
      expect(result).toContain(10)
      expect(result).toContain(100)
      expect(result).toContain(1000)
      expect(result).toContain(500)
    })

    it('should build repdigit candidates', () => {
      const result = buildCandidates(1000, { rounded: false, repdigit: true })
      expect(result).toContain(11)
      expect(result).toContain(222)
      expect(result).toContain(333)
    })

    it('should build both types when both enabled', () => {
      const result = buildCandidates(1000, { rounded: true, repdigit: true })
      expect(result).toContain(10) // rounded
      expect(result).toContain(11) // repdigit
      expect(result).toContain(100) // rounded
      expect(result).toContain(222) // repdigit
    })

    it('should return sorted array', () => {
      const result = buildCandidates(1000, { rounded: true, repdigit: true })
      for (let i = 1; i < result.length; i++) {
        expect(result[i]).toBeGreaterThanOrEqual(result[i - 1])
      }
    })
  })

  describe('classifyPatterns', () => {
    it('should classify rounded numbers', () => {
      const result = classifyPatterns(100)
      expect(result.rounded).toBe(true)
      expect(result.repdigit).toBe(false)
    })

    it('should classify repdigits', () => {
      const result = classifyPatterns(222)
      expect(result.rounded).toBe(false)
      expect(result.repdigit).toBe(true)
    })

    it('should classify numbers that are both', () => {
      // Note: A number can't be both rounded and repdigit in our current logic
      // But we test the function works correctly
      const result1 = classifyPatterns(100)
      expect(result1.rounded).toBe(true)

      const result2 = classifyPatterns(11)
      expect(result2.repdigit).toBe(true)
    })

    it('should classify numbers that are neither', () => {
      const result = classifyPatterns(123)
      expect(result.rounded).toBe(false)
      expect(result.repdigit).toBe(false)
    })
  })
})
