import { useState, type JSXElementConstructor } from 'react'
import { cn } from './utils/cn'

function Main({ children }: { children: React.ReactNode }) {
  return <main className="p-4 h-full w-full max-w-4xl mx-auto">{children}</main>
}

function MainTitle({ children }: { children: React.ReactNode }) {
  return (
    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-gray-800 dark:text-white mb-8">
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
        'w-full p-4 text-left bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 shadow-sm hover:shadow-md',
        isSelected && 'bg-gray-50 dark:bg-gray-700',
        'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
      )}
      onClick={onClick}
    >
      <span className="text-gray-800 dark:text-white font-medium">
        {children}
      </span>
    </button>
  )
}

const availableComponents = [
  'Dynamic Form Component System',
  'Optimized Data Grid',
] as const

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
  (typeof availableComponents)[number],
  React.ReactElement<unknown, string | JSXElementConstructor<unknown>>
> = {
  'Dynamic Form Component System': <DynamicFormComponent />,
  'Optimized Data Grid': <OptimizedDataGrid />,
}

export default function App() {
  const [selectedComponent, setSelectedComponent] = useState<
    (typeof availableComponents)[number] | null
  >(null)

  return (
    <Main>
      <MainTitle>Curotec Technical Assessment</MainTitle>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4">
          Select a component to view:
        </h2>

        <div className="grid gap-4">
          {availableComponents.map(componentName => (
            <MainButton
              key={componentName}
              onClick={() => setSelectedComponent(componentName)}
              isSelected={selectedComponent === componentName}
            >
              {componentName}
            </MainButton>
          ))}
        </div>
      </div>

      {selectedComponent ? (
        allComponents[selectedComponent]
      ) : (
        <p className="text-gray-600 dark:text-gray-300">
          Please select a component to view.
        </p>
      )}
    </Main>
  )
}
