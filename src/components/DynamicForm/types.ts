import { type ReactNode } from 'react'

export interface FormField {
  name: string
  value: string | boolean
  error?: string
  touched: boolean
}

export interface FormState {
  fields: Record<string, FormField>
  isSubmitting: boolean
  isSubmitted: boolean
  submitError?: string
}

export interface FormContextType {
  state: FormState
  setFieldValue: (name: string, value: string | boolean) => void
  setFieldError: (name: string, error: string) => void
  setFieldTouched: (name: string) => void
  validateField: (name: string, value: string | boolean) => string | undefined
  submitForm: () => Promise<void>
  resetForm: () => void
}

export type FormAction =
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

export interface FormProviderProps {
  children: ReactNode
  onSubmit: (values: Record<string, string | boolean>) => Promise<void>
  initialValues?: Record<string, string | boolean>
  validationSchema?: Record<
    string,
    (value: string | boolean) => string | undefined
  >
}

export interface BaseFieldProps {
  name: string
  label: string
  placeholder?: string
  required?: boolean
}

export interface SelectFieldProps extends BaseFieldProps {
  options: Array<{ value: string; label: string }>
}

export interface FormContainerProps {
  children: ReactNode
  className?: string
}

export interface DynamicFormProps {
  onSubmit: (values: Record<string, string | boolean>) => Promise<void>
  initialValues?: Record<string, string | boolean>
  validationSchema?: Record<
    string,
    (value: string | boolean) => string | undefined
  >
  children: ReactNode
  className?: string
}
