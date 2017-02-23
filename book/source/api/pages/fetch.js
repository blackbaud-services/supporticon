import fetch from '../../utils/fetch'
import { createAction } from '../../utils/actions'
import { required } from '../../utils/params'
import c from './constants'

export const fetchPages = (params = required()) => {
  return fetch(c.ENDPOINT, params)
    .then((response) => response.pages)
}

export const fetchPagesAction = (params, options = {}) => {
  const {
    namespace = c.NAMESPACE,
    ...remainingOptions
  } = options

  return createAction({
    fetcher: fetchPages,
    params,
    namespace,
    options: remainingOptions
  })
}
