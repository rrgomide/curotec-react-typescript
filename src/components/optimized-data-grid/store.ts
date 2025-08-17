import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

export interface DataItem extends Record<string, unknown> {
  id: number
  name: string
  email: string
  department: string
  salary: number
  startDate: string
  status: 'active' | 'inactive' | 'pending'
}

export interface SortConfig<T = DataItem> {
  key: keyof T
  direction: 'asc' | 'desc'
}

export interface FilterConfig {
  search: string
  department: string
  status: string
  minSalary: number
  maxSalary: number
}

export interface DataGridState {
  items: DataItem[]
  filteredItems: DataItem[]
  isLoading: boolean

  currentPage: number
  itemsPerPage: number
  totalPages: number

  sortConfig: SortConfig | null
  filterConfig: FilterConfig

  setItems: (items: DataItem[]) => void
  setLoading: (loading: boolean) => void
  setCurrentPage: (page: number) => void
  setItemsPerPage: (perPage: number) => void
  setSortConfig: (config: SortConfig | null) => void
  setFilterConfig: (config: Partial<FilterConfig>) => void
  applyFiltersAndSort: () => void
  resetFilters: () => void
}

const generateMockData = (count: number): DataItem[] => {
  const departments = [
    'Engineering',
    'Marketing',
    'Sales',
    'HR',
    'Finance',
    'Operations',
  ]
  const statuses: DataItem['status'][] = ['active', 'inactive', 'pending']

  return Array.from({ length: count }, (_, index) => ({
    id: index + 1,
    name: `Employee ${index + 1}`,
    email: `employee${index + 1}@company.com`,
    department: departments[Math.floor(Math.random() * departments.length)],
    salary: Math.floor(Math.random() * 100_000) + 30_000,
    startDate: new Date(
      Date.now() - Math.random() * 1_000 * 60 * 60 * 24 * 365 * 5
    )
      .toISOString()
      .split('T')[0],
    status: statuses[Math.floor(Math.random() * statuses.length)],
  }))
}

export const useDataGridStore = create<DataGridState>()(
  devtools(
    (set, get) => ({
      items: [],
      filteredItems: [],
      isLoading: false,
      currentPage: 1,
      itemsPerPage: 20,
      totalPages: 1,
      sortConfig: null,
      filterConfig: {
        search: '',
        department: '',
        status: '',
        minSalary: 0,
        maxSalary: 200000,
      },

      setItems: items => {
        set({ items, totalPages: Math.ceil(items.length / get().itemsPerPage) })
        get().applyFiltersAndSort()
      },

      setLoading: loading => set({ isLoading: loading }),

      setCurrentPage: page => set({ currentPage: page }),

      setItemsPerPage: perPage => {
        set({
          itemsPerPage: perPage,
          currentPage: 1,
          totalPages: Math.ceil(get().items.length / perPage),
        })
        get().applyFiltersAndSort()
      },

      setSortConfig: config => {
        set({ sortConfig: config })
        get().applyFiltersAndSort()
      },

      setFilterConfig: config => {
        set({
          filterConfig: { ...get().filterConfig, ...config },
          currentPage: 1,
        })
        get().applyFiltersAndSort()
      },

      applyFiltersAndSort: () => {
        const { items, filterConfig, sortConfig } = get()

        let filtered = [...items]

        if (filterConfig.search) {
          const searchLower = filterConfig.search.toLowerCase()
          filtered = filtered.filter(
            item =>
              item.name.toLowerCase().includes(searchLower) ||
              item.email.toLowerCase().includes(searchLower) ||
              item.department.toLowerCase().includes(searchLower)
          )
        }

        if (filterConfig.department) {
          filtered = filtered.filter(
            item => item.department === filterConfig.department
          )
        }

        if (filterConfig.status) {
          filtered = filtered.filter(
            item => item.status === filterConfig.status
          )
        }

        if (filterConfig.minSalary > 0) {
          filtered = filtered.filter(
            item => item.salary >= filterConfig.minSalary
          )
        }

        if (filterConfig.maxSalary < 200000) {
          filtered = filtered.filter(
            item => item.salary <= filterConfig.maxSalary
          )
        }

        if (sortConfig) {
          filtered.sort((a, b) => {
            const aValue = a[sortConfig.key]
            const bValue = b[sortConfig.key]

            if (typeof aValue === 'string' && typeof bValue === 'string') {
              const comparison = aValue.localeCompare(bValue)
              return sortConfig.direction === 'asc' ? comparison : -comparison
            }

            if (typeof aValue === 'number' && typeof bValue === 'number') {
              return sortConfig.direction === 'asc'
                ? aValue - bValue
                : bValue - aValue
            }

            return 0
          })
        }

        set({
          filteredItems: filtered,
          totalPages: Math.ceil(filtered.length / get().itemsPerPage),
        })
      },

      resetFilters: () => {
        set({
          filterConfig: {
            search: '',
            department: '',
            status: '',
            minSalary: 0,
            maxSalary: 200000,
          },
          sortConfig: null,
          currentPage: 1,
        })
        get().applyFiltersAndSort()
      },
    }),
    {
      name: 'data-grid-store',
    }
  )
)

export const initializeDataGrid = () => {
  const store = useDataGridStore.getState()
  store.setLoading(true)

  setTimeout(() => {
    const mockData = generateMockData(100)
    store.setItems(mockData)
    store.setLoading(false)
  }, 500)
}
