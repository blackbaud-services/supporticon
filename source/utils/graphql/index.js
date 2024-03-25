import get from 'lodash/get'

export const extractData = (response, path = 'data') => {
  const error = get(response, 'data.errors.0.message')
  if (error) return Promise.reject(error)

  return get(response, path)
}
