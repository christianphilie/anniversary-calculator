import { logError } from './logger'

/**
 * Generates a shareable URL for one or more milestones
 * 
 * @param milestoneIds - Array of milestone IDs to include in the share URL
 * @returns A URL with milestone IDs encoded as query parameters
 * 
 * @example
 * ```ts
 * const url = generateShareUrl(['years-10-1234567890', 'days-100-1234567890'])
 * // Returns: "https://example.com/?m=years-10-1234567890,days-100-1234567890"
 * ```
 */
export function generateShareUrl(milestoneIds: string[]): string {
  const baseUrl = window.location.origin + window.location.pathname
  const params = new URLSearchParams(window.location.search)
  
  // Remove existing milestone parameter
  params.delete('m')
  
  // Add milestone IDs to URL
  if (milestoneIds.length > 0) {
    // Compress IDs if there are many (use base64 or simple encoding)
    if (milestoneIds.length > 10) {
      // For many IDs, use base64 encoding
      try {
        const idsString = milestoneIds.join(',')
        params.set('m', btoa(idsString))
      } catch {
        // Fallback to comma-separated if base64 fails
        params.set('m', milestoneIds.join(','))
      }
    } else {
      params.set('m', milestoneIds.join(','))
    }
  }
  
  return `${baseUrl}?${params.toString()}`
}

/**
 * Parses milestone IDs from the current page URL's query parameters
 * 
 * @returns Array of milestone IDs found in the URL, or empty array if none found
 * 
 * @example
 * ```ts
 * // URL: https://example.com/?m=years-10-1234567890,days-100-1234567890
 * const ids = parseShareUrl()
 * // Returns: ['years-10-1234567890', 'days-100-1234567890']
 * ```
 */
export function parseShareUrl(): string[] {
  const params = new URLSearchParams(window.location.search)
  const milestoneParam = params.get('m')
  
  if (!milestoneParam) {
    return []
  }
  
  try {
    // Try to decode base64 first (for compressed URLs)
    if (milestoneParam.length > 50) {
      try {
        const decoded = atob(milestoneParam)
        return decoded.split(',').filter(Boolean)
      } catch {
        // Not base64, use as-is
      }
    }
    
    return milestoneParam.split(',').filter(Boolean)
  } catch {
    return []
  }
}

/**
 * Checks if the native Web Share API is available in the current browser
 * 
 * @returns True if navigator.share is available, false otherwise
 */
export function isNativeShareAvailable(): boolean {
  return typeof navigator !== 'undefined' && 'share' in navigator
}

/**
 * Shares milestones using the native Share API if available, otherwise falls back to copying URL to clipboard
 * 
 * @param milestoneIds - Array of milestone IDs to share
 * @param title - Title for the share dialog
 * @param text - Text content for the share dialog
 * @returns Promise that resolves to true if share was successful, false otherwise
 * 
 * @example
 * ```ts
 * const shared = await shareMilestones(
 *   ['years-10-1234567890'],
 *   '10 Years',
 *   'Check out this milestone!'
 * )
 * ```
 */
export async function shareMilestones(
  milestoneIds: string[],
  title: string,
  text: string
): Promise<boolean> {
  const url = generateShareUrl(milestoneIds)
  
  if (isNativeShareAvailable()) {
    try {
      await navigator.share({
        title,
        text,
        url
      })
      return true
    } catch (err) {
      // User cancelled or error occurred
      if ((err as Error).name !== 'AbortError') {
        logError('Share failed:', err)
      }
      return false
    }
  }
  
  // Fallback: copy URL to clipboard
  try {
    await navigator.clipboard.writeText(url)
    return true
  } catch {
    return false
  }
}
