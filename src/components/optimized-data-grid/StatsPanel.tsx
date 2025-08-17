import React, { useMemo } from 'react'
import { useDataGridStore } from './store'

export const StatsPanel: React.FC = React.memo(() => {
  const { filteredItems, items, isLoading } = useDataGridStore()

  const stats = useMemo(() => {
    if (isLoading || filteredItems.length === 0) {
      return {
        totalItems: 0,
        filteredItems: 0,
        avgSalary: 0,
        activeCount: 0,
        inactiveCount: 0,
        pendingCount: 0,
      }
    }

    const activeCount = filteredItems.filter(
      item => item.status === 'active'
    ).length
    const inactiveCount = filteredItems.filter(
      item => item.status === 'inactive'
    ).length
    const pendingCount = filteredItems.filter(
      item => item.status === 'pending'
    ).length
    const avgSalary = Math.round(
      filteredItems.reduce((sum, item) => sum + item.salary, 0) /
        filteredItems.length
    )

    return {
      totalItems: items.length,
      filteredItems: filteredItems.length,
      avgSalary,
      activeCount,
      inactiveCount,
      pendingCount,
    }
  }, [filteredItems, items, isLoading])

  if (isLoading) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-4">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Summary</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">
            {stats.totalItems}
          </div>
          <div className="text-sm text-gray-500">Total Items</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">
            {stats.filteredItems}
          </div>
          <div className="text-sm text-gray-500">Filtered Items</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-600">
            ${stats.avgSalary.toLocaleString()}
          </div>
          <div className="text-sm text-gray-500">Avg Salary</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-orange-600">
            {stats.activeCount}/{stats.inactiveCount}/{stats.pendingCount}
          </div>
          <div className="text-sm text-gray-500">Active/Inactive/Pending</div>
        </div>
      </div>
    </div>
  )
})

StatsPanel.displayName = 'StatsPanel'
