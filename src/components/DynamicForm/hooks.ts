import { useContext, useCallback } from 'react'
import { type FormContextType } from './types'

// This will be imported from the main component file
let FormContext: React.Context<FormContextType | undefined>

export const setFormContext = (
  context: React.Context<FormContextType | undefined>
) => {
  FormContext = context
}

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
