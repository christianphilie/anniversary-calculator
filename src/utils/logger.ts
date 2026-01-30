/**
 * Conditional logging utilities that only log in development mode
 * This prevents console output in production builds
 */

const isDev = import.meta.env.DEV

/**
 * Logs a message to console only in development mode
 */
export function log(...args: unknown[]): void {
  if (isDev) {
    console.log(...args)
  }
}

/**
 * Logs a warning to console only in development mode
 */
export function warn(...args: unknown[]): void {
  if (isDev) {
    console.warn(...args)
  }
}

/**
 * Logs an error to console only in development mode
 * Note: Critical errors might still need to be logged in production
 * Consider using an error tracking service for production
 */
export function logError(...args: unknown[]): void {
  if (isDev) {
    console.error(...args)
  }
  // In production, you might want to send to error tracking service
  // e.g., Sentry, LogRocket, etc.
}
