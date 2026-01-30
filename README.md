# 🎉 Jubiläumsrechner (Anniversary Calculator)

A modern, feature-rich web application for calculating and exploring special date and time milestones. Calculate anniversaries in various units (years, months, weeks, days, hours, minutes, seconds) and discover meaningful patterns like rounded multiples, repdigits, and more. Export your milestones to ICS, CSV, or JSON formats, share them with others, and enjoy a beautiful, accessible interface with full internationalization support.

## ✨ Features

*   📅 **Customizable Start Date & Time:** Define any past or present date and an optional time as your starting point.
*   📊 **Smart Year Range Selection:** Automatically adjusts year range when entering a date, or manually select specific years.
*   ⏱️ **Multiple Units:** Calculate milestones in years, months, weeks, days, hours, minutes, and seconds.
*   🔢 **Pattern-Based Milestone Generation:**
    *   **Rounded Multiples:** Find milestones like 10, 100, 500, 1,000, 10,000, etc.
    *   **Repdigits (Schnapszahlen):** Identify milestones such as 11, 222, 3,333, etc.
*   ⚡ **Real-time Updates:** Automatic recalculation as you modify inputs, with optimized performance for large date ranges.
*   📥 **Multiple Export Formats:**
    *   **ICS:** Download selected milestones as `.ics` calendar files
    *   **CSV:** Export data for spreadsheet applications
    *   **JSON:** Export structured data for further processing
*   📋 **Copy to Clipboard:** Quickly copy milestone information in a concise format.
*   🔗 **Share Functionality:** Share your milestone view with others via URL or native share API.
*   🌍 **Internationalization:** Full support for German and English with locale-aware date/number formatting.
*   🎨 **Theming:** Switch between light, dark, or system-preferred color schemes.
*   ⌨️ **Keyboard Shortcuts:** Efficient navigation and actions via keyboard shortcuts.
*   🔗 **URL Persistence:** Share or bookmark your specific calculations as the application state is reflected in the URL.
*   ♿ **Accessibility:** Full ARIA support, keyboard navigation, and screen reader compatibility.

## 🚀 Quick Start

### For Users

1. **Enter your start date and time** (optional title)
2. **Select units** you want to calculate (years, months, weeks, days, hours, minutes, seconds)
3. **Choose patterns** (Rounded Multiples, Repdigits)
4. **View results** - milestones are automatically calculated and displayed
5. **Select milestones** using checkboxes (all selected by default)
6. **Export or share** your milestones using the export buttons or share functionality

### For Developers

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start development server:**
   ```bash
   npm run dev
   ```
   Open the URL shown in the terminal (usually `http://localhost:5173`)

3. **Build for production:**
   ```bash
   npm run build
   ```
   Serve the `dist/` folder with any static file server

4. **Type checking:**
   ```bash
   npm run type-check
   ```

5. **Run tests:**
   ```bash
   npm run test
   ```

## 📖 Usage Examples

### Example 1: Birthday Anniversaries
- **Title:** "Geburtstag"
- **Date:** Your birth date
- **Units:** Years, Months, Weeks
- **Patterns:** Rounded Multiples, Repdigits
- **Result:** Find milestones like "1000 Wochen", "25 Jahre", "111 Monate"

### Example 2: Relationship Milestones
- **Title:** "Kennenlernen"
- **Date:** When you first met
- **Units:** Days, Weeks, Months
- **Patterns:** Rounded Multiples
- **Result:** Celebrate milestones like "100 Tage", "500 Tage", "1000 Tage"

### Example 3: Work Anniversaries
- **Title:** "Arbeitsbeginn"
- **Date:** Start date at company
- **Units:** Years, Months
- **Patterns:** Rounded Multiples
- **Result:** Track professional milestones

## ⌨️ Keyboard Shortcuts

- `Ctrl/Cmd + K` - Toggle keyboard shortcuts help
- `Ctrl/Cmd + A` - Select/deselect all visible milestones
- `Ctrl/Cmd + D` - Download ICS file
- `Ctrl/Cmd + C` - Copy milestone (when focused)
- `Esc` - Close modals/dialogs

## 💻 Development

The project is built with **Vue 3**, **TypeScript**, and **Vite** for a modern, maintainable codebase.

### 🛠️ Tech Stack

*   **Vue 3** - Progressive JavaScript framework with Composition API
*   **TypeScript** - Type-safe JavaScript for better developer experience
*   **Vite** - Fast build tool and development server
*   **CSS Variables** - Theming system supporting light and dark modes

### 📁 Project Structure

```
src/
├── components/          # Vue components
│   ├── AppHeader.vue    # Application header with title and controls
│   ├── InputPanel.vue   # Input form for date, units, patterns
│   ├── ResultsPanel.vue # Results display and export controls
│   ├── MilestoneItem.vue # Individual milestone display
│   ├── YearSeparator.vue # Year grouping separator
│   ├── ThemeSwitch.vue  # Theme selection component
│   ├── LanguageSwitch.vue # Language selection component
│   ├── Toast.vue        # Toast notification component
│   ├── ErrorAlert.vue   # Error display component
│   └── KeyboardShortcutsHelp.vue # Keyboard shortcuts modal
├── composables/         # Vue composables (reusable logic)
│   ├── useAppState.ts   # Application state management
│   ├── useTheme.ts      # Theme management
│   ├── useUrlState.ts   # URL state persistence
│   ├── useI18n.ts       # Internationalization
│   ├── useToast.ts      # Toast notifications
│   ├── useError.ts      # Error handling
│   └── useKeyboardShortcuts.ts # Keyboard shortcuts
├── utils/               # Utility functions
│   ├── date.ts          # Date calculations (addYears, addMonths, etc.)
│   ├── patterns.ts      # Pattern matching logic (rounded, repdigit)
│   ├── i18n.ts          # Internationalization utilities
│   ├── compute.ts       # Milestone computation engine
│   ├── ics.ts           # ICS file generation
│   ├── export.ts        # CSV/JSON export functions
│   ├── clipboard.ts     # Clipboard utilities
│   ├── share.ts         # Share URL generation
│   ├── validation.ts    # Input validation
│   └── sanitize.ts      # Input sanitization
├── i18n/                # Internationalization
│   ├── index.ts         # i18n composable
│   └── locales/
│       ├── de.ts        # German translations
│       └── en.ts        # English translations
├── types/               # TypeScript type definitions
│   └── index.ts         # Type definitions and config
├── styles/              # CSS styles (modular)
│   ├── tokens.css       # Design tokens (colors, spacing)
│   ├── base.css         # Base styles and layout
│   ├── components.css   # Component styles
│   ├── utilities.css    # Utility classes
│   └── main.css         # Main stylesheet entry
├── App.vue              # Root component
└── main.ts              # Application entry point
```

### 🏁 Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start development server:**
   ```bash
   npm run dev
   ```

3. **Build for production:**
   ```bash
   npm run build
   ```

4. **Type checking:**
   ```bash
   npm run type-check
   ```

### 🔑 Key Features

*   **Component-Based Architecture:** Modular Vue components for better maintainability
*   **Type Safety:** TypeScript ensures type correctness throughout the codebase
*   **Composables:** Reusable logic with Vue Composition API
*   **Hot Module Replacement:** Instant updates during development with Vite
*   **Optimized Builds:** Production builds are optimized and minified
*   **Accessibility:** Full ARIA support, keyboard navigation, screen reader compatibility
*   **Internationalization:** Custom i18n system with locale-aware formatting
*   **Responsive Design:** Mobile-first approach with breakpoints
*   **Dark Mode:** System-aware theme switching with smooth transitions

### 📋 Code Organization

*   **Components:** UI components organized by feature
*   **Composables:** Shared reactive logic (state, theme, URL, i18n)
*   **Utils:** Pure functions for calculations and transformations
*   **Types:** Centralized TypeScript type definitions
*   **Styles:** Modular CSS with design tokens and component styles
*   **i18n:** Translation files and locale management

## 🌐 Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 📚 Documentation

- **[API Documentation](./docs/API.md)** - Detailed API reference for composables and utilities
- **[Implementation Plan](./.cursor/IMPLEMENTATION_PLAN.md)** - Feature implementation roadmap

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the MIT License.

---

💡 **Tip:** Explore the `src/` directory to understand the implementation details. The codebase is well-organized and documented with JSDoc comments.
