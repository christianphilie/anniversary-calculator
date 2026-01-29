# Jubiläums-Finder (Anniversary Finder) v10

This project is a web-based "Jubiläums-Finder" (Anniversary Finder) that allows users to calculate and explore special date and time milestones based on a given start date. These milestones can include various units like years, months, weeks, days, hours, minutes, and seconds, and can be filtered by different numerical patterns such as rounded multiples or repdigits. The application provides functionality to export selected milestones into an .ics calendar file.

## Features

*   **Customizable Start Date & Time:** Define any past or present date and an optional time as your starting point.
*   **Year Range Selection:** Select specific "Jahre von" (from year) and "Jahre bis" (to year) to calculate milestones within a targeted time window.
*   **Multiple Units:** Calculate milestones in years, months, weeks, days, hours, minutes, and seconds.
*   **Pattern-Based Milestone Generation:**
    *   **Rounded Multiples:** Find milestones like 10, 100, 500, 1,000, 10,000, etc.
    *   **Repdigits (Schnapszahlen):** Identify milestones such as 11, 222, 3,333, etc.
*   **Real-time Updates:** Automatic recalculation as you modify inputs, with optimized performance for large date ranges.
*   **ICS Calendar Export:** Download selected milestones as an `.ics` file, compatible with most calendar applications.
*   **Theming:** Switch between light, dark, or system-preferred color schemes.
*   **URL Persistence:** Share or bookmark your specific calculations as the application state is reflected in the URL.

## How to Use

1.  **Development:** Run `npm run dev` and open the URL shown in the terminal (usually `http://localhost:3000`)
2.  **Production:** Run `npm run build` and serve the `dist/` folder with any static file server
2.  **Input Details:**
    *   **Titel (optional):** Provide a descriptive title for your event (e.g., "Kennenlernen", "Geburt", "Hochzeit").
    *   **Datum:** Select the significant start date.
    *   **Uhrzeit (optional):** Enter a specific time if relevant.
3.  **Select Units:** Check the boxes for the units you want to calculate milestones for (Jahre, Monate, Wochen, Tage, Stunden, Minuten, Sekunden).
4.  **Choose Patterns:** Select whether you want to include "Runde Vielfache" (Rounded Multiples) and/or "Schnapszahlen" (Repdigits).
5.  **Set Year Range:**
    *   **Jahre von:** Select the starting year for milestone calculation.
    *   **Jahre bis:** Select the ending year for milestone calculation.
6.  **View Results:**
    *   The results will appear automatically as "Meilensteine" (Milestones).
    *   Results update in real-time as you modify any inputs.
7.  **Export to Calendar:**
    *   Select the desired milestones by checking the checkboxes next to them.
    *   Click "📅 Kalenderdatei (.ics) herunterladen" to download an `.ics` file containing your selected events.

## Development

The project is built with **Vue 3**, **TypeScript**, and **Vite** for a modern, maintainable codebase.

### Tech Stack

*   **Vue 3** - Progressive JavaScript framework with Composition API
*   **TypeScript** - Type-safe JavaScript for better developer experience
*   **Vite** - Fast build tool and development server
*   **CSS Variables** - Theming system supporting light and dark modes

### Project Structure

```
src/
├── components/          # Vue components
│   ├── AppHeader.vue
│   ├── InputPanel.vue
│   ├── ResultsPanel.vue
│   ├── ThemeSwitch.vue
│   ├── YearSeparator.vue
│   └── MilestoneItem.vue
├── composables/         # Vue composables (reusable logic)
│   ├── useAppState.ts   # Application state management
│   ├── useTheme.ts      # Theme management
│   └── useUrlState.ts   # URL state persistence
├── utils/               # Utility functions
│   ├── date.ts          # Date calculations
│   ├── patterns.ts      # Pattern matching logic
│   ├── i18n.ts          # Internationalization
│   ├── ics.ts           # ICS file generation
│   └── compute.ts       # Milestone computation
├── types/               # TypeScript type definitions
│   └── index.ts
├── styles/              # CSS styles
│   └── main.css
├── App.vue              # Root component
└── main.ts              # Application entry point
```

### Getting Started

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

### Key Features

*   **Component-Based Architecture:** Modular Vue components for better maintainability
*   **Type Safety:** TypeScript ensures type correctness throughout the codebase
*   **Composables:** Reusable logic with Vue Composition API
*   **Hot Module Replacement:** Instant updates during development with Vite
*   **Optimized Builds:** Production builds are optimized and minified

### Code Organization

*   **Components:** UI components organized by feature
*   **Composables:** Shared reactive logic (state, theme, URL)
*   **Utils:** Pure functions for calculations and transformations
*   **Types:** Centralized TypeScript type definitions
*   **Styles:** Global CSS with CSS variables for theming

Feel free to explore the `src/` directory to understand the implementation details.
