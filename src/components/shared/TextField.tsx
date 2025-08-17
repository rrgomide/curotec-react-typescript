import React from 'react'
import type { BaseFieldProps } from '../DynamicForm/types'
import { useFormField, useFormContext } from '../DynamicForm/hooks'

export function TextField({
  name,
  label,
  placeholder,
  required,
}: BaseFieldProps) {
  const { field, handleChange, handleBlur } = useFormField(name, '')
  const { validateField, setFieldError } = useFormContext()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    handleChange(value)

    if (field.touched) {
      const error = validateField(name, value)
      if (error) {
        setFieldError(name, error)
      }
    }
  }

  const errorId = `${name}-error`
  const hasError = field.error

  return (
    <div className="mb-6">
      <label
        htmlFor={name}
        className="block mb-2 text-sm font-medium text-gray-700"
      >
        {label}
        {required && (
          <span className="text-red-500 ml-1" aria-label="required">
            *
          </span>
        )}
      </label>
      <input
        id={name}
        name={name}
        type="text"
        value={field.value as string}
        onChange={handleInputChange}
        onBlur={handleBlur}
        placeholder={placeholder}
        required={required}
        aria-invalid={hasError ? 'true' : 'false'}
        aria-describedby={hasError ? errorId : undefined}
        aria-required={required}
        className={`w-full px-3 py-3 text-sm border rounded-md transition-colors duration-200 ease-in-out bg-white focus:outline-none focus:ring-3 focus:ring-blue-500/10 ${
          hasError
            ? 'border-red-500 focus:border-red-500 focus:ring-red-500/10'
            : 'border-gray-300 focus:border-blue-500'
        }`}
      />
      {hasError && (
        <div
          id={errorId}
          className="mt-1 text-xs text-red-500"
          role="alert"
          aria-live="polite"
        >
          {field.error}
        </div>
      )}
    </div>
  )
}
