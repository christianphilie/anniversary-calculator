import type { MilestoneEvent, Unit, Patterns } from '../types'
import { jsPDF } from 'jspdf'
import { fmtFull } from './i18n'

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
 * Exports milestones to PDF format
 * 
 * @param events - Array of milestone events to export
 * @param label - Label/title for the milestones
 * @param locale - Locale for formatting ('de' | 'en')
 * @param metadata - Metadata including start date, time, year range, units, and patterns
 * @returns jsPDF instance
 */
export function exportToPDF(
  events: MilestoneEvent[],
  label: string,
  locale: 'de' | 'en',
  metadata: {
    start: Date | null
    yearFrom: number | null
    yearTo: number | null
    units: Unit[]
    patterns: Patterns
  }
): jsPDF {
  const doc = new jsPDF()
  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  const margin = 20
  const maxWidth = pageWidth - 2 * margin
  let yPos = margin
  
  // Title
  doc.setFontSize(18)
  doc.setFont('helvetica', 'bold')
  const title = label || (locale === 'de' ? 'Jubiläen' : 'Anniversaries')
  doc.text(title, margin, yPos)
  yPos += 10
  
  // "Jubiläen von [Label]" above title (same style as date/time)
  doc.setFontSize(11)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(100, 100, 100)
  const fromText = locale === 'de'
    ? `Jubiläen von ${label || 'Start'}`
    : `Anniversaries of ${label || 'Start'}`
  doc.text(fromText, margin, yPos)
  yPos += 6
  
  // Date and time as subtitle (if start date available)
  if (metadata.start) {
    const dateFormatter = fmtFull()
    // fmtFull() already includes time, so we just use it directly
    const dateTimeStr = dateFormatter.format(metadata.start)
    doc.text(dateTimeStr, margin, yPos)
    yPos += 8
  }
  
  doc.setTextColor(0, 0, 0)
  
  // Count and source in top right (gray, less important)
  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(128, 128, 128)
  const countText = locale === 'de'
    ? `${events.length} ${events.length === 1 ? 'Jubiläum' : 'Jubiläen'}`
    : `${events.length} ${events.length === 1 ? 'anniversary' : 'anniversaries'}`
  const sourceText = locale === 'de'
    ? 'gefunden vom Jubiläumsrechner'
    : 'found by Anniversary Calculator'
  const domainText = 'anniversary-calculator-eight.vercel.app'
  
  const countWidth = doc.getTextWidth(countText)
  doc.text(countText, pageWidth - margin - countWidth, margin)
  const sourceWidth = doc.getTextWidth(sourceText)
  doc.text(sourceText, pageWidth - margin - sourceWidth, margin + 5)
  const domainWidth = doc.getTextWidth(domainText)
  doc.text(domainText, pageWidth - margin - domainWidth, margin + 10)
  doc.setTextColor(0, 0, 0)
  
  yPos += 8
  
  // Group events by year
  const eventsByYear = new Map<number, MilestoneEvent[]>()
  events.forEach(event => {
    const year = event.date.getFullYear()
    if (!eventsByYear.has(year)) {
      eventsByYear.set(year, [])
    }
    eventsByYear.get(year)!.push(event)
  })
  
  const sortedYears = Array.from(eventsByYear.keys()).sort((a, b) => a - b)
  
  // Table rows grouped by year (no headers)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  
  sortedYears.forEach((year, yearIndex) => {
    const yearEvents = eventsByYear.get(year)!
    
    yearEvents.forEach((event, eventIndex) => {
      // Check if we need a new page
      if (yPos > pageHeight - margin - 15) {
        doc.addPage()
        yPos = margin
      }
      
      // Year separator (always show for first event of each year, including first year)
      if (eventIndex === 0) {
        if (yPos > margin) {
          yPos += 4
        }
        doc.setFontSize(12)
        doc.setFont('helvetica', 'bold')
        doc.setTextColor(60, 60, 60)
        doc.text(year.toString(), margin, yPos)
        doc.setTextColor(0, 0, 0)
        yPos += 8
        doc.setFontSize(9)
        doc.setFont('helvetica', 'normal')
      }
      
      // Title (without "seit [label]")
      const title = doc.splitTextToSize(event.baseTitle, maxWidth * 0.5)
      doc.text(title, margin, yPos)
      
      // Date and time (right aligned) - format date without time suffix since it's already in the date
      const dateFormatter = fmtFull()
      let dateTimeStr = dateFormatter.format(event.date)
      // Don't add "Uhr" again, it's already in fmtFull() output for German
      const dateTimeWidth = doc.getTextWidth(dateTimeStr)
      doc.text(dateTimeStr, pageWidth - margin - dateTimeWidth, yPos)
      
      yPos += 6
      
      // Add subtle line between rows
      if (yearIndex < sortedYears.length - 1 || eventIndex < yearEvents.length - 1) {
        doc.setLineWidth(0.1)
        doc.setDrawColor(200, 200, 200)
        doc.line(margin, yPos - 2, pageWidth - margin, yPos - 2)
        doc.setDrawColor(0, 0, 0)
        yPos += 2
      }
    })
  })
  
  // Footer
  const totalPages = doc.getNumberOfPages()
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i)
    doc.setFontSize(8)
    doc.setFont('helvetica', 'italic')
    doc.setTextColor(128, 128, 128)
    const footerText = locale === 'de'
      ? `Seite ${i} von ${totalPages}`
      : `Page ${i} of ${totalPages}`
    doc.text(footerText, pageWidth - margin - 20, pageHeight - 10)
    doc.setTextColor(0, 0, 0)
  }
  
  return doc
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
