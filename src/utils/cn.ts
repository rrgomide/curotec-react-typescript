import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Generic utility function for creating type-safe object builders
export function createBuilder<T>() {
  return function <K extends keyof T>(key: K, value: T[K]) {
    return { [key]: value } as Pick<T, K>
  }
}

// Generic utility for type-safe partial updates
export function updateObject<T extends Record<string, unknown>>(
  obj: T,
  updates: Partial<T>
): T {
  return { ...obj, ...updates }
}

// Generic utility for creating type-safe event handlers
export function createEventHandler<T extends Event>(
  handler: (event: T) => void
) {
  return (event: T) => {
    event.preventDefault?.()
    handler(event)
  }
}
