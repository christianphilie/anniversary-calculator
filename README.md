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

1.  **Open `index.html`:** Simply open the `anniversary-milestones/index.html` file in your web browser.
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

The project is built with plain HTML, CSS, and JavaScript, making it easy to understand and modify.

*   `index.html`: Contains the entire application, including structure, styling, and logic.

### Styling

The styling is defined using CSS variables for theming, supporting light and dark modes.

### JavaScript

The JavaScript handles:

*   **DOM Manipulation:** Interacting with form elements, year range selects, and result list.
*   **Date Calculations:** Custom functions for accurate date and time arithmetic with proper month/year clamping.
*   **Pattern Matching:** Logic to identify specific numerical patterns for milestones (rounded multiples and repdigits).
*   **Performance Optimization:** Efficient milestone calculation within specified year ranges (up to 300 years from start date).
*   **State Management:** Managing the application's state, including year ranges, selected milestones, and form inputs.
*   **URL Parameters:** Encoding and decoding complete application state from the URL for sharing and bookmarking.
*   **ICS File Generation:** Creating valid `.ics` files for calendar export with proper timezone handling.

Feel free to explore the `index.html` file to understand the implementation details.
