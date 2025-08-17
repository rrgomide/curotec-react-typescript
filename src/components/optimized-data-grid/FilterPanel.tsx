import React, { useCallback, useMemo } from 'react'
import { useDataGridStore } from './store'

const departments = [
  'Engineering',
  'Marketing',
  'Sales',
  'HR',
  'Finance',
  'Operations',
]
const statuses = ['active', 'inactive', 'pending']

export const FilterPanel: React.FC = React.memo(() => {
  const { filterConfig, setFilterConfig, resetFilters } = useDataGridStore()

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFilterConfig({ search: e.target.value })
    },
    [setFilterConfig]
  )

  const handleDepartmentChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setFilterConfig({ department: e.target.value })
    },
    [setFilterConfig]
  )

  const handleStatusChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setFilterConfig({ status: e.target.value })
    },
    [setFilterConfig]
  )

  const handleMinSalaryChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFilterConfig({ minSalary: Number(e.target.value) || 0 })
    },
    [setFilterConfig]
  )

  const handleMaxSalaryChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFilterConfig({ maxSalary: Number(e.target.value) || 200000 })
    },
    [setFilterConfig]
  )

  const handleReset = useCallback(() => {
    resetFilters()
  }, [resetFilters])

  const hasActiveFilters = useMemo(() => {
    return (
      filterConfig.search ||
      filterConfig.department ||
      filterConfig.status ||
      filterConfig.minSalary > 0 ||
      filterConfig.maxSalary < 200000
    )
  }, [filterConfig])

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        {hasActiveFilters && (
          <button
            onClick={handleReset}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            Clear All
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {/* Search */}
        <div className="lg:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Search
          </label>
          <input
            type="text"
            value={filterConfig.search}
            onChange={handleSearchChange}
            placeholder="Search by name, email, or department..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Department */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Department
          </label>
          <select
            value={filterConfig.department}
            onChange={handleDepartmentChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Departments</option>
            {departments.map(dept => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            value={filterConfig.status}
            onChange={handleStatusChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Statuses</option>
            {statuses.map(status => (
              <option key={status} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Min Salary */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Min Salary
          </label>
          <input
            type="number"
            value={filterConfig.minSalary || ''}
            onChange={handleMinSalaryChange}
            placeholder="0"
            min="0"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Max Salary */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Max Salary
          </label>
          <input
            type="number"
            value={
              filterConfig.maxSalary === 200000 ? '' : filterConfig.maxSalary
            }
            onChange={handleMaxSalaryChange}
            placeholder="200000"
            min="0"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>
    </div>
  )
})

FilterPanel.displayName = 'FilterPanel'
