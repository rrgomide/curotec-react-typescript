import { useEffect } from 'react'
import { FilterPanel } from './FilterPanel'
import { StatsPanel } from './StatsPanel'
import { PaginationControls } from './PaginationControls'
import { DataTable } from './DataTable'
import { initializeDataGrid } from './store'

export function OptimizedDataGrid() {
  useEffect(() => {
    initializeDataGrid()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Optimized Data Grid
          </h1>
          <p className="mt-2 text-gray-600">
            A high-performance data grid with filtering, sorting, and pagination
            using Zustand for state management.
          </p>
        </div>

        <div className="space-y-6">
          <StatsPanel />
          <FilterPanel />
          <PaginationControls />
          <DataTable />
        </div>
      </div>
    </div>
  )
}
