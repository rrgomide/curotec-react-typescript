import { useEffect } from 'react'
import { FilterPanel } from './FilterPanel'
import { StatsPanel } from './StatsPanel'
import { PaginationControls } from './PaginationControls'
import { DataTable } from './DataTable'
import { initializeDataGrid } from './store'

function Header({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
      <p className="mt-2 text-gray-600">{description}</p>
    </div>
  )
}

function OuterWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">{children}</div>
    </div>
  )
}

function InnerWrapper({ children }: { children: React.ReactNode }) {
  return <div className="space-y-6">{children}</div>
}

export function OptimizedDataGrid() {
  useEffect(() => {
    initializeDataGrid()
  }, [])

  return (
    <OuterWrapper>
      <Header
        title="Optimized Data Grid"
        description="A high-performance data grid with filtering, sorting, and pagination using Zustand for state management."
      />

      <InnerWrapper>
        <StatsPanel />
        <FilterPanel />
        <PaginationControls />
        <DataTable />
      </InnerWrapper>
    </OuterWrapper>
  )
}
