export default {
  common: {
    save: 'Save',
    cancel: 'Cancel',
    reset: 'Reset',
    close: 'Close',
    copy: 'Copy',
    share: 'Share',
    download: 'Download',
    selectAll: 'Select all',
    selectNone: 'Deselect all',
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    shortcut: 'Ctrl/Cmd + K to switch'
  },
  ui: {
    title: 'Anniversary Calculator',
    description: 'Calculate special anniversaries & export them as calendar',
    inputs: 'Inputs',
    milestones: 'Anniversaries',
    results: 'Results'
  },
  form: {
    label: 'Title (optional)',
    labelPlaceholder: 'Meeting, Birth, Wedding …',
    date: 'Date',
    time: 'Time (optional)',
    units: 'Units',
    patterns: 'Patterns',
    yearRange: 'Year Range',
    yearFrom: 'from',
    yearTo: 'to',
    roundedMultiples: 'Rounded multiples',
    roundedMultiplesExamples: '500, 2,000, 10,000, …',
    repdigits: 'Repdigits',
    repdigitsExamples: '11, 2,222, 333, 444,444,444 …'
  },
  units: {
    years: 'Years',
    months: 'Months',
    weeks: 'Weeks',
    days: 'Days',
    hours: 'Hours',
    minutes: 'Minutes',
    seconds: 'Seconds',
    year: 'Year',
    month: 'Month',
    week: 'Week',
    day: 'Day',
    hour: 'Hour',
    minute: 'Minute',
    second: 'Second'
  },
  patterns: {
    rounded: 'Rounded Multiples',
    repdigit: 'Repdigits'
  },
  theme: {
    light: 'Light',
    dark: 'Dark',
    system: 'System',
    switch: 'Theme'
  },
  results: {
    empty: 'No entries in time range. Adjust units/patterns or year range.',
    loading: 'Calculating anniversaries...',
    downloadTooltip: 'Download calendar file for {{count}} event{{plural}} in .ics format',
    downloadTooltipNone: 'No selected visible entries',
    selectAll: 'Select all',
    selectNone: 'Deselect all',
    selectYearAll: 'Select all anniversaries for {{year}}',
    selectYearNone: 'Deselect for {{year}}',
    selectYearAllShort: 'Select year',
    selectYearNoneShort: 'Deselect year',
    year: 'Year',
    since: 'since',
    in: 'In',
    ago: 'ago'
  },
  export: {
    title: 'Export',
    description: 'Select anniversaries and export them in various formats like ICS, CSV, JSON, or PDF. You can also share the current view with others.',
    exportCSV: 'Export as CSV',
    exportJSON: 'Export as JSON',
    exportPDF: 'Export as PDF',
    exportPDFDisabled: 'Export as PDF (not yet implemented)',
    shareView: 'Share view',
    shareViewTitle: 'Share current view',
    milestonesTitle: 'Anniversaries'
  },
  inputs: {
    description: 'Enter your start date and select the units and patterns to calculate anniversaries for.'
  },
  errors: {
    invalidDate: 'Invalid date',
    invalidTime: 'Invalid time',
    invalidLabel: 'Invalid title',
    invalidYearRange: 'Invalid year range',
    noUnits: 'Please select at least one unit',
    noPatterns: 'Please select at least one pattern',
    computeError: 'Error calculating anniversaries',
    copyError: 'Error copying',
    shareError: 'Error sharing',
    exportError: 'Error exporting'
  },
  success: {
    copied: 'Milestone copied',
    linkCopied: 'Link copied',
    shared: 'Shared',
    exported: 'Exported'
  },
  validation: {
    dateRequired: 'Please select a date',
    dateInvalid: 'Invalid date',
    dateTooOld: 'Date must be after {{year}}',
    dateTooNew: 'Date must be before {{year}}',
    timeInvalid: 'Invalid time format (expected: HH:MM or HH:MM:SS)',
    labelTooLong: 'Title must not exceed 100 characters',
    labelInvalidChars: 'Title contains invalid characters',
    labelNotAllowedChars: 'Title contains not allowed characters',
    yearFromTooEarly: 'Start year must be at least {{year}}',
    yearFromTooLate: 'Start year must not exceed {{year}}',
    yearToTooEarly: 'End year must be at least {{year}}',
    yearToTooLate: 'End year must not exceed {{year}}',
    yearToBeforeFrom: 'End year must be after start year',
    yearSpanTooLarge: 'Year range must not exceed {{span}} years',
    yearRangeInvalid: 'Invalid year values',
    unitsRequired: 'Please select at least one unit',
    patternsRequired: 'Please select at least one pattern',
    dateParseError: 'Invalid date or time',
    dateParseFailed: 'Error parsing date'
  }
}
