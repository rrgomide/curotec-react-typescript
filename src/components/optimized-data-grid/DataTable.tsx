import React, { useCallback, useMemo } from 'react'
import { useDataGridStore } from './store'
import type { DataItem, SortConfig } from './store'

interface TableHeaderProps {
  label: string
  sortKey: keyof DataItem
  currentSort: SortConfig | null
  onSort: (key: keyof DataItem) => void
}

const TableHeader: React.FC<TableHeaderProps> = React.memo(
  ({ label, sortKey, currentSort, onSort }) => {
    const handleClick = useCallback(() => {
      onSort(sortKey)
    }, [onSort, sortKey])

    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onSort(sortKey)
        }
      },
      [onSort, sortKey]
    )

    const isSorted = currentSort?.key === sortKey
    const sortDirection = isSorted ? currentSort.direction : null

    return (
      <th
        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset"
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="columnheader"
        aria-sort={
          isSorted
            ? sortDirection === 'asc'
              ? 'ascending'
              : 'descending'
            : 'none'
        }
        aria-label={`${label} column, ${
          isSorted
            ? `${sortDirection === 'asc' ? 'ascending' : 'descending'} sort`
            : 'click to sort'
        }`}
      >
        <div className="flex items-center space-x-1">
          <span>{label}</span>
          {isSorted && (
            <span className="text-gray-400" aria-hidden="true">
              {sortDirection === 'asc' ? '↑' : '↓'}
            </span>
          )}
        </div>
      </th>
    )
  }
)

TableHeader.displayName = 'TableHeader'

interface TableRowProps {
  item: DataItem
}

const TableRow: React.FC<TableRowProps> = React.memo(({ item }) => {
  const formatSalary = useCallback((salary: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(salary)
  }, [])

  const formatDate = useCallback((dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }, [])

  const getStatusColor = useCallback((status: DataItem['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'inactive':
        return 'bg-red-100 text-red-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }, [])

  return (
    <tr className="hover:bg-gray-50 border-b border-gray-200">
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
        {item.name}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {item.email}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {item.department}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {formatSalary(item.salary)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {formatDate(item.startDate)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span
          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
            item.status
          )}`}
          role="status"
          aria-label={`Status: ${item.status}`}
        >
          {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
        </span>
      </td>
    </tr>
  )
})

TableRow.displayName = 'TableRow'

export const DataTable: React.FC = React.memo(() => {
  const {
    filteredItems,
    currentPage,
    itemsPerPage,
    totalPages,
    sortConfig,
    setCurrentPage,
    setSortConfig,
    isLoading,
  } = useDataGridStore()

  const handleSort = useCallback(
    (key: keyof DataItem) => {
      const newDirection =
        sortConfig?.key === key && sortConfig.direction === 'asc'
          ? 'desc'
          : 'asc'
      setSortConfig({ key, direction: newDirection })
    },
    [sortConfig, setSortConfig]
  )

  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return filteredItems.slice(startIndex, endIndex)
  }, [filteredItems, currentPage, itemsPerPage])

  const handlePageChange = useCallback(
    (page: number) => {
      setCurrentPage(page)
    },
    [setCurrentPage]
  )

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, page: number) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        handlePageChange(page)
      }
    },
    [handlePageChange]
  )

  const renderPagination = () => {
    const pages = []
    const maxVisiblePages = 5
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2))
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1)
    }

    pages.push(
      <button
        key="prev"
        onClick={() => handlePageChange(currentPage - 1)}
        onKeyDown={e => handleKeyDown(e, currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-l-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset"
        aria-label="Go to previous page"
      >
        Previous
      </button>
    )

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          onKeyDown={e => handleKeyDown(e, i)}
          className={`px-3 py-2 text-sm font-medium border-t border-b focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset ${
            i === currentPage
              ? 'bg-blue-50 border-blue-500 text-blue-600'
              : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
          }`}
          aria-label={`Go to page ${i}`}
          aria-current={i === currentPage ? 'page' : undefined}
        >
          {i}
        </button>
      )
    }

    pages.push(
      <button
        key="next"
        onClick={() => handlePageChange(currentPage + 1)}
        onKeyDown={e => handleKeyDown(e, currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-r-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset"
        aria-label="Go to next page"
      >
        Next
      </button>
    )

    return pages
  }

  if (isLoading) {
    return (
      <div
        className="flex items-center justify-center h-64"
        role="status"
        aria-live="polite"
      >
        <div
          className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"
          aria-hidden="true"
        ></div>
        <span className="sr-only">Loading data...</span>
      </div>
    )
  }

  return (
    <div className="bg-white shadow-sm rounded-lg border border-gray-200">
      <div className="overflow-x-auto">
        <table
          className="min-w-full divide-y divide-gray-200"
          role="table"
          aria-label="Data table"
        >
          <thead className="bg-gray-50">
            <tr>
              <TableHeader
                label="Name"
                sortKey="name"
                currentSort={sortConfig}
                onSort={handleSort}
              />
              <TableHeader
                label="Email"
                sortKey="email"
                currentSort={sortConfig}
                onSort={handleSort}
              />
              <TableHeader
                label="Department"
                sortKey="department"
                currentSort={sortConfig}
                onSort={handleSort}
              />
              <TableHeader
                label="Salary"
                sortKey="salary"
                currentSort={sortConfig}
                onSort={handleSort}
              />
              <TableHeader
                label="Start Date"
                sortKey="startDate"
                currentSort={sortConfig}
                onSort={handleSort}
              />
              <TableHeader
                label="Status"
                sortKey="status"
                currentSort={sortConfig}
                onSort={handleSort}
              />
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedItems.map(item => (
              <TableRow key={item.id} item={item} />
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              onKeyDown={e => handleKeyDown(e, currentPage - 1)}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset"
              aria-label="Go to previous page"
            >
              Previous
            </button>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              onKeyDown={e => handleKeyDown(e, currentPage + 1)}
              disabled={currentPage === totalPages}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset"
              aria-label="Go to next page"
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing{' '}
                <span className="font-medium">
                  {(currentPage - 1) * itemsPerPage + 1}
                </span>{' '}
                to{' '}
                <span className="font-medium">
                  {Math.min(currentPage * itemsPerPage, filteredItems.length)}
                </span>{' '}
                of <span className="font-medium">{filteredItems.length}</span>{' '}
                results
              </p>
            </div>
            <div>
              <nav
                className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                role="navigation"
                aria-label="Pagination"
              >
                {renderPagination()}
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  )
})

DataTable.displayName = 'DataTable'
