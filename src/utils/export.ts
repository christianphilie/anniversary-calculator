import type { MilestoneEvent } from '../types'

/**
 * Exports milestones to CSV format
 * 
 * @param events - Array of milestone events to export
 * @returns CSV string
 */
export function exportToCSV(events: MilestoneEvent[]): string {
  const headers = ['Titel', 'Datum', 'Relatives Datum', 'Einheit', 'Beschreibung']
  const rows = events.map(ev => [
    `${ev.baseTitle} ${ev.since}`,
    ev.date.toISOString(),
    ev.inHuman,
    ev.unit,
    ev.desc
  ])
  
  const csv = [headers, ...rows]
    .map(row => row.map(cell => `"${cell.replace(/"/g, '""')}"`).join(','))
    .join('\n')
  
  return csv
}

/**
 * Exports milestones to JSON format
 * 
 * @param events - Array of milestone events to export
 * @returns JSON string
 */
export function exportToJSON(events: MilestoneEvent[]): string {
  const data = events.map(ev => ({
    id: ev.id,
    title: `${ev.baseTitle} ${ev.since}`,
    date: ev.date.toISOString(),
    relativeDate: ev.inHuman,
    unit: ev.unit,
    description: ev.desc,
    patterns: ev.patterns
  }))
  
  return JSON.stringify(data, null, 2)
}

/**
 * Downloads a file with the given content
 * 
 * @param filename - Name of the file to download
 * @param content - Content of the file
 * @param mimeType - MIME type of the file
 */
export function downloadFile(filename: string, content: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
