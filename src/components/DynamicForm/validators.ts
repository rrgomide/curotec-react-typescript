export const validators = {
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
