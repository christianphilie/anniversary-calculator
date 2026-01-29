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
    success: 'Success'
  },
  ui: {
    title: 'Anniversary Calculator',
    description: 'Calculate special milestones & export them as calendar',
    inputs: 'Inputs',
    milestones: 'Milestones',
    results: 'Results'
  },
  form: {
    label: 'Title (optional)',
    labelPlaceholder: 'Meeting, Birth, Wedding …',
    date: 'Date',
    time: 'Time (optional)',
    units: 'Units',
    patterns: 'Patterns',
    yearFrom: 'Years from',
    yearTo: 'Years to',
    roundedMultiples: 'Rounded multiples (500, 10,000, …)',
    repdigits: 'Repdigits (11, 2,222, 333, …)'
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
    loading: 'Calculating milestones...',
    downloadTooltip: 'Download calendar file for {{count}} event{{plural}} in .ics format',
    downloadTooltipNone: 'No selected visible entries',
    selectAll: 'Select all visible entries',
    selectNone: 'Deselect visible entries',
    selectYearAll: 'Select all milestones for {{year}}',
    selectYearNone: 'Deselect for {{year}}',
    since: 'since',
    in: 'In',
    ago: 'ago'
  },
  errors: {
    invalidDate: 'Invalid date',
    invalidTime: 'Invalid time',
    invalidLabel: 'Invalid title',
    invalidYearRange: 'Invalid year range',
    noUnits: 'Please select at least one unit',
    noPatterns: 'Please select at least one pattern',
    computeError: 'Error calculating milestones',
    copyError: 'Error copying',
    shareError: 'Error sharing'
  },
  success: {
    copied: 'Milestone copied',
    linkCopied: 'Link copied',
    shared: 'Shared'
  },
  validation: {
    dateRequired: 'Please select a date',
    dateTooOld: 'Date must be after {{year}}',
    dateTooNew: 'Date must be before {{year}}',
    timeInvalid: 'Invalid time format (expected: HH:MM or HH:MM:SS)',
    labelTooLong: 'Title must not exceed 100 characters',
    labelInvalidChars: 'Title contains invalid characters',
    yearFromTooEarly: 'Start year must be at least {{year}}',
    yearToTooLate: 'End year must not exceed {{year}}',
    yearToBeforeFrom: 'End year must be after start year'
  }
}
