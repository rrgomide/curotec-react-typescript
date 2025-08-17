import React from 'react'
import type { BaseFieldProps } from '../DynamicForm/types'
import { useFormField } from '../DynamicForm/hooks'

export function CheckboxField({ name, label, required }: BaseFieldProps) {
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
