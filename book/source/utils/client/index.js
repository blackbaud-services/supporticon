import axios from 'axios'
import { required } from '../params'
import map from '../map'

const defaults = {
  baseURL: process.env.SUPPORTICON_BASE_URL || 'https://everydayhero.com'
}

export const instance = axios.create(defaults)

export const get = (endpoint = required(), params, options = {}, config = {}) =>
  instance
    .get(endpoint, { params: map(params, options), ...config })
    .then(response => response.data)
    .catch(error => Promise.reject(error.response))

export const post = (endpoint = required(), data, config = {}) =>
  instance
    .post(endpoint, data, config)
    .then(response => response.data)
    .catch(error => Promise.reject(error.response))

export const put = (endpoint = required(), data, config = {}) =>
  instance
    .put(endpoint, data, config)
    .then(response => response.data)
    .catch(error => Promise.reject(error.response))

export const updateClient = (options = {}) => {
  Object.keys(options).map(option => {
    instance.defaults[option] = options[option]
  })
}

export const getBaseURL = () => instance.defaults.baseURL

export const getPlatform = () =>
  /justgiving/.test(instance.defaults.baseURL) ? 'justgiving' : 'everydayhero'

export const isJustGiving = () => /justgiving/.test(instance.defaults.baseURL)

export default {
  instance,
  get,
  post,
  put,
  updateClient,
  getBaseURL,
  getPlatform,
  isJustGiving
}
