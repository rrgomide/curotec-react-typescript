import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
  type ReactNode,
} from 'react'

interface FormField {
  name: string
  value: string | boolean
  error?: string
  touched: boolean
}

interface FormState {
  fields: Record<string, FormField>
  isSubmitting: boolean
  isSubmitted: boolean
  submitError?: string
}

interface FormContextType {
  state: FormState
  setFieldValue: (name: string, value: string | boolean) => void
  setFieldError: (name: string, error: string) => void
  setFieldTouched: (name: string) => void
  validateField: (name: string, value: string | boolean) => string | undefined
  submitForm: () => Promise<void>
  resetForm: () => void
}

type FormAction =
  | {
      type: 'SET_FIELD_VALUE'
      payload: { name: string; value: string | boolean }
    }
  | { type: 'SET_FIELD_ERROR'; payload: { name: string; error: string } }
  | { type: 'SET_FIELD_TOUCHED'; payload: { name: string } }
  | { type: 'SET_SUBMITTING'; payload: boolean }
  | { type: 'SET_SUBMITTED'; payload: boolean }
  | { type: 'SET_SUBMIT_ERROR'; payload: string }
  | { type: 'RESET_FORM' }

// Form Reducer
const formReducer = (state: FormState, action: FormAction): FormState => {
  switch (action.type) {
    case 'SET_FIELD_VALUE':
      return {
        ...state,
        fields: {
          ...state.fields,
          [action.payload.name]: {
            ...state.fields[action.payload.name],
            name: action.payload.name,
            value: action.payload.value,
            error: undefined,
          },
        },
      }

    case 'SET_FIELD_ERROR':
      return {
        ...state,
        fields: {
          ...state.fields,
          [action.payload.name]: {
            ...state.fields[action.payload.name],
            error: action.payload.error,
          },
        },
      }

    case 'SET_FIELD_TOUCHED':
      return {
        ...state,
        fields: {
          ...state.fields,
          [action.payload.name]: {
            ...state.fields[action.payload.name],
            touched: true,
          },
        },
      }

    case 'SET_SUBMITTING':
      return { ...state, isSubmitting: action.payload }

    case 'SET_SUBMITTED':
      return { ...state, isSubmitted: action.payload }

    case 'SET_SUBMIT_ERROR':
      return { ...state, submitError: action.payload }

    case 'RESET_FORM':
      return {
        fields: {},
        isSubmitting: false,
        isSubmitted: false,
        submitError: undefined,
      }

    default:
      return state
  }
}

const FormContext = createContext<FormContextType | undefined>(undefined)

export const useFormContext = () => {
  const context = useContext(FormContext)
  if (!context) {
    throw new Error('useFormContext must be used within a FormProvider')
  }
  return context
}

// Custom Hook for Field Logic
export const useFormField = (
  name: string,
  initialValue: string | boolean = ''
) => {
  const {
    state,
    setFieldValue,
    setFieldError,
    setFieldTouched,
    validateField,
  } = useFormContext()

  const field = state.fields[name] || {
    name,
    value: initialValue,
    touched: false,
  }

  const handleChange = useCallback(
    (value: string | boolean) => {
      setFieldValue(name, value)
      const error = validateField(name, value)
      if (error) {
        setFieldError(name, error)
      }
    },
    [name, setFieldValue, setFieldError, validateField]
  )

  const handleBlur = useCallback(() => {
    setFieldTouched(name)
    const error = validateField(name, field.value)
    if (error) {
      setFieldError(name, error)
    }
  }, [name, field.value, setFieldTouched, setFieldError, validateField])

  return {
    field,
    handleChange,
    handleBlur,
  }
}

export const validators = {
  required: (value: string | boolean): string | undefined => {
    if (typeof value === 'string' && !value.trim()) {
      return 'This field is required'
    }
    if (typeof value === 'boolean' && !value) {
      return 'This field is required'
    }
    return undefined
  },

  email: (value: string): string | undefined => {
    if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return 'Please enter a valid email address'
    }
    return undefined
  },

  minLength:
    (min: number) =>
    (value: string): string | undefined => {
      if (value && value.length < min) {
        return `Must be at least ${min} characters`
      }
      return undefined
    },
}

interface FormProviderProps {
  children: ReactNode
  onSubmit: (values: Record<string, string | boolean>) => Promise<void>
  initialValues?: Record<string, string | boolean>
  validationSchema?: Record<
    string,
    (value: string | boolean) => string | undefined
  >
}

export const FormProvider: React.FC<FormProviderProps> = ({
  children,
  onSubmit,
  initialValues = {},
  validationSchema = {},
}) => {
  const [state, dispatch] = useReducer(formReducer, {
    fields: Object.keys(initialValues).reduce(
      (acc, key) => ({
        ...acc,
        [key]: {
          name: key,
          value: initialValues[key],
          touched: false,
        },
      }),
      {}
    ),
    isSubmitting: false,
    isSubmitted: false,
  })

  const setFieldValue = useCallback((name: string, value: string | boolean) => {
    dispatch({ type: 'SET_FIELD_VALUE', payload: { name, value } })
  }, [])

  const setFieldError = useCallback((name: string, error: string) => {
    dispatch({ type: 'SET_FIELD_ERROR', payload: { name, error } })
  }, [])

  const setFieldTouched = useCallback((name: string) => {
    dispatch({ type: 'SET_FIELD_TOUCHED', payload: { name } })
  }, [])

  const validateField = useCallback(
    (name: string, value: string | boolean): string | undefined => {
      const validator = validationSchema[name]
      if (validator) {
        return validator(value)
      }
      return undefined
    },
    [validationSchema]
  )

  const submitForm = useCallback(async () => {
    dispatch({ type: 'SET_SUBMITTING', payload: true })
    dispatch({ type: 'SET_SUBMIT_ERROR', payload: '' })

    try {
      // Validate all fields
      const values: Record<string, string | boolean> = {}
      let hasErrors = false

      Object.keys(state.fields).forEach(name => {
        const field = state.fields[name]
        values[name] = field.value

        const error = validateField(name, field.value)
        if (error) {
          setFieldError(name, error)
          hasErrors = true
        }
      })

      if (hasErrors) {
        dispatch({ type: 'SET_SUBMITTING', payload: false })
        return
      }

      await onSubmit(values)
      dispatch({ type: 'SET_SUBMITTED', payload: true })
    } catch (error) {
      dispatch({
        type: 'SET_SUBMIT_ERROR',
        payload: error instanceof Error ? error.message : 'Submission failed',
      })
    } finally {
      dispatch({ type: 'SET_SUBMITTING', payload: false })
    }
  }, [state.fields, validateField, setFieldError, onSubmit])

  const resetForm = useCallback(() => {
    dispatch({ type: 'RESET_FORM' })
  }, [])

  const contextValue: FormContextType = {
    state,
    setFieldValue,
    setFieldError,
    setFieldTouched,
    validateField,
    submitForm,
    resetForm,
  }

  return (
    <FormContext.Provider value={contextValue}>{children}</FormContext.Provider>
  )
}

interface BaseFieldProps {
  name: string
  label: string
  placeholder?: string
  required?: boolean
}

export const TextField: React.FC<BaseFieldProps> = ({
  name,
  label,
  placeholder,
  required,
}) => {
  const { field, handleChange, handleBlur } = useFormField(name, '')
  const { validateField, setFieldError } = useFormContext()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    handleChange(value)

    // Validate on change if field is touched
    if (field.touched) {
      const error = validateField(name, value)
      if (error) {
        setFieldError(name, error)
      }
    }
  }

  return (
    <div className="mb-6">
      <label
        htmlFor={name}
        className="block mb-2 text-sm font-medium text-gray-700"
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        id={name}
        type="text"
        value={field.value as string}
        onChange={handleInputChange}
        onBlur={handleBlur}
        placeholder={placeholder}
        className={`w-full px-3 py-3 text-sm border rounded-md transition-colors duration-200 ease-in-out bg-white focus:outline-none focus:ring-3 focus:ring-blue-500/10 ${
          field.error && field.touched
            ? 'border-red-500 focus:border-red-500 focus:ring-red-500/10'
            : 'border-gray-300 focus:border-blue-500'
        }`}
      />
      {field.error && field.touched && (
        <div className="mt-1 text-xs text-red-500">{field.error}</div>
      )}
    </div>
  )
}

interface SelectFieldProps extends BaseFieldProps {
  options: Array<{ value: string; label: string }>
}

export const SelectField: React.FC<SelectFieldProps> = ({
  name,
  label,
  options,
  required,
}) => {
  const { field, handleChange, handleBlur } = useFormField(name, '')

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    handleChange(e.target.value)
  }

  return (
    <div className="mb-6">
      <label
        htmlFor={name}
        className="block mb-2 text-sm font-medium text-gray-700"
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <select
        id={name}
        value={field.value as string}
        onChange={handleSelectChange}
        onBlur={handleBlur}
        className={`w-full px-3 py-3 text-sm border rounded-md transition-colors duration-200 ease-in-out bg-white focus:outline-none focus:ring-3
           focus:ring-blue-500/10 ${
             field.error && field.touched
               ? 'border-red-500 focus:border-red-500 focus:ring-red-500/10'
               : 'border-gray-300 focus:border-blue-500'
           }`}
      >
        <option value="">Select an option</option>
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {field.error && field.touched && (
        <div className="mt-1 text-xs text-red-500">{field.error}</div>
      )}
    </div>
  )
}

export const CheckboxField: React.FC<BaseFieldProps> = ({
  name,
  label,
  required,
}) => {
  const { field, handleChange, handleBlur } = useFormField(name, false)

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleChange(e.target.checked)
  }

  return (
    <div className="flex flex-row items-center">
      <label className="flex flex-row items-center cursor-pointer text-sm text-gray-700">
        <input
          type="checkbox"
          checked={field.value as boolean}
          onChange={handleCheckboxChange}
          onBlur={handleBlur}
          className={`mr-2 mt-0.5 w-4 h-4 transition-colors duration-200 ease-in-out ${
            field.error && field.touched ? 'accent-red-500' : 'accent-blue-500'
          }`}
        />
        <span className="leading-relaxed">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </span>
      </label>
      {field.error && field.touched && (
        <div className="mt-1 text-xs text-red-500">{field.error}</div>
      )}
    </div>
  )
}

// Form Container Component
interface FormContainerProps {
  children: ReactNode
  className?: string
}

export const FormContainer: React.FC<FormContainerProps> = ({
  children,
  className = '',
}) => {
  const { state, submitForm, resetForm } = useFormContext()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    submitForm()
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`max-w-2xl mx-auto p-8 bg-white rounded-lg shadow-lg ${className}`}
    >
      {children}

      <div className="flex gap-4 mt-8 pt-6 border-t border-gray-200 sm:flex-col">
        <button
          type="submit"
          disabled={state.isSubmitting}
          className="flex-1 px-6 py-3 text-sm font-medium text-white bg-blue-500 border-none rounded-md cursor-pointer transition-colors duration-200 ease-in-out hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed sm:w-full"
        >
          {state.isSubmitting ? 'Submitting...' : 'Submit'}
        </button>
        <button
          type="button"
          onClick={resetForm}
          className="px-6 py-3 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md cursor-pointer transition-colors duration-200 ease-in-out hover:bg-gray-200 sm:w-full"
        >
          Reset
        </button>
      </div>

      {state.submitError && (
        <div className="mt-4 p-3 text-sm bg-red-50 text-red-700 border border-red-200 rounded-md">
          {state.submitError}
        </div>
      )}

      {state.isSubmitted && (
        <div className="mt-4 p-3 text-sm bg-green-50 text-green-700 border border-green-200 rounded-md">
          Form submitted successfully!
        </div>
      )}
    </form>
  )
}

// Main DynamicForm Component
interface DynamicFormProps {
  onSubmit: (values: Record<string, string | boolean>) => Promise<void>
  initialValues?: Record<string, string | boolean>
  validationSchema?: Record<
    string,
    (value: string | boolean) => string | undefined
  >
  children: ReactNode
  className?: string
}

export const DynamicForm: React.FC<DynamicFormProps> = ({
  onSubmit,
  initialValues,
  validationSchema,
  children,
  className,
}) => {
  return (
    <FormProvider
      onSubmit={onSubmit}
      initialValues={initialValues}
      validationSchema={validationSchema}
    >
      <FormContainer className={className}>{children}</FormContainer>
    </FormProvider>
  )
}

// Example usage component
export const ExampleForm: React.FC = () => {
  const handleSubmit = async (values: Record<string, string | boolean>) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    console.log('Form submitted with values:', values)
  }

  const validationSchema = {
    name: (value: string | boolean) => {
      if (typeof value !== 'string') return 'Name must be a string'
      const required = validators.required(value)
      if (required) return required
      return validators.minLength(2)(value)
    },
    email: (value: string | boolean) => {
      if (typeof value !== 'string') return 'Email must be a string'
      const required = validators.required(value)
      if (required) return required
      return validators.email(value)
    },
    department: validators.required,
    terms: validators.required,
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-8">
      <DynamicForm
        onSubmit={handleSubmit}
        validationSchema={validationSchema}
        className="bg-white/95 backdrop-blur-sm"
      >
        <TextField
          name="name"
          label="Full Name"
          placeholder="Enter your full name"
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
            { value: 'sales', label: 'Sales' },
            { value: 'hr', label: 'Human Resources' },
          ]}
          required
        />

        <CheckboxField
          name="terms"
          label="I agree to the terms and conditions"
          required
        />
      </DynamicForm>
    </div>
  )
}

export default DynamicForm
