import React, { createContext, useCallback, useReducer } from 'react'
import { setFormContext, useFormContext } from './hooks'
import { formReducer } from './reducer'
import type {
  DynamicFormProps,
  FormContainerProps,
  FormContextType,
  FormProviderProps,
} from './types'

const FormContext = createContext<FormContextType | undefined>(undefined)
setFormContext(FormContext)

export function FormProvider({
  children,
  onSubmit,
  initialValues = {},
  validationSchema = {},
}: FormProviderProps) {
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

export function FormContainer({
  children,
  className = '',
}: FormContainerProps) {
  const { state, submitForm, resetForm } = useFormContext()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    submitForm()
  }

  const showSubmitSuccessMessage =
    state.isSubmitted && !state.submitError && !state.isSubmitting

  return (
    <form
      role="form"
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

      {state.isSubmitting ? null : state.submitError ? (
        <div className="mt-4 p-3 text-sm bg-red-50 text-red-700 border border-red-200 rounded-md">
          {state.submitError}
        </div>
      ) : showSubmitSuccessMessage ? (
        <div className="mt-4 p-3 text-sm bg-green-50 text-green-700 border border-green-200 rounded-md">
          Form submitted successfully!
        </div>
      ) : null}
    </form>
  )
}

export function DynamicForm({
  onSubmit,
  initialValues,
  validationSchema,
  children,
  className,
}: DynamicFormProps) {
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
