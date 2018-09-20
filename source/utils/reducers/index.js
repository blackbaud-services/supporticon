import { required } from '../params'

export const createReducer = ({
  namespace = required(),
  initialState = {},
  handlers = {},
  deserialize = data => data
}) => {
  const c = {
    FETCH: `${namespace}/FETCH`,
    FETCH_SUCCESS: `${namespace}/FETCH_SUCCESS`,
    FETCH_FAILURE: `${namespace}/FETCH_FAILURE`
  }

  const defaultFetch = state => ({
    ...state,
    status: 'fetching'
  })

  const defaultFetchFailure = state => ({
    ...state,
    status: 'failed'
  })

  const defaultFetchSuccess = (state, { data }) => ({
    ...state,
    status: 'fetched',
    data: Array.isArray(data) ? data.map(deserialize) : deserialize(data)
  })

  const {
    fetch = defaultFetch,
    fetchSuccess = defaultFetchSuccess,
    fetchFailure = defaultFetchFailure
  } = handlers

  const actionHandlers = {
    [c.FETCH]: fetch,
    [c.FETCH_FAILURE]: fetchFailure,
    [c.FETCH_SUCCESS]: fetchSuccess
  }

  return (state = initialState, { type, payload }) => {
    const handler = actionHandlers[type]
    return typeof handler === 'function' ? handler(state, payload) : state
  }
}
