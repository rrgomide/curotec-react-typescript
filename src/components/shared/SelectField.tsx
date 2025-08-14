import React from 'react'
import type { SelectFieldProps } from '../DynamicForm/types'
import { useFormField } from '../DynamicForm/hooks'

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
