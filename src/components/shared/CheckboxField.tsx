import React from 'react'
import type { BaseFieldProps } from '../DynamicForm/types'
import { useFormField } from '../DynamicForm/hooks'

export function CheckboxField({ name, label, required }: BaseFieldProps) {
  const { field, handleChange, handleBlur } = useFormField(name, false)

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleChange(e.target.checked)
  }

  const errorId = `${name}-error`
  const hasError = field.error

  return (
    <div className="flex flex-row items-center">
      <label className="flex flex-row items-center cursor-pointer text-sm text-gray-700">
        <input
          id={name}
          name={name}
          type="checkbox"
          checked={field.value as boolean}
          onChange={handleCheckboxChange}
          onBlur={handleBlur}
          required={required}
          aria-invalid={hasError ? 'true' : 'false'}
          aria-describedby={hasError ? errorId : undefined}
          aria-required={required}
          className={`mr-2 mt-0.5 w-4 h-4 transition-colors duration-200 ease-in-out ${
            hasError ? 'accent-red-500' : 'accent-blue-500'
          }`}
        />
        <span className="leading-relaxed">
          {label}
          {required && (
            <span className="text-red-500 ml-1" aria-label="required">
              *
            </span>
          )}
        </span>
      </label>
      {hasError && (
        <div
          id={errorId}
          className="mt-1 ml-2 text-xs text-red-500"
          role="alert"
          aria-live="polite"
        >
          {field.error}
        </div>
      )}
    </div>
  )
}
