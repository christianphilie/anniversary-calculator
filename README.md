# 🎉 Jubiläumsrechner (Anniversary Calculator)

A modern, feature-rich web application for calculating and exploring special date and time milestones. Calculate anniversaries in various units (years, months, weeks, days, hours, minutes, seconds) and discover meaningful patterns like rounded multiples, repdigits, and more. Export your milestones to ICS, CSV, or JSON formats, share them with others, and enjoy a beautiful, accessible interface with full internationalization support.

## ✨ Features

### Core Functionality

*   📅 **Customizable Start Date & Time:** Define any past or present date and an optional time as your starting point.
*   📊 **Smart Year Range Selection:** Automatically adjusts year range when entering a date, or manually select specific years. Expand ranges dynamically with "Load more" buttons.
*   ⏱️ **Multiple Units:** Calculate milestones in years, months, weeks, days, hours, minutes, and seconds. Select any combination of units.
*   🔢 **Pattern-Based Milestone Generation:**
    *   **Rounded Multiples:** Find milestones like 10, 100, 500, 1,000, 10,000, etc. Perfect for celebrating round numbers.
    *   **Repdigits (Schnapszahlen):** Identify milestones such as 11, 222, 3,333, etc. Special numbers with repeating digits.
    *   **Ascending Sequences:** Discover milestones like 123, 12345, or 123456789.

### Export & Sharing

*   📥 **Multiple Export Formats:**
    *   **ICS:** Download selected milestones as `.ics` calendar files for import into Google Calendar, Outlook, Apple Calendar, etc.
    *   **CSV:** Export data for spreadsheet applications (Excel, Google Sheets, Numbers)
    *   **JSON:** Export structured data for further processing or integration with other tools
    *   **PDF:** Generate formatted PDF documents with all milestones
*   📋 **Copy to Clipboard:** Quickly copy milestone information in a concise, readable format. Perfect for sharing in messages or emails.
*   🔗 **Share Functionality:** Share your milestone view with others via URL or native share API. URLs contain all state information for easy sharing.

### User Experience

*   ⚡ **Real-time Updates:** Automatic recalculation as you modify inputs, with optimized performance for large date ranges. No need to click "Calculate".
*   📈 **Current Values Panel:** Live counters show current years, months, weeks, days, hours, minutes, and seconds since the selected date/time.
*   🌍 **Internationalization:** Full support for German and English with locale-aware date/number formatting. Switch languages instantly.
*   🎨 **Theming:** Switch between light, dark, or system-preferred color schemes. Preferences are saved automatically.
*   🔗 **URL Persistence:** Share or bookmark your specific calculations as the application state is reflected in the URL. Reload the page to restore your state.
*   ♿ **Accessibility:** Full ARIA support, keyboard navigation, and screen reader compatibility. WCAG 2.1 AA compliant.
*   📱 **Responsive Design:** Optimized for desktop, tablet, and mobile devices. Touch-friendly interface on mobile.

## 🚀 Quick Start

### For Users

1. **Enter your start date and time** (optional title)
2. **Select units** you want to calculate (years, months, weeks, days, hours, minutes, seconds)
3. **Choose patterns** (Rounded Multiples, Repdigits, Ascending Sequences)
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
- **Use Case:** Track special birthday milestones, plan celebrations for round numbers

### Example 2: Relationship Milestones
- **Title:** "Kennenlernen"
- **Date:** When you first met
- **Units:** Days, Weeks, Months
- **Patterns:** Rounded Multiples
- **Result:** Celebrate milestones like "100 Tage", "500 Tage", "1000 Tage"
- **Use Case:** Celebrate relationship anniversaries, track time together

### Example 3: Work Anniversaries
- **Title:** "Arbeitsbeginn"
- **Date:** Start date at company
- **Units:** Years, Months
- **Patterns:** Rounded Multiples
- **Result:** Track professional milestones
- **Use Case:** Monitor career milestones, plan work anniversaries

### Example 4: Project Milestones
- **Title:** "Projektstart"
- **Date:** Project start date
- **Units:** Days, Weeks, Months, Years
- **Patterns:** Rounded Multiples, Repdigits
- **Result:** Track project duration milestones
- **Use Case:** Monitor project progress, celebrate milestones

### Example 5: Custom Events
- **Title:** Any custom label (e.g., "Hochzeit", "Umzug", "Abschluss")
- **Date:** Any past or present date
- **Units:** Select any combination
- **Patterns:** Choose patterns that interest you
- **Result:** Discover meaningful milestones for any event

## 💻 Development

The project is built with **Vue 3**, **TypeScript**, and **Vite** for a modern, maintainable codebase.

### Prerequisites

- **Node.js:** Version 18.x or higher
- **npm:** Version 9.x or higher (comes with Node.js)

### Development Workflow

### 🛠️ Tech Stack

*   **Vue 3** - Progressive JavaScript framework with Composition API
*   **TypeScript** - Type-safe JavaScript for better developer experience
*   **Vite** - Fast build tool and development server
*   **Tailwind CSS v4** - Utility-first styling with CSS variable-based theming
*   **shadcn/ui-style Vue primitives** - Reusable UI building blocks powered by `reka-ui`

### 📁 Project Structure

```
src/
├── components/          # Vue components
│   ├── AppHeader.vue    # Application header with title and controls
│   ├── InputPanel.vue   # Input form for date, units, patterns
│   ├── ResultsPanel.vue # Results display and export controls
│   ├── ui/              # shadcn-style UI primitives (Button, Card, Tabs, ...)
│   ├── MilestoneItem.vue # Individual milestone display
│   ├── YearSeparator.vue # Year grouping separator
│   ├── ThemeSwitch.vue  # Theme selection component
│   ├── LanguageSwitch.vue # Language selection component
│   ├── Toast.vue        # Toast notification component
│   └── ErrorAlert.vue   # Error display component
├── composables/         # Vue composables (reusable logic)
│   ├── useAppState.ts   # Application state management
│   ├── useTheme.ts      # Theme management
│   ├── useUrlState.ts   # URL state persistence
│   ├── useI18n.ts       # Internationalization
│   ├── useToast.ts      # Toast notifications
│   └── useError.ts      # Error handling
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
├── lib/                 # Shared helpers for UI/component composition
│   └── utils.ts         # cn() utility (clsx + tailwind-merge)
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

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd anniversary-calculator
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:3000` (or the port shown in terminal)

4. **Type checking:**
   ```bash
   npm run type-check
   ```
   Run this before committing to catch TypeScript errors

5. **Build for production:**
   ```bash
   npm run build
   ```
   Creates optimized production build in `dist/` directory

6. **Preview production build:**
   ```bash
   npm run preview
   ```
   Test the production build locally before deploying

### 🔑 Key Features

*   **Component-Based Architecture:** Modular Vue components for better maintainability and reusability
*   **Type Safety:** TypeScript ensures type correctness throughout the codebase, catching errors at compile time
*   **Composables:** Reusable logic with Vue Composition API for shared state and functionality
*   **Hot Module Replacement:** Instant updates during development with Vite for fast iteration
*   **Optimized Builds:** Production builds are optimized, minified, and tree-shaken for minimal bundle size
*   **Accessibility:** Full ARIA support, keyboard navigation, and screen reader compatibility (WCAG 2.1 AA compliant)
*   **Internationalization:** Custom i18n system with locale-aware date and number formatting
*   **Responsive Design:** Mobile-first approach with breakpoints for optimal experience on all devices
*   **Dark Mode:** System-aware theme switching with smooth transitions and persistent preferences
*   **Error Handling:** Comprehensive error boundaries and user-friendly error messages
*   **Performance:** Optimized calculations with memoization and efficient rendering

### 📋 Code Organization

*   **Components:** UI components organized by feature
*   **Composables:** Shared reactive logic (state, theme, URL, i18n)
*   **Utils:** Pure functions for calculations and transformations
*   **Types:** Centralized TypeScript type definitions
*   **Styles:** Modular CSS with design tokens and component styles
*   **i18n:** Translation files and locale management

## 📚 Documentation

- **[API Documentation](./docs/API.md)** - Detailed API reference for composables and utilities (coming soon)
- **[Implementation Plan](./.cursor/IMPLEMENTATION_PLAN.md)** - Feature implementation roadmap

## 🧪 Testing

Run the test suite:

```bash
# Run tests in watch mode
npm run test

# Run tests once
npm run test:run

# Run tests with coverage
npm run test:coverage

# Run tests with UI
npm run test:ui
```

## 🚀 Deployment

### Building for Production

```bash
npm run build
```

This creates an optimized production build in the `dist/` directory.

### Deploying

The application is a static site and can be deployed to any static hosting service:

- **Vercel:** `vercel deploy`
- **Netlify:** Drag and drop the `dist/` folder
- **GitHub Pages:** Configure to serve from `dist/` directory
- **Any static host:** Upload the contents of `dist/` to your server

### Environment Variables

No environment variables are required. The application works entirely client-side.

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Report bugs:** Open an issue with a clear description and steps to reproduce
2. **Suggest features:** Share your ideas for new features or improvements
3. **Submit PRs:** Fork the repo, make your changes, and submit a pull request
4. **Improve documentation:** Help improve the README or add code comments

### Development Guidelines

- Follow the existing code style (TypeScript, Vue 3 Composition API)
- Add tests for new features
- Update documentation as needed
- Ensure accessibility (ARIA labels, keyboard navigation)
- Test in multiple browsers

## 📄 License

This project is open source and available under the MIT License.

---

💡 **Tip:** Explore the `src/` directory to understand the implementation details. The codebase is well-organized and documented with JSDoc comments. All utility functions include comprehensive documentation and examples.
