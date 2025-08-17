# Error Boundary System

This project includes a comprehensive error handling system with both ErrorBoundary components and hooks for handling errors in React applications.

## Components

### ErrorBoundary

A class-based error boundary component that catches JavaScript errors anywhere in the child component tree and displays a fallback UI.

**Features:**

- Catches synchronous errors in component tree
- Beautiful, responsive fallback UI with dark mode support
- Development mode error details
- Refresh and retry functionality
- Custom fallback UI support
- Error logging and callback support

**Usage:**

```tsx
import ErrorBoundary from './components/ErrorBoundary'

// Basic usage
<ErrorBoundary>
  <YourApp />
</ErrorBoundary>

// With custom fallback
<ErrorBoundary
  fallback={<CustomErrorComponent />}
  onError={(error, errorInfo) => {
    // Log to external service
    console.log('Error caught:', error)
  }}
>
  <YourApp />
</ErrorBoundary>
```

### ErrorDemo

A demo component that shows how the ErrorBoundary works by intentionally throwing errors.

**Usage:**

```tsx
import ErrorDemo from './components/ErrorDemo'
;<ErrorDemo title="Custom Title" />
```

### AsyncErrorDemo

A demo component that shows how to handle async errors using the useErrorHandler hook.

**Usage:**

```tsx
import AsyncErrorDemo from './components/AsyncErrorDemo'
;<AsyncErrorDemo />
```

## Hooks

### useErrorHandler

A custom hook that provides error handling functionality for functional components, especially useful for async operations.

**Features:**

- Manual error handling with `handleError`
- Automatic error wrapping with `wrapAsync`
- Custom error callbacks
- Development mode logging

**Usage:**

```tsx
import { useErrorHandler } from '../hooks/useErrorHandler'

function MyComponent() {
  const { handleError, wrapAsync } = useErrorHandler({
    onError: (error) => {
      // Custom error handling
      console.error('Error occurred:', error.message)
    }
  })

  // Manual error handling
  const handleAsyncOperation = async () => {
    try {
      const result = await someAsyncFunction()
      // Handle success
    } catch (error) {
      handleError(error as Error)
    }
  }

  // Automatic error wrapping
  const safeAsyncFunction = wrapAsync(someAsyncFunction)

  const handleWrappedOperation = async () => {
    const result = await safeAsyncFunction()
    // Errors are automatically handled
  }

  return (
    // Your component JSX
  )
}
```

## Error Types

### Synchronous Errors

- **Caught by:** ErrorBoundary
- **Examples:** Component render errors, prop validation errors
- **Handling:** Automatic via ErrorBoundary

### Asynchronous Errors

- **Caught by:** useErrorHandler hook or try/catch
- **Examples:** API calls, setTimeout, Promise rejections
- **Handling:** Manual with try/catch or automatic with wrapAsync

## Best Practices

1. **Wrap your app root** with ErrorBoundary to catch unexpected errors
2. **Use useErrorHandler** for async operations that might fail
3. **Provide meaningful error messages** to users
4. **Log errors** in development and to external services in production
5. **Test error scenarios** using the demo components
6. **Consider error boundaries** at different levels of your component tree

## Integration

The ErrorBoundary is already integrated into your app at the root level in `main.tsx`:

```tsx
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>
)
```

## Customization

You can customize the error boundary by:

- Providing a custom `fallback` prop
- Adding an `onError` callback for logging
- Styling the default fallback UI
- Creating multiple error boundaries for different parts of your app

## Testing

Use the demo components to test error handling:

1. `ErrorDemo` - Test synchronous error catching
2. `AsyncErrorDemo` - Test async error handling
3. Check browser console for error logs in development mode
