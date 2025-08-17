import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { OptimizedDataGrid } from './index'
import { initializeDataGrid } from './store'

// Mock the store initialization
vi.mock('./store', () => ({
  initializeDataGrid: vi.fn(),
}))

// Mock child components to isolate OptimizedDataGrid testing
vi.mock('./FilterPanel', () => ({
  FilterPanel: () => <div data-testid="filter-panel">Filter Panel</div>,
}))

vi.mock('./StatsPanel', () => ({
  StatsPanel: () => <div data-testid="stats-panel">Stats Panel</div>,
}))

vi.mock('./PaginationControls', () => ({
  PaginationControls: () => (
    <div data-testid="pagination-controls">Pagination Controls</div>
  ),
}))

vi.mock('./DataTable', () => ({
  DataTable: () => <div data-testid="data-table">Data Table</div>,
}))

describe('OptimizedDataGrid', () => {
  const mockInitializeDataGrid = vi.mocked(initializeDataGrid)

  beforeEach(() => {
    mockInitializeDataGrid.mockClear()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('renders the component with correct title and description', () => {
    render(<OptimizedDataGrid />)

    expect(screen.getByText('Optimized Data Grid')).toBeInTheDocument()
    expect(
      screen.getByText(
        'A high-performance data grid with filtering, sorting, and pagination using Zustand for state management.'
      )
    ).toBeInTheDocument()
  })

  it('renders all child components', () => {
    render(<OptimizedDataGrid />)

    expect(screen.getByTestId('stats-panel')).toBeInTheDocument()
    expect(screen.getByTestId('filter-panel')).toBeInTheDocument()
    expect(screen.getByTestId('pagination-controls')).toBeInTheDocument()
    expect(screen.getByTestId('data-table')).toBeInTheDocument()
  })

  it('calls initializeDataGrid on mount', () => {
    render(<OptimizedDataGrid />)

    expect(mockInitializeDataGrid).toHaveBeenCalledTimes(1)
  })

  it('renders with correct layout structure', () => {
    render(<OptimizedDataGrid />)

    // Check for the outer wrapper with correct classes
    const outerWrapper = screen
      .getByText('Optimized Data Grid')
      .closest('.min-h-screen')
    expect(outerWrapper).toBeInTheDocument()
    expect(outerWrapper).toHaveClass('bg-gray-50', 'py-8')

    // Check for the inner wrapper with correct classes
    const innerWrapper = screen.getByTestId('stats-panel').closest('.space-y-6')
    expect(innerWrapper).toBeInTheDocument()
  })

  it('renders header with correct styling', () => {
    render(<OptimizedDataGrid />)

    const title = screen.getByText('Optimized Data Grid')
    expect(title).toHaveClass('text-3xl', 'font-bold', 'text-gray-900')

    const description = screen.getByText(
      'A high-performance data grid with filtering, sorting, and pagination using Zustand for state management.'
    )
    expect(description).toHaveClass('text-gray-600')
  })

  it('renders child components in correct order', () => {
    render(<OptimizedDataGrid />)

    const innerWrapper = screen.getByTestId('stats-panel').closest('.space-y-6')
    const children = innerWrapper?.children

    if (children) {
      expect(children[0]).toHaveTextContent('Stats Panel')
      expect(children[1]).toHaveTextContent('Filter Panel')
      expect(children[2]).toHaveTextContent('Pagination Controls')
      expect(children[3]).toHaveTextContent('Data Table')
    }
  })

  it('has proper container constraints', () => {
    render(<OptimizedDataGrid />)

    const container = screen
      .getByText('Optimized Data Grid')
      .closest('.max-w-7xl')
    expect(container).toBeInTheDocument()
    expect(container).toHaveClass('mx-auto', 'px-4', 'sm:px-6', 'lg:px-8')
  })

  it('maintains proper spacing between header and content', () => {
    render(<OptimizedDataGrid />)

    const header = screen.getByText('Optimized Data Grid').closest('.mb-8')
    expect(header).toBeInTheDocument()
  })

  it('renders with responsive design classes', () => {
    render(<OptimizedDataGrid />)

    const container = screen
      .getByText('Optimized Data Grid')
      .closest('.max-w-7xl')
    expect(container).toHaveClass('px-4', 'sm:px-6', 'lg:px-8')
  })

  it('initializes data grid only once on mount', () => {
    const { rerender } = render(<OptimizedDataGrid />)

    expect(mockInitializeDataGrid).toHaveBeenCalledTimes(1)

    // Re-render the component
    rerender(<OptimizedDataGrid />)

    // Should still only be called once due to useEffect with empty dependency array
    expect(mockInitializeDataGrid).toHaveBeenCalledTimes(1)
  })

  it('renders with full viewport height', () => {
    render(<OptimizedDataGrid />)

    const outerWrapper = screen
      .getByText('Optimized Data Grid')
      .closest('.min-h-screen')
    expect(outerWrapper).toBeInTheDocument()
  })

  it('provides proper spacing between child components', () => {
    render(<OptimizedDataGrid />)

    const innerWrapper = screen.getByTestId('stats-panel').closest('.space-y-6')
    expect(innerWrapper).toBeInTheDocument()
  })
})
