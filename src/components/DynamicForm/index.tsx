import React, { createContext, useReducer, useCallback } from 'react'
import type {
  FormContextType,
  FormProviderProps,
  FormContainerProps,
  DynamicFormProps,
} from './types'
import { formReducer } from './reducer'
import { setFormContext, useFormContext } from './hooks'
import { validators } from './validators'
import { TextField, SelectField, CheckboxField } from '../shared'

const FormContext = createContext<FormContextType | undefined>(undefined)
setFormContext(FormContext)

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

// Form Container Component

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

// Re-export components from shared folder
export { TextField, SelectField, CheckboxField }

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
