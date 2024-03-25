import get from 'lodash/get'

export const getErrorMessage = error =>
  get(error, 'data.error.message') ||
  get(error, 'data.errorMessage') ||
  get(error, 'message') ||
  'There was an unexpected error'
