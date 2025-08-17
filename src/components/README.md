# Dynamic Form System

A composable form system built with React that demonstrates component composition patterns, React Context API, and custom hooks.

## Features

- **Component Composition**: Reusable form components that can be composed together
- **React Context**: Centralized form state management
- **Custom Hooks**: Shared logic for form fields and validation
- **TypeScript**: Full type safety throughout the system
- **Validation**: Built-in validation with customizable validation schemas
- **Multiple Input Types**: Text, Select, and Checkbox components included

## Architecture

### Core Components

1. **FormProvider**: Context provider that manages form state
2. **DynamicForm**: Main wrapper component that sets up the form context
3. **FormContainer**: Handles form submission and displays status messages
4. **Field Components**: Reusable input components (TextField, SelectField, CheckboxField)

### Custom Hooks

1. **useFormContext**: Access form context and methods
2. **useFormField**: Manage individual field state and validation

### State Management

The form uses a reducer pattern with the following state structure:

```typescript
interface FormState {
  fields: Record<string, FormField>
  isSubmitting: boolean
  isSubmitted: boolean
  submitError?: string
}
```

## Usage

### Basic Example

```tsx
import {
  DynamicForm,
  TextField,
  SelectField,
  CheckboxField,
} from './DynamicForm'

const MyForm = () => {
  const handleSubmit = async (values: Record<string, string | boolean>) => {
    // Handle form submission
    console.info('Form values:', values)
  }

  const validationSchema = {
    name: (value: string | boolean) => {
      if (typeof value !== 'string') return 'Name must be a string'
      if (!value.trim()) return 'Name is required'
      return undefined
    },
    email: (value: string | boolean) => {
      if (typeof value !== 'string') return 'Email must be a string'
      if (!value.trim()) return 'Email is required'
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        return 'Please enter a valid email'
      }
      return undefined
    },
  }

  return (
    <DynamicForm onSubmit={handleSubmit} validationSchema={validationSchema}>
      <TextField
        name="name"
        label="Full Name"
        placeholder="Enter your name"
        required
      />

      <TextField
        name="email"
        label="Email Address"
        placeholder="Enter your email"
        required
      />

      <SelectField
        name="department"
        label="Department"
        options={[
          { value: 'engineering', label: 'Engineering' },
          { value: 'marketing', label: 'Marketing' },
        ]}
        required
      />

      <CheckboxField
        name="terms"
        label="I agree to the terms and conditions"
        required
      />
    </DynamicForm>
  )
}
```

### Advanced Usage with Initial Values

```tsx
const AdvancedForm = () => {
  const initialValues = {
    name: 'John Doe',
    email: 'john@example.com',
    department: 'engineering',
    terms: false,
  }

  return (
    <DynamicForm
      onSubmit={handleSubmit}
      initialValues={initialValues}
      validationSchema={validationSchema}
    >
      {/* Form fields */}
    </DynamicForm>
  )
}
```

## Component Composition Patterns

### 1. Context Provider Pattern

The `FormProvider` wraps the entire form and provides context to all child components:

```tsx
<FormProvider onSubmit={handleSubmit} validationSchema={validationSchema}>
  <FormContainer>{/* Form fields */}</FormContainer>
</FormProvider>
```

### 2. Custom Hook Pattern

Each field component uses the `useFormField` hook to manage its state:

```tsx
const { field, handleChange, handleBlur } = useFormField(name, initialValue)
```

### 3. Compound Component Pattern

The form system allows for flexible composition:

```tsx
<DynamicForm onSubmit={handleSubmit}>
  <TextField name="name" label="Name" />
  <SelectField name="category" label="Category" options={options} />
  <CheckboxField name="agree" label="I agree" />
</DynamicForm>
```

## Validation

### Built-in Validators

```tsx
import { validators } from './DynamicForm'

const validationSchema = {
  name: validators.required,
  email: (value: string | boolean) => {
    const required = validators.required(value)
    if (required) return required
    return validators.email(value as string)
  },
  password: (value: string | boolean) => {
    const required = validators.required(value)
    if (required) return required
    return validators.minLength(8)(value as string)
  },
}
```

### Custom Validators

```tsx
const customValidationSchema = {
  username: (value: string | boolean) => {
    if (typeof value !== 'string') return 'Username must be a string'
    if (value.length < 3) return 'Username must be at least 3 characters'
    if (!/^[a-zA-Z0-9_]+$/.test(value)) {
      return 'Username can only contain letters, numbers, and underscores'
    }
    return undefined
  },
}
```

## Styling

The form system includes CSS classes for styling. Import the CSS file:

```tsx
import './DynamicForm.css'
```

### Available CSS Classes

- `.dynamic-form`: Main form container
- `.form-field`: Individual field wrapper
- `.form-label`: Field labels
- `.form-input`, `.form-select`: Input elements
- `.form-checkbox`: Checkbox input
- `.error-message`: Validation error messages
- `.submit-button`, `.reset-button`: Action buttons
- `.submit-error`, `.submit-success`: Status messages

## Best Practices

1. **Type Safety**: Always provide proper TypeScript types for validation schemas
2. **Error Handling**: Implement proper error handling in the onSubmit function
3. **Accessibility**: Use proper labels and ARIA attributes
4. **Performance**: Use React.memo for field components if needed
5. **Testing**: Test validation logic and form submission separately

## Extending the System

### Adding New Field Types

```tsx
export const TextAreaField: React.FC<BaseFieldProps> = ({
  name,
  label,
  placeholder,
  required,
}) => {
  const { field, handleChange, handleBlur } = useFormField(name, '')

  return (
    <div className="form-field">
      <label htmlFor={name} className="form-label">
        {label}
        {required && <span className="required">*</span>}
      </label>
      <textarea
        id={name}
        value={field.value as string}
        onChange={e => handleChange(e.target.value)}
        onBlur={handleBlur}
        placeholder={placeholder}
        className={`form-textarea ${
          field.error && field.touched ? 'error' : ''
        }`}
      />
      {field.error && field.touched && (
        <div className="error-message">{field.error}</div>
      )}
    </div>
  )
}
```

### Custom Form Actions

```tsx
const CustomFormActions = () => {
  const { state, submitForm, resetForm } = useFormContext()

  return (
    <div className="custom-actions">
      <button onClick={submitForm} disabled={state.isSubmitting}>
        {state.isSubmitting ? 'Saving...' : 'Save Draft'}
      </button>
      <button onClick={resetForm}>Clear Form</button>
    </div>
  )
}
```
