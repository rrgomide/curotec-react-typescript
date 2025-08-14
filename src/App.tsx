import { useState, type JSXElementConstructor } from 'react'
import { cn } from './utils/cn'

function HamburgerIcon({ isOpen }: { isOpen: boolean }) {
  return (
    <div className="w-6 h-6 flex flex-col justify-center items-center">
      <span
        className={cn(
          'block w-5 h-0.5 bg-gray-600 dark:bg-gray-300 transition-all duration-300 origin-center',
          isOpen && 'rotate-45 translate-y-1.5'
        )}
      />
      <span
        className={cn(
          'block w-5 h-0.5 bg-gray-600 dark:bg-gray-300 mt-1 transition-all duration-300',
          isOpen && 'opacity-0'
        )}
      />
      <span
        className={cn(
          'block w-5 h-0.5 bg-gray-600 dark:bg-gray-300 mt-1 transition-all duration-300 origin-center',
          isOpen && '-rotate-45 -translate-y-1.5'
        )}
      />
    </div>
  )
}

function MainContainer({ children }: { children: React.ReactNode }) {
  return <main className="h-screen w-full flex">{children}</main>
}

function HamburgerMenu({
  isOpen,
  onClick,
}: {
  isOpen: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'lg:hidden fixed top-4 z-50 p-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 transition-all duration-300',
        isOpen ? 'left-64' : 'left-4'
      )}
      aria-label="Toggle menu"
    >
      <HamburgerIcon isOpen={isOpen} />
    </button>
  )
}

function Sidebar({
  children,
  isOpen,
}: {
  children: React.ReactNode
  isOpen: boolean
}) {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40" />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed lg:static inset-y-0 left-0 z-40 w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 p-6 overflow-y-auto transform transition-transform duration-300 ease-in-out',
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {children}
      </aside>
    </>
  )
}

function Content({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex-1 p-6 lg:p-6 pt-20 lg:pt-6 overflow-y-auto bg-gray-50 dark:bg-gray-900">
      {children}
    </div>
  )
}

function MainTitle({ children }: { children: React.ReactNode }) {
  return (
    <h1 className="text-xl font-bold text-gray-800 dark:text-white mb-6">
      {children}
    </h1>
  )
}

function MainButton({
  children,
  onClick,
  isSelected,
}: {
  children: React.ReactNode
  onClick: () => void
  isSelected: boolean
}) {
  return (
    <button
      type="button"
      className={cn(
        'w-full p-3 text-left bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 shadow-sm hover:shadow-md',
        isSelected &&
          'bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-600',
        'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
      )}
      onClick={onClick}
    >
      <span
        className={cn(
          'text-gray-800 dark:text-white font-medium',
          isSelected && 'text-blue-700 dark:text-blue-300'
        )}
      >
        {children}
      </span>
    </button>
  )
}

const availableComponents = [
  'Dynamic Form Component System',
  'Optimized Data Grid',
] as const

type AvailableComponents = (typeof availableComponents)[number]

const DynamicFormComponent = () => {
  return (
    <div className="mt-8 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
        Dynamic Form Component
      </h2>
      <p className="text-gray-600 dark:text-gray-300">
        This component will be implemented with dynamic form generation
        capabilities.
      </p>
    </div>
  )
}

const OptimizedDataGrid = () => {
  return (
    <div className="mt-8 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
        Optimized Data Grid
      </h2>
      <p className="text-gray-600 dark:text-gray-300">
        This component will feature an optimized data grid with sorting,
        filtering, and pagination.
      </p>
    </div>
  )
}

const allComponents: Record<
  AvailableComponents,
  React.ReactElement<unknown, string | JSXElementConstructor<unknown>>
> = {
  'Dynamic Form Component System': <DynamicFormComponent />,
  'Optimized Data Grid': <OptimizedDataGrid />,
}

function Components({
  availableComponents,
  selectedComponent,
  onComponentSelect,
  closeSidebar,
}: {
  availableComponents: readonly AvailableComponents[]
  selectedComponent: AvailableComponents | null
  onComponentSelect: (component: AvailableComponents) => void
  closeSidebar: () => void
}) {
  return (
    <div className="space-y-3">
      <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
        Select a component:
      </h2>

      <div className="space-y-2">
        {availableComponents.map(componentName => (
          <MainButton
            key={componentName}
            onClick={() => {
              onComponentSelect(componentName)
              closeSidebar() // Close sidebar on mobile after selection
            }}
            isSelected={selectedComponent === componentName}
          >
            {componentName}
          </MainButton>
        ))}
      </div>
    </div>
  )
}

function Info() {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
          Welcome to Curotec Technical Assessment
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Please select a component from the sidebar.
        </p>
      </div>
    </div>
  )
}

export default function App() {
  const [selectedComponent, setSelectedComponent] = useState<
    (typeof availableComponents)[number] | null
  >(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const closeSidebar = () => setIsSidebarOpen(false)

  return (
    <MainContainer>
      <HamburgerMenu
        isOpen={isSidebarOpen}
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      <Sidebar isOpen={isSidebarOpen}>
        <MainTitle>Curotec Technical Assessment</MainTitle>

        <Components
          availableComponents={availableComponents}
          selectedComponent={selectedComponent}
          onComponentSelect={setSelectedComponent}
          closeSidebar={closeSidebar}
        />
      </Sidebar>

      <Content>
        {selectedComponent ? allComponents[selectedComponent] : <Info />}
      </Content>
    </MainContainer>
  )
}
