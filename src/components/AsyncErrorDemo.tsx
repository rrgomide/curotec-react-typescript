import { useState } from 'react'
import { useErrorHandler } from '../hooks/useErrorHandler'

export default function AsyncErrorDemo() {
  const [result, setResult] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)

  const { handleError, wrapAsync } = useErrorHandler({
    onError: error => {
      console.log('Custom error handler called:', error.message)
    },
  })

  const fetchData = async (shouldFail: boolean) => {
    await new Promise(resolve => setTimeout(resolve, 1000))

    if (shouldFail) {
      throw new Error('Failed to fetch data from server')
    }

    return 'Data fetched successfully!'
  }

  const safeFetchData = wrapAsync(fetchData)

  const handleSuccess = async () => {
    setIsLoading(true)
    setResult('')

    try {
      const data = await fetchData(false)
      setResult(data)
    } catch (error) {
      handleError(error as Error)
      setResult('Error occurred (handled manually)')
    } finally {
      setIsLoading(false)
    }
  }

  const handleFailure = async () => {
    setIsLoading(true)
    setResult('')

    try {
      const data = await fetchData(true)
      setResult(data)
    } catch (error) {
      handleError(error as Error)
      setResult('Error occurred (handled manually)')
    } finally {
      setIsLoading(false)
    }
  }

  const handleWrappedSuccess = async () => {
    setIsLoading(true)
    setResult('')

    const data = await safeFetchData(false)
    setResult(data || 'No data returned')
    setIsLoading(false)
  }

  const handleWrappedFailure = async () => {
    setIsLoading(true)
    setResult('')

    const data = await safeFetchData(true)
    setResult(data || 'Error handled by wrapper')
    setIsLoading(false)
  }

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Async Error Handling Demo
      </h3>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">
              Manual Error Handling
            </h4>
            <div className="space-y-2">
              <button
                onClick={handleSuccess}
                disabled={isLoading}
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
              >
                {isLoading ? 'Loading...' : 'Fetch Success'}
              </button>
              <button
                onClick={handleFailure}
                disabled={isLoading}
                className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
              >
                {isLoading ? 'Loading...' : 'Fetch Failure'}
              </button>
            </div>
          </div>

          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">
              Wrapped Error Handling
            </h4>
            <div className="space-y-2">
              <button
                onClick={handleWrappedSuccess}
                disabled={isLoading}
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
              >
                {isLoading ? 'Loading...' : 'Wrapped Success'}
              </button>
              <button
                onClick={handleWrappedFailure}
                disabled={isLoading}
                className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
              >
                {isLoading ? 'Loading...' : 'Wrapped Failure'}
              </button>
            </div>
          </div>
        </div>

        {result && (
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">
              Result:
            </h4>
            <p className="text-gray-700 dark:text-gray-300">{result}</p>
          </div>
        )}

        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
            Async Error Handling:
          </h4>
          <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
            <li>• Manual: Use try/catch with handleError</li>
            <li>• Wrapped: Use wrapAsync for automatic error handling</li>
            <li>• Both methods log errors and call custom handlers</li>
            <li>• Errors are handled gracefully without crashing the app</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
