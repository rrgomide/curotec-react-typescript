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

      options.onError?.(error, errorInfo)
    },
    [options]
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
