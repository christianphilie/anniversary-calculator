# API Documentation

This document provides a comprehensive reference for the Anniversary Calculator API, including composables, utilities, and type definitions.

## Table of Contents

- [Composables](#composables)
  - [useAppState](#useappstate)
  - [useI18n](#usei18n)
  - [useTheme](#usetheme)
  - [useUrlState](#useurlstate)
  - [useToast](#usetoast)
  - [useError](#useerror)
  - [useKeyboardShortcuts](#usekeyboardshortcuts)
- [Utilities](#utilities)
  - [Date Utilities](#date-utilities)
  - [Pattern Matching](#pattern-matching)
  - [Computation](#computation)
  - [Export Functions](#export-functions)
  - [Internationalization](#internationalization)
- [Types](#types)

---

## Composables

### useAppState

Manages the global application state including milestones, selections, and computation.

**Location:** `src/composables/useAppState.ts`

**Usage:**
```typescript
import { useAppState } from '@/composables/useAppState'

const { state, isLoading, visibleSelected, recompute, selectAll, selectNone } = useAppState()
```

**Returns:**
```typescript
interface AppStateComposable {
  state: Ref<AppState>
  isLoading: Ref<boolean>
  visibleSelected: ComputedRef<MilestoneEvent[]>
  recompute: (start: Date, label: string, units: Unit[], patterns: Patterns, yearFrom: number, yearTo: number) => Promise<void>
  selectAll: () => void
  selectNone: () => void
  toggleSelection: (id: string) => void
  selectYear: (year: number, select: boolean) => void
  reset: () => void
}
```

**Methods:**

- `recompute(start, label, units, patterns, yearFrom, yearTo)` - Recomputes milestones based on input parameters
- `selectAll()` - Selects all visible milestones
- `selectNone()` - Deselects all visible milestones
- `toggleSelection(id)` - Toggles selection state of a specific milestone
- `selectYear(year, select)` - Selects/deselects all milestones for a specific year
- `reset()` - Resets the application state to initial values

**Example:**
```typescript
const { state, recompute } = useAppState()

await recompute(
  new Date('2020-01-01'),
  'Birthday',
  ['years', 'months'],
  { rounded: true, repdigit: false },
  2020,
  2030
)

console.log(state.value.eventsView.length) // Number of milestones
```

---

### useI18n

Provides internationalization functionality with reactive translations and locale management.

**Location:** `src/i18n/index.ts`

**Usage:**
```typescript
import { useI18n } from '@/i18n'

const { locale, t, setLocale } = useI18n()
```

**Returns:**
```typescript
{
  locale: Ref<'de' | 'en'>
  t: ComputedRef<(key: string, params?: Record<string, string | number>) => string>
  setLocale: (locale: 'de' | 'en') => void
}
```

**Methods:**

- `t(key, params?)` - Translates a key with optional parameters
- `setLocale(locale)` - Changes the current locale and updates formatters

**Example:**
```typescript
const { t, setLocale } = useI18n()

// Translate a key
const text = t.value('common.save') // "Speichern" or "Save"

// Translate with parameters
const message = t.value('results.downloadTooltip', { count: '5', plural: 'se' })

// Change locale
setLocale('en')
```

**Translation Keys:**
- `common.*` - Common UI strings (save, cancel, reset, etc.)
- `ui.*` - UI labels (title, description, inputs, etc.)
- `form.*` - Form labels and placeholders
- `units.*` - Unit labels (years, months, etc.)
- `patterns.*` - Pattern labels
- `results.*` - Results panel strings
- `export.*` - Export-related strings
- `errors.*` - Error messages
- `validation.*` - Validation messages

---

### useTheme

Manages theme state (light, dark, system).

**Location:** `src/composables/useTheme.ts`

**Usage:**
```typescript
import { useTheme } from '@/composables/useTheme'

const { mode, setMode } = useTheme()
```

**Returns:**
```typescript
{
  mode: Ref<'light' | 'dark' | 'system'>
  setMode: (mode: 'light' | 'dark' | 'system') => void
}
```

**Example:**
```typescript
const { mode, setMode } = useTheme()

setMode('dark') // Switch to dark mode
console.log(mode.value) // 'dark'
```

---

### useUrlState

Manages URL state persistence and loading.

**Location:** `src/composables/useUrlState.ts`

**Usage:**
```typescript
import { useUrlState } from '@/composables/useUrlState'
import { useAppState } from '@/composables/useAppState'

const { state } = useAppState()
const { loadStateFromURL, encodeStateToURL } = useUrlState(state)
```

**Methods:**

- `loadStateFromURL()` - Loads application state from URL parameters
- `encodeStateToURL()` - Encodes current state to URL parameters

**URL Parameters:**
- `d` - Date (YYYY-MM-DD)
- `t` - Time (HH:MM:SS)
- `l` - Label
- `u` - Units (comma-separated)
- `p` - Patterns (JSON)
- `yf` - Year from
- `yt` - Year to
- `m` - Selected milestone IDs (comma-separated or base64)

---

### useToast

Provides toast notification functionality.

**Location:** `src/composables/useToast.ts`

**Usage:**
```typescript
import { useToast } from '@/composables/useToast'

const { success, error, info } = useToast()
```

**Methods:**

- `success(message)` - Shows a success toast
- `error(message)` - Shows an error toast
- `info(message)` - Shows an info toast

**Example:**
```typescript
const { success, error } = useToast()

success('Milestone copied!')
error('Failed to copy')
```

---

### useError

Manages global error state.

**Location:** `src/composables/useError.ts`

**Usage:**
```typescript
import { useError } from '@/composables/useError'

const { error, setError, clearError } = useError()
```

**Returns:**
```typescript
{
  error: Ref<string | null>
  setError: (message: string) => void
  clearError: () => void
}
```

---

### useKeyboardShortcuts

Registers and manages keyboard shortcuts.

**Location:** `src/composables/useKeyboardShortcuts.ts`

**Usage:**
```typescript
import { useKeyboardShortcuts } from '@/composables/useKeyboardShortcuts'

useKeyboardShortcuts() // Called in App.vue
```

**Shortcuts:**
- `Ctrl/Cmd + K` - Toggle keyboard shortcuts help
- `Ctrl/Cmd + A` - Select/deselect all visible milestones
- `Ctrl/Cmd + D` - Download ICS file
- `Ctrl/Cmd + C` - Copy milestone (when focused)
- `Esc` - Close modals/dialogs

---

## Utilities

### Date Utilities

**Location:** `src/utils/date.ts`

#### `addYears(date: Date, n: number): Date`
Adds years to a date, handling leap years correctly.

#### `addMonths(date: Date, n: number): Date`
Adds months to a date, handling month overflow and day clamping.

#### `addWeeks(date: Date, n: number): Date`
Adds weeks to a date.

#### `addDays(date: Date, n: number): Date`
Adds days to a date.

#### `addHours(date: Date, n: number): Date`
Adds hours to a date.

#### `addMinutes(date: Date, n: number): Date`
Adds minutes to a date.

#### `addSeconds(date: Date, n: number): Date`
Adds seconds to a date.

#### `yearsBetween(a: Date, b: Date): number`
Calculates the number of years between two dates.

#### `diffMonths(a: Date, b: Date): number`
Calculates the number of months between two dates.

#### `toLocalDateInputValue(date: Date): string`
Converts a Date to a string suitable for `<input type="date">`.

---

### Pattern Matching

**Location:** `src/utils/patterns.ts`

#### `isRounded(n: number): boolean`
Checks if a number is a rounded multiple (power of 10 or k×10^n).

#### `isRepdigit(n: number): boolean`
Checks if a number is a repdigit (all digits are the same, e.g., 11, 222, 3333).

#### `buildCandidates(maxN: number, patterns: PatternOptions): number[]`
Generates candidate numbers based on enabled patterns.

#### `classifyPatterns(n: number): { rounded: boolean; repdigit: boolean }`
Classifies which patterns a number matches.

**Example:**
```typescript
import { isRounded, isRepdigit, buildCandidates } from '@/utils/patterns'

isRounded(100) // true
isRepdigit(222) // true

const candidates = buildCandidates(1000, { rounded: true, repdigit: false })
// [10, 20, 30, ..., 100, 200, ..., 1000]
```

---

### Computation

**Location:** `src/utils/compute.ts`

#### `computeRangeWindow(start: Date, opts: ComputeOptions, from: Date, to: Date): MilestoneEvent[]`

Computes milestone events within a given date range window.

**Parameters:**
- `start` - The starting date for milestone calculations
- `opts` - Options including label, units, patterns, and locale
- `from` - Start of the date range window (inclusive)
- `to` - End of the date range window (inclusive)

**Returns:** Array of milestone events sorted by date and then by number

**Example:**
```typescript
import { computeRangeWindow } from '@/utils/compute'

const events = computeRangeWindow(
  new Date('2020-01-01'),
  {
    label: 'Birthday',
    units: ['years', 'months'],
    patterns: { rounded: true, repdigit: false },
    locale: 'en'
  },
  new Date('2020-01-01'),
  new Date('2030-01-01')
)
```

---

### Export Functions

**Location:** `src/utils/export.ts`

#### `exportToCSV(events: MilestoneEvent[]): string`
Exports milestones to CSV format.

**Returns:** CSV string with headers: Titel, Datum, Relatives Datum, Einheit, Beschreibung

#### `exportToJSON(events: MilestoneEvent[]): string`
Exports milestones to JSON format.

**Returns:** Pretty-printed JSON string

#### `downloadFile(filename: string, content: string, mimeType: string): void`
Downloads a file with the given content.

**Example:**
```typescript
import { exportToCSV, exportToJSON, downloadFile } from '@/utils/export'

const csv = exportToCSV(events)
downloadFile('milestones.csv', csv, 'text/csv;charset=utf-8')

const json = exportToJSON(events)
downloadFile('milestones.json', json, 'application/json;charset=utf-8')
```

**Location:** `src/utils/ics.ts`

#### `buildICS(events: MilestoneEvent[]): string`
Builds an ICS calendar file from milestone events.

#### `downloadICS(filename: string, icsContent: string): void`
Downloads an ICS file.

---

### Internationalization

**Location:** `src/utils/i18n.ts`

#### `labelDE(unit: Unit, n: number): string`
Returns German unit label (singular/plural).

#### `labelEN(unit: Unit, n: number): string`
Returns English unit label (singular/plural).

#### `getUnitLabel(unit: Unit, n: number, locale: 'de' | 'en'): string`
Returns unit label for the specified locale.

#### `humanDiff(from: Date, to: Date, locale: 'de' | 'en'): string`
Returns human-readable time difference (e.g., "vor 2 Jahren", "2 years ago").

#### `fmtFull(): Intl.DateTimeFormat`
Returns a date/time formatter for the current locale.

#### `fmtNum(): Intl.NumberFormat`
Returns a number formatter for the current locale.

**Example:**
```typescript
import { getUnitLabel, humanDiff, fmtFull, fmtNum } from '@/utils/i18n'

getUnitLabel('years', 5, 'en') // 'years'
humanDiff(new Date('2020-01-01'), new Date('2022-01-01'), 'en') // '2 years ago'

const formatter = fmtFull()
formatter.format(new Date()) // Locale-formatted date string
```

---

### Clipboard

**Location:** `src/utils/clipboard.ts`

#### `copyToClipboard(text: string): Promise<boolean>`
Copies text to clipboard with fallback for older browsers.

#### `formatMilestoneText(event: MilestoneEvent): string`
Formats a milestone event as a concise text string for copying.

---

### Share

**Location:** `src/utils/share.ts`

#### `generateShareUrl(milestoneIds: string[]): string`
Generates a shareable URL with milestone IDs.

#### `parseShareUrl(): string[] | null`
Parses milestone IDs from the current URL.

#### `isNativeShareAvailable(): boolean`
Checks if the native Share API is available.

#### `shareMilestones(ids: string[], title: string, text: string): Promise<boolean>`
Shares milestones using the native Share API.

---

## Types

**Location:** `src/types/index.ts`

### `Unit`
```typescript
type Unit = 'years' | 'months' | 'weeks' | 'days' | 'hours' | 'minutes' | 'seconds'
```

### `PatternType`
```typescript
type PatternType = 'rounded' | 'repdigit'
```

### `Patterns`
```typescript
interface Patterns {
  rounded: boolean
  repdigit: boolean
}
```

### `MilestoneEvent`
```typescript
interface MilestoneEvent {
  id: string
  unit: Unit
  n: number
  date: Date
  baseTitle: string
  since: string
  inHuman: string
  desc: string
  patterns: {
    rounded: boolean
    repdigit: boolean
  }
}
```

### `AppState`
```typescript
interface AppState {
  start: Date | null
  label: string
  units: Unit[]
  patterns: Patterns
  eventsAll: MilestoneEvent[]
  eventsView: MilestoneEvent[]
  selected: Set<string>
  yearFrom: number | null
  yearTo: number | null
}
```

### `ComputeOptions`
```typescript
interface ComputeOptions {
  label: string
  units: Unit[]
  patterns: Patterns
  locale?: 'de' | 'en'
}
```

---

## Configuration

**Location:** `src/types/index.ts`

### `CONFIG`
```typescript
const CONFIG = {
  MAX_SPAN: 300,              // Maximum year span
  DEBOUNCE_DELAY: 120,        // Debounce delay in ms
  MIN_N: {                    // Minimum values per unit
    seconds: 10_000_000,
    minutes: 100_000,
    hours: 1_000,
    days: 100,
    weeks: 10,
    months: 10,
    years: 1
  },
  REPDIGIT_MAX_LENGTH: 12,    // Maximum repdigit length
  DEFAULT_TIME: '12:00:00'    // Default time
}
```

---

## Examples

### Complete Example: Computing and Exporting Milestones

```typescript
import { useAppState } from '@/composables/useAppState'
import { exportToCSV, downloadFile } from '@/utils/export'

const { state, recompute, visibleSelected } = useAppState()

// Compute milestones
await recompute(
  new Date('2020-01-01'),
  'Birthday',
  ['years', 'months', 'weeks'],
  { rounded: true, repdigit: true },
  2020,
  2030
)

// Export selected milestones
const selected = visibleSelected.value
const csv = exportToCSV(selected)
downloadFile('milestones.csv', csv, 'text/csv;charset=utf-8')
```

### Example: Using i18n

```typescript
import { useI18n } from '@/i18n'
import { getUnitLabel, humanDiff } from '@/utils/i18n'

const { locale, t, setLocale } = useI18n()

// Get translated text
const saveText = t.value('common.save')

// Format unit label
const unitLabel = getUnitLabel('years', 5, locale.value)

// Get human-readable difference
const diff = humanDiff(new Date('2020-01-01'), new Date(), locale.value)
```

---

For more details, see the source code with JSDoc comments.
