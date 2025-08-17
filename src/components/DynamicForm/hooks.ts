import { useContext, useCallback } from 'react'
import { type FormContextType } from './types'

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

export const useFormField = <T = string | boolean>(
  name: string,
  initialValue: T = '' as T
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
    (value: T) => {
      setFieldValue(name as any, value as any)
      const error = validateField(name as any, value as any)
      if (error) {
        setFieldError(name as any, error)
      }
    },
    [name, setFieldValue, setFieldError, validateField]
  )

  const handleBlur = useCallback(() => {
    setFieldTouched(name as any)
    const error = validateField(name as any, field.value as any)
    if (error) {
      setFieldError(name as any, error)
    }
  }, [name, field.value, setFieldTouched, setFieldError, validateField])

  return {
    field,
    handleChange,
    handleBlur,
  }
}

// Generic hook for creating type-safe form validators
export function useFormValidator<T extends Record<string, unknown>>() {
  return useCallback(
    <K extends keyof T>(
      schema: Record<K, (value: T[K]) => string | undefined>
    ) => {
      return schema
    },
    []
  )
}

// Generic hook for creating type-safe form state
export function useFormState<T extends Record<string, unknown>>(
  initialValues: Partial<T> = {}
) {
  return useCallback(() => {
    return Object.keys(initialValues).reduce(
      (acc, key) => ({
        ...acc,
        [key]: {
          name: key,
          value: initialValues[key as keyof T],
          touched: false,
        },
      }),
      {} as Record<
        keyof T,
        { name: string; value: T[keyof T]; touched: boolean }
      >
    )
  }, [initialValues])
}
