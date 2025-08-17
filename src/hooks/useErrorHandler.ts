import { useCallback } from 'react'

interface ErrorHandlerOptions<TError extends Error = Error> {
  onError?: (error: TError, errorInfo?: unknown) => void
  fallbackMessage?: string
}

export function useErrorHandler<TError extends Error = Error>(
  options: ErrorHandlerOptions<TError> = {}
) {
  const handleError = useCallback(
    (error: TError, errorInfo?: unknown) => {
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
    <TArgs extends unknown[], TReturn>(
      asyncFn: (...args: TArgs) => Promise<TReturn>
    ) => {
      return async (...args: TArgs): Promise<TReturn | undefined> => {
        try {
          return await asyncFn(...args)
        } catch (error) {
          handleError(error as TError)
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
