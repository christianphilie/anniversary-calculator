/**
 * Safe localStorage utilities with error handling
 * Handles cases where localStorage is unavailable (private browsing, quota exceeded, etc.)
 */

/**
 * Safely gets an item from localStorage
 * @param key - The storage key
 * @param defaultValue - Default value if key doesn't exist or storage fails
 * @returns The stored value or default value
 */
export function safeLocalStorageGet(key: string, defaultValue: string): string {
  try {
    const value = localStorage.getItem(key)
    return value ?? defaultValue
  } catch (error) {
    // localStorage might be unavailable (private browsing, quota exceeded, etc.)
    return defaultValue
  }
}

/**
 * Safely sets an item in localStorage
 * @param key - The storage key
 * @param value - The value to store
 * @returns True if successful, false otherwise
 */
export function safeLocalStorageSet(key: string, value: string): boolean {
  try {
    localStorage.setItem(key, value)
    return true
  } catch (error) {
    // localStorage might be unavailable (private browsing, quota exceeded, etc.)
    return false
  }
}

/**
 * Safely removes an item from localStorage
 * @param key - The storage key
 * @returns True if successful, false otherwise
 */
export function safeLocalStorageRemove(key: string): boolean {
  try {
    localStorage.removeItem(key)
    return true
  } catch (error) {
    return false
  }
}
