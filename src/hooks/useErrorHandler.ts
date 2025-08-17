import { useCallback } from 'react'

interface ErrorHandlerOptions {
  onError?: (error: Error, errorInfo?: any) => void
  fallbackMessage?: string
}

export function useErrorHandler(options: ErrorHandlerOptions = {}) {
  const handleError = useCallback(
    (error: Error, errorInfo?: any) => {
      // Log error in development
      if (import.meta.env.DEV) {
        console.error('Error caught by useErrorHandler:', error, errorInfo)
      }

      // Call the onError callback if provided
      options.onError?.(error, errorInfo)

      // You could also send to an error reporting service here
      // Example: Sentry.captureException(error)
    },
    [options.onError]
  )

  const wrapAsync = useCallback(
    <T extends any[], R>(asyncFn: (...args: T) => Promise<R>) => {
      return async (...args: T): Promise<R | undefined> => {
        try {
          return await asyncFn(...args)
        } catch (error) {
          handleError(error as Error)
          return undefined
        }
      }
    },
    [handleError]
  )

  return {
    handleError,
    wrapAsync,
  }
}

export default useErrorHandler
