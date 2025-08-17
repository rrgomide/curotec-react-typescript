import { DynamicForm } from './DynamicForm'
import { CheckboxField, SelectField, TextField } from './shared'

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
    if (typeof value !== 'string') {
      return 'Name must be a string'
    }
    const required = validators.required(value)
    if (required) {
      return required
    }
    return validators.minLength(2)(value)
  },
  email: (value: string | boolean) => {
    if (typeof value !== 'string') {
      return 'Email must be a string'
    }
    const required = validators.required(value)
    if (required) {
      return required
    }
    return validators.email(value)
  },
  department: validators.required,
  terms: validators.required,
}

const initialValues = {
  name: '',
  email: '',
  department: '',
  terms: false,
}

const departmentOptions = [
  { value: 'engineering', label: 'Engineering' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'sales', label: 'Sales' },
  { value: 'hr', label: 'Human Resources' },
  { value: 'finance', label: 'Finance' },
  { value: 'operations', label: 'Operations' },
].sort((a, b) => a.label.localeCompare(b.label))

function simulateDelay({ milliseconds }: { milliseconds: number }) {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}

function FormDemo() {
  async function handleFormDemoSubmit(
    values: Record<string, string | boolean>
  ) {
    await simulateDelay({ milliseconds: 1_500 })
    console.log('Form submitted with values:', JSON.stringify(values, null, 2))

    // ~50% chance of error/success
    if (Math.random() > 0.5) {
      throw new Error('Could not submit form. Please try again.')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-8">
      <div className="text-center text-white mb-12">
        <h1 className="text-4xl font-bold mb-2 md:text-5xl">
          Dynamic Form System Demo
        </h1>
        <p className="text-lg opacity-90">
          A composable form system demonstrating React patterns
        </p>
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="bg-white/95 backdrop-blur-sm rounded-xl p-8 mb-8 shadow-2xl">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            Employee Registration Form
          </h2>
          <p className="text-gray-600 mb-6">
            This form demonstrates the composable form system with validation
            and state management.
          </p>

          <DynamicForm
            onSubmit={handleFormDemoSubmit}
            initialValues={initialValues}
            validationSchema={validationSchema}
            className="bg-transparent shadow-none p-0"
          >
            <TextField
              name="name"
              label="Full Name"
              placeholder="Enter your full name"
              required
            />

            <TextField
              name="email"
              label="Email Address"
              placeholder="Enter your email address"
              required
            />

            <SelectField
              name="department"
              label="Department"
              options={departmentOptions}
              required
            />

            <CheckboxField
              name="terms"
              label="I agree to the terms and conditions and privacy policy"
              required
            />
          </DynamicForm>
        </div>

        <div className="bg-white/95 backdrop-blur-sm rounded-xl p-8 mb-8 shadow-2xl">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Features Demonstrated
          </h3>
          <ul className="space-y-2">
            <li className="py-2 text-gray-600 border-b border-gray-200 last:border-b-0">
              <strong className="text-gray-800">Component Composition:</strong>{' '}
              Reusable form components
            </li>
            <li className="py-2 text-gray-600 border-b border-gray-200 last:border-b-0">
              <strong className="text-gray-800">React Context:</strong>{' '}
              Centralized state management
            </li>
            <li className="py-2 text-gray-600 border-b border-gray-200 last:border-b-0">
              <strong className="text-gray-800">Custom Hooks:</strong> Shared
              form logic
            </li>
            <li className="py-2 text-gray-600 border-b border-gray-200 last:border-b-0">
              <strong className="text-gray-800">Validation:</strong> Real-time
              field validation
            </li>
            <li className="py-2 text-gray-600 border-b border-gray-200 last:border-b-0">
              <strong className="text-gray-800">TypeScript:</strong> Full type
              safety
            </li>
            <li className="py-2 text-gray-600 border-b border-gray-200 last:border-b-0">
              <strong className="text-gray-800">Error Handling:</strong> Form
              submission error states
            </li>
            <li className="py-2 text-gray-600 border-b border-gray-200 last:border-b-0">
              <strong className="text-gray-800">Accessibility:</strong> Proper
              labels and ARIA attributes
            </li>
          </ul>
        </div>

        <div className="bg-white/95 backdrop-blur-sm rounded-xl p-8 shadow-2xl">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Usage Example
          </h3>
          <pre className="bg-gray-800 rounded-lg p-6 overflow-x-auto">
            <code className="text-gray-200 font-mono text-sm leading-relaxed">
              {`import { DynamicForm, TextField, SelectField, CheckboxField } from './DynamicForm';

const MyForm = () => {
  const handleSubmit = async (values) => {
    console.log('Form values:', values);
  };

  return (
    <DynamicForm onSubmit={handleSubmit}>
      <TextField name="name" label="Name" required />
      <SelectField name="category" label="Category" options={options} />
      <CheckboxField name="agree" label="I agree" required />
    </DynamicForm>
  );
};`}
            </code>
          </pre>
        </div>
      </div>
    </div>
  )
}

export default FormDemo
