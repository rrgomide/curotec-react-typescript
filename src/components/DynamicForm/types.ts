import { type ReactNode } from 'react'

export interface FormField<T = string | boolean> {
  name: string
  value: T
  error?: string
  touched: boolean
}

export interface FormState<T = Record<string, string | boolean>> {
  fields: Record<keyof T, FormField<T[keyof T]>>
  isSubmitting: boolean
  isSubmitted: boolean
  submitError?: string
}

export interface FormContextType<T = Record<string, string | boolean>> {
  state: FormState<T>
  setFieldValue: <K extends keyof T>(name: K, value: T[K]) => void
  setFieldError: (name: keyof T, error: string) => void
  setFieldTouched: (name: keyof T) => void
  validateField: <K extends keyof T>(name: K, value: T[K]) => string | undefined
  submitForm: () => Promise<void>
  resetForm: () => void
}

export type FormAction<T = Record<string, string | boolean>> =
  | {
      type: 'SET_FIELD_VALUE'
      payload: { name: keyof T; value: T[keyof T] }
    }
  | { type: 'SET_FIELD_ERROR'; payload: { name: keyof T; error: string } }
  | { type: 'SET_FIELD_TOUCHED'; payload: { name: keyof T } }
  | { type: 'SET_SUBMITTING'; payload: boolean }
  | { type: 'SET_SUBMITTED'; payload: boolean }
  | { type: 'SET_SUBMIT_ERROR'; payload: string }
  | { type: 'RESET_FORM' }

export interface FormProviderProps<T = Record<string, string | boolean>> {
  children: ReactNode
  onSubmit: (values: T) => Promise<void>
  initialValues?: Partial<T>
  validationSchema?: Record<keyof T, (value: T[keyof T]) => string | undefined>
}

export interface BaseFieldProps<T = string> {
  name: string
  label: string
  placeholder?: string
  required?: boolean
}

export interface SelectFieldProps<T = string> extends BaseFieldProps<T> {
  options: Array<{ value: string; label: string }>
}

export interface FormContainerProps {
  children: ReactNode
  className?: string
}

export interface DynamicFormProps<T = Record<string, string | boolean>> {
  onSubmit: (values: T) => Promise<void>
  initialValues?: Partial<T>
  validationSchema?: Record<keyof T, (value: T[keyof T]) => string | undefined>
  children: ReactNode
  className?: string
}
