/**
 * Utility functions for generating consistent filenames
 */

/**
 * Generates a safe filename from a label
 * @param label - The label/title to convert to filename
 * @param defaultLabel - Default label if label is empty
 * @returns Sanitized filename-safe string
 */
export function sanitizeFilename(label: string | null, defaultLabel = 'Jubilaeum'): string {
  const base = (label || defaultLabel).toLowerCase().replace(/\s+/g, '_')
  // Remove any remaining unsafe characters
  return base.replace(/[^a-z0-9_-]/g, '')
}

/**
 * Generates a complete filename with extension
 * @param label - The label/title
 * @param extension - File extension (without dot)
 * @param defaultLabel - Default label if label is empty
 * @returns Complete filename
 */
export function generateFilename(label: string | null, extension: string, defaultLabel = 'Jubilaeum'): string {
  const sanitized = sanitizeFilename(label, defaultLabel)
  return `${sanitized}_jubilaeen.${extension}`
}
