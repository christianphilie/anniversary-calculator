import type { MilestoneEvent } from '../types'
import { fmtFull } from './i18n'

/**
 * Copies text to clipboard using the modern Clipboard API with fallback for older browsers
 * 
 * @param text - The text to copy to clipboard
 * @returns Promise that resolves to true if copy was successful, false otherwise
 * 
 * @example
 * ```ts
 * const success = await copyToClipboard('Hello, World!')
 * if (success) {
 *   console.log('Copied!')
 * }
 * ```
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text)
      return true
    } else {
      // Fallback for older browsers or non-secure contexts
      const textArea = document.createElement('textarea')
      textArea.value = text
      textArea.style.position = 'fixed'
      textArea.style.left = '-999999px'
      textArea.style.top = '-999999px'
      document.body.appendChild(textArea)
      textArea.focus()
      textArea.select()
      
      try {
        const successful = document.execCommand('copy')
        document.body.removeChild(textArea)
        return successful
      } catch (err) {
        document.body.removeChild(textArea)
        return false
      }
    }
  } catch (err) {
    console.error('Failed to copy to clipboard:', err)
    return false
  }
}

/**
 * Formats a milestone event as a readable text string for copying to clipboard
 * 
 * @param event - The milestone event to format
 * @param label - Optional label/title for the milestone
 * @returns Formatted text string with milestone details
 * 
 * @example
 * ```ts
 * const text = formatMilestoneText(event, 'Birthday')
 * // Returns: "Birthday:\n1000 Tage seit Start\nDatum: 1. Januar 2023, 12:00 Uhr\nIn: in 100 Tagen"
 * ```
 */
export function formatMilestoneText(event: MilestoneEvent, label: string): string {
  const dateStr = fmtFull.format(event.date) + ' Uhr'
  const lines = [
    `${event.baseTitle} ${event.since}`,
    `Datum: ${dateStr}`,
    `In: ${event.inHuman}`
  ]
  
  if (label) {
    lines.unshift(`${label}:`)
  }
  
  return lines.join('\n')
}
