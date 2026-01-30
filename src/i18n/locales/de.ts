export default {
  common: {
    save: 'Speichern',
    cancel: 'Abbrechen',
    reset: 'Zurücksetzen',
    close: 'Schließen',
    copy: 'Kopieren',
    share: 'Teilen',
    download: 'Herunterladen',
    selectAll: 'Alle auswählen',
    selectNone: 'Alle abwählen',
    loading: 'Lädt...',
    error: 'Fehler',
    success: 'Erfolg',
    shortcut: 'Strg/Cmd + K zum Wechseln'
  },
  ui: {
    title: 'Jubiläumsrechner',
    description: 'Berechne besondere Jubiläen & exportiere sie als Kalender',
    inputs: 'Eingaben',
    milestones: 'Jubiläen',
    results: 'Ergebnisse'
  },
  form: {
    label: 'Titel (optional)',
    labelPlaceholder: 'Kennenlernen, Geburt, Hochzeit …',
    date: 'Datum',
    time: 'Uhrzeit (optional)',
    units: 'Einheiten',
    patterns: 'Muster',
    yearRange: 'Jahresbereich',
    yearFrom: 'von',
    yearTo: 'bis',
    roundedMultiples: 'Runde Vielfache',
    roundedMultiplesExamples: '500, 2.000, 10.000, …',
    repdigits: 'Schnapszahlen',
    repdigitsExamples: '11, 2.222, 333, 444.444.444 …'
  },
  units: {
    years: 'Jahre',
    months: 'Monate',
    weeks: 'Wochen',
    days: 'Tage',
    hours: 'Stunden',
    minutes: 'Minuten',
    seconds: 'Sekunden',
    year: 'Jahr',
    month: 'Monat',
    week: 'Woche',
    day: 'Tag',
    hour: 'Stunde',
    minute: 'Minute',
    second: 'Sekunde'
  },
  patterns: {
    rounded: 'Runde Vielfache',
    repdigit: 'Schnapszahlen'
  },
  theme: {
    light: 'Hell',
    dark: 'Dunkel',
    system: 'System',
    switch: 'Darstellung'
  },
  results: {
    empty: 'Keine Einträge im Zeitraum. Passe Einheiten/Muster oder den Jahresbereich an.',
    loading: 'Berechne Jubiläen...',
    downloadTooltip: 'Kalenderdatei für {{count}} Ereignis{{plural}} im .ics-Format herunterladen',
    downloadTooltipNone: 'Keine ausgewählten sichtbaren Einträge',
    selectAll: 'Alle auswählen',
    selectNone: 'Alle abwählen',
    selectYearAll: 'Alle Jubiläen für {{year}} auswählen',
    selectYearNone: 'Auswahl für {{year}} aufheben',
    selectYearAllShort: 'Jahr auswählen',
    selectYearNoneShort: 'Jahr abwählen',
    year: 'Jahr',
    since: 'seit',
    in: 'In',
    ago: 'vor'
  },
  export: {
    title: 'Exportieren',
    description: 'Wähle Jubiläen aus und exportiere sie in verschiedenen Formaten wie ICS, CSV oder JSON. Du kannst auch die aktuelle Ansicht mit anderen teilen.',
    exportCSV: 'Als CSV exportieren',
    exportJSON: 'Als JSON exportieren',
    exportPDF: 'Als PDF exportieren',
    exportPDFDisabled: 'Als PDF exportieren (noch nicht implementiert)',
    shareView: 'Ansicht teilen',
    shareViewTitle: 'Aktuelle Ansicht teilen',
    milestonesTitle: 'Jubiläen'
  },
  inputs: {
    description: 'Gib dein Startdatum ein und wähle die Einheiten und Muster aus, nach denen Jubiläen berechnet werden sollen.'
  },
  errors: {
    invalidDate: 'Ungültiges Datum',
    invalidTime: 'Ungültige Zeit',
    invalidLabel: 'Ungültiger Titel',
    invalidYearRange: 'Ungültiger Jahresbereich',
    noUnits: 'Bitte wähle mindestens eine Einheit aus',
    noPatterns: 'Bitte wähle mindestens ein Muster aus',
    computeError: 'Fehler beim Berechnen der Jubiläen',
    copyError: 'Fehler beim Kopieren',
    shareError: 'Fehler beim Teilen'
  },
  success: {
    copied: 'Meilenstein kopiert',
    linkCopied: 'Link kopiert',
    shared: 'Geteilt'
  },
  validation: {
    dateRequired: 'Bitte wähle ein Datum aus',
    dateTooOld: 'Das Datum muss nach {{year}} sein',
    dateTooNew: 'Das Datum muss vor {{year}} sein',
    timeInvalid: 'Ungültiges Zeitformat (erwartet: HH:MM oder HH:MM:SS)',
    labelTooLong: 'Der Titel darf maximal 100 Zeichen lang sein',
    labelInvalidChars: 'Der Titel enthält ungültige Zeichen',
    yearFromTooEarly: 'Das Startjahr muss mindestens {{year}} sein',
    yearToTooLate: 'Das Endjahr darf maximal {{year}} sein',
    yearToBeforeFrom: 'Das Endjahr muss nach dem Startjahr liegen'
  }
}
