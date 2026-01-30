import type { MilestoneEvent } from '../types'
import { fmtFull } from './i18n'
import { useI18n } from '../i18n'
import { logError } from './logger'

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
    logError('Failed to copy to clipboard:', err)
    return false
  }
}

/**
 * Formats a milestone event as a readable text string for copying to clipboard
 * 
 * @param event - The milestone event to format
 * @returns Formatted text string with milestone details
 * 
 * @example
 * ```ts
 * const text = formatMilestoneText(event)
 * // Returns: "30 Jahre seit Christians Geburtstag\nvor 6 Jahren, am Donnerstag, 28. März 2019 um 12:00 Uhr"
 * ```
 */
export function formatMilestoneText(event: MilestoneEvent): string {
  const { locale } = useI18n()
  const formattedDate = fmtFull().format(event.date)
  
  // Format date string: add "am"/"on" prefix and replace comma before time with "um"/"at"
  let dateStr: string
  if (locale.value === 'de') {
    // German: "am Donnerstag, 28. März 2019 um 12:00 Uhr"
    // fmtFull gives: "Donnerstag, 28. März 2019, 12:00"
    dateStr = formattedDate
      .replace(/^([^,]+),/, 'am $1,') // Add "am" before weekday
      .replace(/, (\d{1,2}:\d{2})/, ' um $1 Uhr') // Replace comma+space before time with " um " and add " Uhr"
  } else {
    // English: "on Thursday, March 28, 2019 at 12:00 PM"
    // fmtFull gives: "Thursday, March 28, 2019, 12:00 PM" (or similar)
    dateStr = formattedDate
      .replace(/^([^,]+),/, 'on $1,') // Add "on" before weekday
      .replace(/, (\d{1,2}:\d{2}(?:\s*[AP]M)?)/i, ' at $1') // Replace comma+space before time with " at "
  }
  
  // Format: "30 Jahre seit Christians Geburtstag\nvor 6 Jahren, am Donnerstag, 28. März 2019 um 12:00 Uhr"
  return `${event.baseTitle} ${event.since}\n${event.inHuman}, ${dateStr}`
}
