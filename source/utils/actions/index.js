import { required } from '../params'

const defaultFetch = (type, params) => ({
  type,
  payload: { params }
})

const defaultFetchSuccess = (type, data) => ({
  type,
  payload: { data }
})

const defaultFetchFailure = (type, error) => ({
  type,
  payload: { error }
})

export const createAction = ({
  fetcher = required(),
  params = required(),
  namespace = required(),
  options = {}
}) => (dispatch) => {
  const c = {
    FETCH: `${namespace}/FETCH`,
    FETCH_SUCCESS: `${namespace}/FETCH_SUCCESS`,
    FETCH_FAILURE: `${namespace}/FETCH_FAILURE`
  }

  const {
    fetch = defaultFetch,
    fetchSuccess = defaultFetchSuccess,
    fetchFailure = defaultFetchFailure
  } = options

  dispatch(fetch(c.FETCH, params))

  return fetcher(params)
    .then((data) => {
      dispatch(fetchSuccess(c.FETCH_SUCCESS, data))
      return Promise.resolve(data)
    })
    .catch((error) => {
      dispatch(fetchFailure(c.FETCH_FAILURE, error))
      return Promise.reject(error)
    })
}
