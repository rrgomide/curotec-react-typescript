import { useState } from 'react'

interface ErrorDemoProps {
  title?: string
}

export default function ErrorDemo({
  title = 'Error Demo Component',
}: ErrorDemoProps) {
  const [shouldThrow, setShouldThrow] = useState(false)
  const [shouldThrowAsync, setShouldThrowAsync] = useState(false)

  if (shouldThrow) {
    throw new Error('This is a simulated error thrown by the component!')
  }

  const handleAsyncError = async () => {
    setShouldThrowAsync(true)
    // Simulate an async error
    await new Promise(resolve => setTimeout(resolve, 100))
    throw new Error('This is a simulated async error!')
  }

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        {title}
      </h3>

      <div className="space-y-4">
        <div>
          <button
            onClick={() => setShouldThrow(true)}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
          >
            Throw Synchronous Error
          </button>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            This will trigger the ErrorBoundary immediately
          </p>
        </div>

        <div>
          <button
            onClick={handleAsyncError}
            className="w-full bg-orange-600 hover:bg-orange-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
          >
            Throw Async Error
          </button>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            This will throw an error after a delay (won't be caught by
            ErrorBoundary)
          </p>
        </div>

        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
            ErrorBoundary Information:
          </h4>
          <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
            <li>• Synchronous errors are caught by ErrorBoundary</li>
            <li>
              • Async errors need to be handled with try/catch or
              useErrorHandler
            </li>
            <li>• ErrorBoundary shows a fallback UI when errors occur</li>
            <li>• In development, error details are shown for debugging</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
