import { type FormState, type FormAction } from './types'

// Form Reducer
export const formReducer = (
  state: FormState,
  action: FormAction
): FormState => {
  switch (action.type) {
    case 'SET_FIELD_VALUE':
      return {
        ...state,
        fields: {
          ...state.fields,
          [action.payload.name]: {
            ...state.fields[action.payload.name],
            name: action.payload.name,
            value: action.payload.value,
            error: undefined,
          },
        },
      }

    case 'SET_FIELD_ERROR':
      return {
        ...state,
        fields: {
          ...state.fields,
          [action.payload.name]: {
            ...state.fields[action.payload.name],
            error: action.payload.error,
          },
        },
      }

    case 'SET_FIELD_TOUCHED':
      return {
        ...state,
        fields: {
          ...state.fields,
          [action.payload.name]: {
            ...state.fields[action.payload.name],
            touched: true,
          },
        },
      }

    case 'SET_SUBMITTING':
      return {
        ...state,
        isSubmitting: action.payload,
      }

    case 'SET_SUBMITTED':
      return { ...state, isSubmitted: action.payload }

    case 'SET_SUBMIT_ERROR':
      return { ...state, submitError: action.payload }

    case 'RESET_FORM':
      return {
        fields: {},
        isSubmitting: false,
        isSubmitted: false,
        submitError: undefined,
      }

    default:
      return state
  }
}
