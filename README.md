# Curotec React TypeScript Components

This project showcases two powerful React components built with TypeScript: **DynamicForm** and **OptimizedDataGrid**. Both components demonstrate modern React patterns, performance optimizations, and best practices.

## Table of Contents

- [DynamicForm](#dynamicform)

  - [Features](#dynamicform-features)
  - [Architecture](#dynamicform-architecture)
  - [Basic Usage](#dynamicform-basic-usage)
  - [Advanced Usage](#dynamicform-advanced-usage)
  - [Validation](#dynamicform-validation)
  - [Custom Field Types](#dynamicform-custom-field-types)

- [OptimizedDataGrid](#optimizeddatagrid)
  - [Features](#optimizeddatagrid-features)
  - [Performance Optimizations](#optimizeddatagrid-performance)
  - [State Management](#optimizeddatagrid-state-management)
  - [Basic Usage](#optimizeddatagrid-basic-usage)
  - [Data Model](#optimizeddatagrid-data-model)
  - [Filtering & Sorting](#optimizeddatagrid-filtering-sorting)

---

## DynamicForm

A composable form system built with React that demonstrates component composition patterns, React Context API, and custom hooks.

### DynamicForm Features

- **Component Composition**: Reusable form components that can be composed together
- **React Context**: Centralized form state management
- **Custom Hooks**: Shared logic for form fields and validation
- **TypeScript**: Full type safety throughout the system
- **Validation**: Built-in validation with customizable validation schemas
- **Multiple Input Types**: Text, Select, and Checkbox components included
- **Accessibility**: Proper ARIA labels and keyboard navigation

### DynamicForm Architecture

#### Core Components

1. **FormProvider**: Context provider that manages form state
2. **DynamicForm**: Main wrapper component that sets up the form context
3. **FormContainer**: Handles form submission and displays status messages
4. **Field Components**: Reusable input components (TextField, SelectField, CheckboxField)

#### Custom Hooks

1. **useFormContext**: Access form context and methods
2. **useFormField**: Manage individual field state and validation

#### State Management

The form uses a reducer pattern with the following state structure:

```typescript
interface FormState {
  fields: Record<string, FormField>
  isSubmitting: boolean
  isSubmitted: boolean
  submitError?: string
}
```

### DynamicForm Basic Usage

```tsx
import {
  DynamicForm,
  TextField,
  SelectField,
  CheckboxField,
} from './components/DynamicForm'

const MyForm = () => {
  const handleSubmit = async (values: Record<string, string | boolean>) => {
    // Handle form submission
    console.info('Form values:', values)
  }

  const validationSchema = {
    name: (value: string | boolean) => {
      if (typeof value !== 'string') return 'Name must be a string'
      if (!value.trim()) return 'Name is required'
      return undefined
    },
    email: (value: string | boolean) => {
      if (typeof value !== 'string') return 'Email must be a string'
      if (!value.trim()) return 'Email is required'
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        return 'Please enter a valid email'
      }
      return undefined
    },
  }

  return (
    <DynamicForm onSubmit={handleSubmit} validationSchema={validationSchema}>
      <TextField
        name="name"
        label="Full Name"
        placeholder="Enter your name"
        required
      />

      <TextField
        name="email"
        label="Email Address"
        placeholder="Enter your email"
        required
      />

      <SelectField
        name="department"
        label="Department"
        options={[
          { value: 'engineering', label: 'Engineering' },
          { value: 'marketing', label: 'Marketing' },
        ]}
        required
      />

      <CheckboxField
        name="terms"
        label="I agree to the terms and conditions"
        required
      />
    </DynamicForm>
  )
}
```

### DynamicForm Advanced Usage

#### With Initial Values

```tsx
const AdvancedForm = () => {
  const initialValues = {
    name: 'John Doe',
    email: 'john@example.com',
    department: 'engineering',
    terms: false,
  }

  return (
    <DynamicForm
      onSubmit={handleSubmit}
      initialValues={initialValues}
      validationSchema={validationSchema}
    >
      <TextField name="name" label="Full Name" required />
      <TextField name="email" label="Email Address" required />
      <SelectField
        name="department"
        label="Department"
        options={departmentOptions}
        required
      />
      <CheckboxField
        name="terms"
        label="I agree to the terms and conditions"
        required
      />
    </DynamicForm>
  )
}
```

#### Component Composition Patterns

```tsx
// Context Provider Pattern
<FormProvider onSubmit={handleSubmit} validationSchema={validationSchema}>
  <FormContainer>{/* Form fields */}</FormContainer>
</FormProvider>

// Custom Hook Pattern
const { field, handleChange, handleBlur } = useFormField(name, initialValue)

// Compound Component Pattern
<DynamicForm onSubmit={handleSubmit}>
  <TextField name="name" label="Name" />
  <SelectField name="category" label="Category" options={options} />
  <CheckboxField name="agree" label="I agree" />
</DynamicForm>
```

### DynamicForm Validation

#### Built-in Validators

```tsx
const validators = {
  required: (value: string | boolean): string | undefined => {
    if (typeof value === 'string' && !value.trim()) {
      return 'This field is required'
    }
    if (typeof value === 'boolean' && !value) {
      return 'This field is required'
    }
    return undefined
  },

  email: (value: string): string | undefined => {
    if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return 'Please enter a valid email address'
    }
    return undefined
  },

  minLength:
    (min: number) =>
    (value: string): string | undefined => {
      if (value && value.length < min) {
        return `Must be at least ${min} characters`
      }
      return undefined
    },
}

const validationSchema = {
  name: (value: string | boolean) => {
    if (typeof value !== 'string') return 'Name must be a string'
    const required = validators.required(value)
    if (required) return required
    return validators.minLength(2)(value)
  },
  email: (value: string | boolean) => {
    if (typeof value !== 'string') return 'Email must be a string'
    const required = validators.required(value)
    if (required) return required
    return validators.email(value)
  },
  department: validators.required,
  terms: validators.required,
}
```

#### Custom Validators

```tsx
const customValidationSchema = {
  username: (value: string | boolean) => {
    if (typeof value !== 'string') return 'Username must be a string'
    if (value.length < 3) return 'Username must be at least 3 characters'
    if (!/^[a-zA-Z0-9_]+$/.test(value)) {
      return 'Username can only contain letters, numbers, and underscores'
    }
    return undefined
  },
}
```

### DynamicForm Custom Field Types

#### Adding New Field Types

```tsx
export const TextAreaField: React.FC<BaseFieldProps> = ({
  name,
  label,
  placeholder,
  required,
}) => {
  const { field, handleChange, handleBlur } = useFormField(name, '')

  return (
    <div className="form-field">
      <label htmlFor={name} className="form-label">
        {label}
        {required && <span className="required">*</span>}
      </label>
      <textarea
        id={name}
        value={field.value as string}
        onChange={e => handleChange(e.target.value)}
        onBlur={handleBlur}
        placeholder={placeholder}
        className={`form-textarea ${
          field.error && field.touched ? 'error' : ''
        }`}
      />
      {field.error && field.touched && (
        <div className="error-message">{field.error}</div>
      )}
    </div>
  )
}
```

#### Custom Form Actions

```tsx
const CustomFormActions = () => {
  const { state, submitForm, resetForm } = useFormContext()

  return (
    <div className="custom-actions">
      <button onClick={submitForm} disabled={state.isSubmitting}>
        {state.isSubmitting ? 'Saving...' : 'Save Draft'}
      </button>
      <button onClick={resetForm}>Clear Form</button>
    </div>
  )
}
```

---

## OptimizedDataGrid

A high-performance data grid component built with React, TypeScript, and Zustand for efficient state management and rendering optimization.

### OptimizedDataGrid Features

#### 🚀 Performance Optimizations

- **React.memo**: All components are wrapped with React.memo to prevent unnecessary re-renders
- **useCallback**: Event handlers are memoized to maintain referential equality
- **useMemo**: Computed values are memoized to avoid expensive recalculations
- **Pagination**: Efficient rendering of large datasets with configurable page sizes
- **Optimized filtering**: Real-time filtering with debounced search

#### 📊 Data Management

- **Zustand Store**: Centralized state management with devtools integration
- **100+ Mock Records**: Pre-generated employee data for testing
- **Real-time Updates**: Immediate UI updates on filter/sort changes
- **Loading States**: Smooth loading indicators during data operations

#### 🔍 Advanced Filtering

- **Text Search**: Search across name, email, and department fields
- **Department Filter**: Filter by specific departments
- **Status Filter**: Filter by employee status (active/inactive/pending)
- **Salary Range**: Filter by minimum and maximum salary
- **Clear All**: One-click filter reset

#### 📈 Sorting & Pagination

- **Multi-column Sorting**: Click any column header to sort
- **Bidirectional Sorting**: Toggle between ascending/descending order
- **Smart Pagination**: Configurable items per page (10, 20, 50, 100)
- **Page Navigation**: Previous/Next buttons with page numbers

#### 📱 Responsive Design

- **Mobile-First**: Optimized for all screen sizes
- **Tailwind CSS**: Modern, utility-first styling
- **Accessible**: Proper ARIA labels and keyboard navigation
- **Dark Mode Ready**: Compatible with dark theme

### OptimizedDataGrid Performance

#### Rendering Optimization

- Uses `React.memo` for all components to prevent unnecessary re-renders
- Implements `useCallback` for event handlers to maintain referential equality
- Uses `useMemo` for expensive computations like filtering and pagination

#### State Management Patterns

- **Single Source of Truth**: All state managed in Zustand store
- **Immutable Updates**: State updates follow immutable patterns
- **Computed State**: Filtered and sorted data computed from base state
- **Action Composition**: Complex operations composed from simple actions

### OptimizedDataGrid State Management

The component uses Zustand for state management with the following structure:

```typescript
interface DataGridState {
  // Data
  items: DataItem[]
  filteredItems: DataItem[]
  isLoading: boolean

  // Pagination
  currentPage: number
  itemsPerPage: number
  totalPages: number

  // Sorting
  sortConfig: SortConfig | null

  // Filtering
  filterConfig: FilterConfig

  // Actions
  setItems: (items: DataItem[]) => void
  setLoading: (loading: boolean) => void
  setCurrentPage: (page: number) => void
  setItemsPerPage: (perPage: number) => void
  setSortConfig: (config: SortConfig | null) => void
  setFilterConfig: (config: Partial<FilterConfig>) => void
  applyFiltersAndSort: () => void
  resetFilters: () => void
}
```

### OptimizedDataGrid Basic Usage

```tsx
import { OptimizedDataGrid } from './components/optimized-data-grid'

function App() {
  return (
    <div>
      <OptimizedDataGrid />
    </div>
  )
}
```

### OptimizedDataGrid Data Model

```typescript
interface DataItem {
  id: number
  name: string
  email: string
  department: string
  salary: number
  startDate: string
  status: 'active' | 'inactive' | 'pending'
}
```

### OptimizedDataGrid Filtering & Sorting

#### Filtering Strategy

- **Real-time Filtering**: Filters applied immediately on user input
- **Multi-field Search**: Search across multiple text fields
- **Range Filters**: Numeric range filtering for salary
- **Categorical Filters**: Dropdown-based filtering for departments and status

#### Sorting Implementation

- **Column-based Sorting**: Click any column header to sort
- **Direction Toggle**: Click same column to reverse sort order
- **Type-aware Sorting**: Different sorting logic for strings vs numbers
- **Visual Indicators**: Clear visual feedback for sort state

#### Example Filter Configuration

```tsx
const filterConfig = {
  search: '', // Text search across name, email, department
  department: '', // Specific department filter
  status: '', // Status filter (active/inactive/pending)
  minSalary: 0, // Minimum salary filter
  maxSalary: 200000, // Maximum salary filter
}
```

#### Example Sort Configuration

```tsx
const sortConfig = {
  key: 'name', // Column to sort by
  direction: 'asc', // Sort direction (asc/desc)
}
```

## Component Structure

```
src/components/
├── DynamicForm/
│   ├── index.tsx              # Main DynamicForm component
│   ├── types.ts               # TypeScript interfaces
│   ├── hooks.ts               # Custom hooks (useFormContext, useFormField)
│   ├── reducer.ts             # Form state reducer
│   └── DynamicForm.test.tsx   # Unit tests
├── optimized-data-grid/
│   ├── index.tsx              # Main OptimizedDataGrid component
│   ├── store.ts               # Zustand store with state management
│   ├── FilterPanel.tsx        # Advanced filtering controls
│   ├── DataTable.tsx          # Sortable data table with pagination
│   ├── StatsPanel.tsx         # Summary statistics
│   ├── PaginationControls.tsx # Items per page selector
│   └── OptimizedDataGrid.test.tsx # Unit tests
└── shared/
    ├── TextField.tsx          # Reusable text input component
    ├── SelectField.tsx        # Reusable select input component
    └── CheckboxField.tsx      # Reusable checkbox input component
```

## Getting Started

1. **Install Dependencies**

   ```bash
   npm install
   ```

2. **Run Development Server**

   ```bash
   npm run dev
   ```

3. **Run Tests**

   ```bash
   npm test
   ```

4. **Build for Production**
   ```bash
   npm run build
   ```

## Technologies Used

- **React 18**: Latest React features with hooks and functional components
- **TypeScript**: Full type safety throughout the application
- **Vite**: Fast build tool and development server
- **Tailwind CSS**: Utility-first CSS framework
- **Zustand**: Lightweight state management
- **Vitest**: Fast unit testing framework
- **React Testing Library**: Component testing utilities

## Best Practices Demonstrated

1. **Performance Optimization**: React.memo, useCallback, useMemo
2. **Type Safety**: Comprehensive TypeScript interfaces
3. **Component Composition**: Reusable, composable components
4. **State Management**: Centralized state with clear separation of concerns
5. **Accessibility**: Proper ARIA labels and keyboard navigation
6. **Testing**: Comprehensive unit tests with good coverage
7. **Code Organization**: Clear file structure and separation of concerns
8. **Error Handling**: Proper error boundaries and validation
9. **Responsive Design**: Mobile-first approach with Tailwind CSS
10. **Modern React Patterns**: Hooks, Context API, and functional components

## Future Enhancements

### DynamicForm

- [ ] File upload field support
- [ ] Multi-step form wizard
- [ ] Form field dependencies
- [ ] Real-time validation
- [ ] Form templates and presets

### OptimizedDataGrid

- [ ] Virtual scrolling for very large datasets
- [ ] Export functionality (CSV, Excel)
- [ ] Column resizing and reordering
- [ ] Row selection and bulk actions
- [ ] Advanced filtering with date ranges
- [ ] Keyboard shortcuts for navigation
- [ ] Custom cell renderers
- [ ] Server-side pagination and filtering
