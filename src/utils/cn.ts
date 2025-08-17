import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function createBuilder<T>() {
  return function <K extends keyof T>(key: K, value: T[K]) {
    return { [key]: value } as Pick<T, K>
  }
}

export function updateObject<T extends Record<string, unknown>>(
  obj: T,
  updates: Partial<T>
): T {
  return { ...obj, ...updates }
}

export function createEventHandler<T extends Event>(
  handler: (event: T) => void
) {
  return (event: T) => {
    event.preventDefault?.()
    handler(event)
  }
}
