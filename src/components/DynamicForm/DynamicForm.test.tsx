import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { DynamicForm } from './index'
import { TextField, SelectField, CheckboxField } from '../shared'

// Mock console.log to avoid noise in tests
const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

describe('DynamicForm', () => {
  beforeEach(() => {
    consoleSpy.mockClear()
  })

  const mockOnSubmit = vi.fn()

  const defaultProps = {
    onSubmit: mockOnSubmit,
    children: (
      <div>
        <TextField name="name" label="Name" placeholder="Enter your name" />
        <TextField name="email" label="Email" placeholder="Enter your email" />
      </div>
    ),
  }

  it('renders the form with children', () => {
    render(<DynamicForm {...defaultProps} />)

    expect(screen.getByLabelText('Name')).toBeInTheDocument()
    expect(screen.getByLabelText('Email')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /reset/i })).toBeInTheDocument()
  })

  it('renders with custom className', () => {
    render(<DynamicForm {...defaultProps} className="custom-class" />)

    const form = screen.getByRole('form')
    expect(form).toHaveClass('custom-class')
  })

  it('initializes with initial values', () => {
    const nameToBeTested = 'Curotec Developer'
    const emailToBeTested = 'curotec.developer@curotec.com'

    const initialValues = {
      name: nameToBeTested,
      email: emailToBeTested,
    }

    render(<DynamicForm {...defaultProps} initialValues={initialValues} />)

    const nameInput = screen.getByDisplayValue(
      nameToBeTested
    ) as HTMLInputElement
    const emailInput = screen.getByDisplayValue(
      emailToBeTested
    ) as HTMLInputElement

    expect(nameInput.value).toBe(nameToBeTested)
    expect(emailInput.value).toBe(emailToBeTested)
  })

  it('handles form submission with valid data', async () => {
    const user = userEvent.setup()
    render(<DynamicForm {...defaultProps} />)

    const nameInput = screen.getByLabelText('Name')
    const emailInput = screen.getByLabelText('Email')
    const submitButton = screen.getByRole('button', { name: /submit/i })

    await user.type(nameInput, 'Jane Doe')
    await user.type(emailInput, 'jane@example.com')
    await user.click(submitButton)

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        name: 'Jane Doe',
        email: 'jane@example.com',
      })
    })
  })

  it('shows loading state during submission', async () => {
    const user = userEvent.setup()
    const slowOnSubmit = vi
      .fn()
      .mockImplementation(
        () => new Promise(resolve => setTimeout(resolve, 100))
      )

    render(<DynamicForm {...defaultProps} onSubmit={slowOnSubmit} />)

    const submitButton = screen.getByRole('button', { name: /submit/i })
    await user.click(submitButton)

    expect(screen.getByText('Submitting...')).toBeInTheDocument()
    expect(submitButton).toBeDisabled()
  })

  it('shows success message after successful submission', async () => {
    const user = userEvent.setup()
    render(<DynamicForm {...defaultProps} />)

    const submitButton = screen.getByRole('button', { name: /submit/i })
    await user.click(submitButton)

    await waitFor(() => {
      expect(
        screen.getByText('Form submitted successfully!')
      ).toBeInTheDocument()
    })
  })

  it('shows error message when submission fails', async () => {
    const user = userEvent.setup()
    const failingOnSubmit = vi
      .fn()
      .mockRejectedValue(new Error('Network error'))

    render(<DynamicForm {...defaultProps} onSubmit={failingOnSubmit} />)

    const submitButton = screen.getByRole('button', { name: /submit/i })
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('Network error')).toBeInTheDocument()
    })
  })

  it('resets form when reset button is clicked', async () => {
    const user = userEvent.setup()
    const initialValues = {
      name: 'John Doe',
      email: 'john@example.com',
    }

    render(<DynamicForm {...defaultProps} initialValues={initialValues} />)

    const nameInput = screen.getByDisplayValue('John Doe') as HTMLInputElement
    const emailInput = screen.getByDisplayValue(
      'john@example.com'
    ) as HTMLInputElement
    const resetButton = screen.getByRole('button', { name: /reset/i })

    // Verify initial values
    expect(nameInput.value).toBe('John Doe')
    expect(emailInput.value).toBe('john@example.com')

    // Change values
    await user.clear(nameInput)
    await user.type(nameInput, 'Jane Doe')
    await user.clear(emailInput)
    await user.type(emailInput, 'jane@example.com')

    // Verify changes
    expect(nameInput.value).toBe('Jane Doe')
    expect(emailInput.value).toBe('jane@example.com')

    // Reset form
    await user.click(resetButton)

    // Verify reset
    expect(nameInput.value).toBe('')
    expect(emailInput.value).toBe('')
  })

  it('handles boolean values in form data', async () => {
    const user = userEvent.setup()
    const booleanProps = {
      onSubmit: mockOnSubmit,
      children: (
        <div>
          <CheckboxField name="agreed" label="I agree to the terms" />
        </div>
      ),
    }

    render(<DynamicForm {...booleanProps} />)

    const checkbox = screen.getByRole('checkbox') as HTMLInputElement
    const submitButton = screen.getByRole('button', { name: /submit/i })

    await user.click(checkbox)
    await user.click(submitButton)

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        agreed: true,
      })
    })
  })

  it('handles form submission with mixed string and boolean values', async () => {
    const user = userEvent.setup()
    const mixedProps = {
      onSubmit: mockOnSubmit,
      children: (
        <div>
          <TextField name="name" label="Name" />
          <CheckboxField name="newsletter" label="Subscribe to newsletter" />
        </div>
      ),
    }

    render(<DynamicForm {...mixedProps} />)

    const nameInput = screen.getByLabelText('Name')
    const newsletterCheckbox = screen.getByRole('checkbox') as HTMLInputElement
    const submitButton = screen.getByRole('button', { name: /submit/i })

    await user.type(nameInput, 'John Doe')
    await user.click(newsletterCheckbox)
    await user.click(submitButton)

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        name: 'John Doe',
        newsletter: true,
      })
    })
  })

  it('maintains form state during validation errors', async () => {
    const user = userEvent.setup()
    const validationSchema = {
      email: (value: string | boolean) => {
        if (typeof value !== 'string' || !value.includes('@')) {
          return 'Invalid email'
        }
        return undefined
      },
    }

    render(
      <DynamicForm {...defaultProps} validationSchema={validationSchema} />
    )

    const nameInput = screen.getByLabelText('Name')
    const emailInput = screen.getByLabelText('Email')
    const submitButton = screen.getByRole('button', { name: /submit/i })

    await user.type(nameInput, 'John Doe')
    await user.type(emailInput, 'invalid-email')
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('Invalid email')).toBeInTheDocument()
    })

    expect((nameInput as HTMLInputElement).value).toBe('John Doe')
    expect((emailInput as HTMLInputElement).value).toBe('invalid-email')
  })

  it('handles select field with options', async () => {
    const user = userEvent.setup()
    const selectProps = {
      onSubmit: mockOnSubmit,
      children: (
        <div>
          <SelectField
            name="department"
            label="Department"
            options={[
              { value: 'engineering', label: 'Engineering' },
              { value: 'marketing', label: 'Marketing' },
            ]}
          />
        </div>
      ),
    }

    render(<DynamicForm {...selectProps} />)

    const select = screen.getByLabelText('Department') as HTMLSelectElement
    const submitButton = screen.getByRole('button', { name: /submit/i })

    await user.selectOptions(select, 'engineering')
    await user.click(submitButton)

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        department: 'engineering',
      })
    })
  })

  it('shows validation errors for touched fields', async () => {
    const user = userEvent.setup()
    const validationSchema = {
      name: (value: string | boolean) => {
        if (typeof value !== 'string' || !value.trim()) {
          return 'Name is required'
        }
        return undefined
      },
    }

    render(
      <DynamicForm {...defaultProps} validationSchema={validationSchema} />
    )

    const nameInput = screen.getByLabelText('Name')

    // Type and then clear to trigger validation
    await user.type(nameInput, 'John')
    await user.clear(nameInput)
    await user.tab() // Trigger blur event

    await waitFor(() => {
      expect(screen.getByText('Name is required')).toBeInTheDocument()
    })
  })
})
