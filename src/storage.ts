/**
 * A thin, typed wrapper around `localStorage`.
 *
 * Values are serialised as JSON on the way in and parsed on the way out, so you
 * store and read objects rather than strings. Outside the browser — during
 * server-side rendering, or in a test runner without a DOM — the same calls
 * fall through to an in-memory store instead of throwing on a missing
 * `localStorage`.
 *
 * The in-memory fallback lives for the duration of the process and is not
 * shared between requests: treat it as a way to keep code paths uniform, not as
 * a server-side persistence layer.
 */

function isBrowser(): boolean {
  return typeof window !== "undefined"
}

/** Fallback store used whenever `localStorage` is out of reach. */

const localStorageData = {} as Record<string, unknown>

/**
 * Reads a value.
 *
 * Returns `null` when the key was never set, and `undefined` when the value
 * stored for it was itself `undefined`.
 */
export function getInStorage<T>(key: string): undefined | T | null {
  if (!isBrowser()) {
    return localStorageData[key] as T
  }

  const item = localStorage.getItem(key)

  if (item === "undefined") {
    return undefined
  }
  if (item === null) {
    return null
  }

  return JSON.parse(item) as T
}

/** Writes a value, serialised as JSON. */
export function setInStorage(key: string, data: unknown): void {
  if (!isBrowser()) {
    localStorageData[key] = data
    return
  }

  localStorage.setItem(key, JSON.stringify(data))
}

/** Removes a key entirely. */
export function removeInStorage(key: string): void {
  if (!isBrowser()) {
    delete localStorageData[key]
    return
  }

  localStorage.removeItem(key)
}
