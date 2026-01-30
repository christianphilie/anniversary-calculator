/**
 * Escapes HTML special characters to prevent XSS attacks
 */
export function escapeHtml(text: string): string {
  const div = document.createElement('div')
  div.textContent = text
  return div.innerHTML
}

/**
 * Sanitizes a string by removing potentially dangerous characters
 * Note: Apostrophes are allowed for titles/labels
 */
export function sanitizeInput(input: string): string {
  return input
    .replace(/[<>\"&]/g, '') // Remove HTML special characters (but keep apostrophes)
    .trim()
}

/**
 * Validates and sanitizes URL parameters
 */
export function sanitizeUrlParam(param: string | null, maxLength = 200): string | null {
  if (!param) return null
  
  if (param.length > maxLength) {
    return null
  }

  // Remove any HTML tags
  const sanitized = param.replace(/<[^>]*>/g, '')
  
  return sanitized.trim() || null
}

/**
 * Validates that a string contains only safe characters for labels/titles
 */
export function isSafeString(input: string): boolean {
  // Allow letters, numbers, spaces, common punctuation, and apostrophes
  const safePattern = /^[a-zA-Z0-9äöüÄÖÜß\s.,!?\-_()']+$/
  return safePattern.test(input)
}

/**
 * Sanitizes a label/title string
 */
export function sanitizeLabel(label: string): string {
  // Remove HTML tags
  let sanitized = label.replace(/<[^>]*>/g, '')
  
  // Remove script tags and event handlers
  sanitized = sanitized.replace(/javascript:/gi, '')
  sanitized = sanitized.replace(/on\w+\s*=/gi, '')
  
  // Trim and limit length
  sanitized = sanitized.trim().slice(0, 100)
  
  return sanitized
}
