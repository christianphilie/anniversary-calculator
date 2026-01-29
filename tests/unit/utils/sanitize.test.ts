import { describe, it, expect } from 'vitest'
import {
  escapeHtml,
  sanitizeInput,
  sanitizeUrlParam,
  isSafeString,
  sanitizeLabel
} from '@/utils/sanitize'

describe('sanitize utilities', () => {
  describe('escapeHtml', () => {
    it('should escape HTML special characters', () => {
      // textContent escapes HTML tags but not quotes
      const scriptResult = escapeHtml('<script>alert("xss")</script>')
      expect(scriptResult).not.toContain('<script>')
      expect(scriptResult).not.toContain('</script>')
      
      // textContent converts & to &amp;
      const ampResult = escapeHtml('Test & Test')
      expect(ampResult).toContain('&amp;')
      
      // textContent preserves quotes as-is (they're safe in textContent)
      const quoteResult = escapeHtml('Test "Test"')
      expect(quoteResult).toBe('Test "Test"')
    })

    it('should preserve safe text', () => {
      const safe = 'Hello World'
      expect(escapeHtml(safe)).toBe(safe)
    })
  })

  describe('sanitizeInput', () => {
    it('should remove HTML special characters', () => {
      expect(sanitizeInput('<script>')).toBe('script')
      expect(sanitizeInput('Test & Test')).toBe('Test  Test')
      expect(sanitizeInput('Test"Test')).toBe('TestTest')
    })

    it('should trim whitespace', () => {
      expect(sanitizeInput('  Test  ')).toBe('Test')
    })
  })

  describe('sanitizeUrlParam', () => {
    it('should sanitize valid parameters', () => {
      const result = sanitizeUrlParam('test-label')
      expect(result).toBe('test-label')
    })

    it('should return null for null input', () => {
      expect(sanitizeUrlParam(null)).toBeNull()
    })

    it('should return null for parameters exceeding max length', () => {
      const longParam = 'a'.repeat(201)
      expect(sanitizeUrlParam(longParam)).toBeNull()
    })

    it('should remove HTML tags', () => {
      const result = sanitizeUrlParam('<script>alert("xss")</script>')
      expect(result).not.toContain('<script>')
    })

    it('should trim whitespace', () => {
      expect(sanitizeUrlParam('  test  ')).toBe('test')
    })
  })

  describe('isSafeString', () => {
    it('should accept safe strings', () => {
      expect(isSafeString('Hello World')).toBe(true)
      expect(isSafeString('Test123')).toBe(true)
      expect(isSafeString('Geburt, Hochzeit!')).toBe(true)
      expect(isSafeString('Test-Test')).toBe(true)
    })

    it('should reject unsafe strings', () => {
      expect(isSafeString('<script>')).toBe(false)
      expect(isSafeString('Test&Test')).toBe(false)
      expect(isSafeString('Test"Test')).toBe(false)
    })
  })

  describe('sanitizeLabel', () => {
    it('should sanitize labels', () => {
      const result = sanitizeLabel('Geburtstag')
      expect(result).toBe('Geburtstag')
    })

    it('should remove HTML tags', () => {
      const result = sanitizeLabel('<script>alert("xss")</script>')
      expect(result).not.toContain('<script>')
    })

    it('should remove javascript: protocol', () => {
      const result = sanitizeLabel('javascript:alert("xss")')
      expect(result).not.toContain('javascript:')
    })

    it('should limit length to 100 characters', () => {
      const longLabel = 'a'.repeat(150)
      const result = sanitizeLabel(longLabel)
      expect(result.length).toBe(100)
    })

    it('should trim whitespace', () => {
      expect(sanitizeLabel('  Test  ')).toBe('Test')
    })
  })
})
