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

export const destroy = (endpoint = required(), config = {}) =>
  instance
    .delete(endpoint, config)
    .then(response => response.data)
    .catch(error => Promise.reject(error.response))

export const updateClient = (options = {}) => {
  Object.keys(options).map(option => {
    instance.defaults[option] = options[option]
  })

  updateServicesAPIClient()
  updateMetadataAPIClient()
  updateJGIdentityClient()
  updateImagesAPIClient()
}

export const getBaseURL = () => instance.defaults.baseURL

export const getPlatform = () =>
  /justgiving/.test(instance.defaults.baseURL) ? 'justgiving' : 'everydayhero'

export const isJustGiving = () => /justgiving/.test(instance.defaults.baseURL)
export const isStaging = () => /staging/.test(instance.defaults.baseURL)

// Services API Client
export const servicesAPI = axios.create({
  baseURL: 'https://api.blackbaud.services'
})

const updateServicesAPIClient = () => {
  servicesAPI.defaults.baseURL = isStaging()
    ? 'https://api-staging.blackbaud.services'
    : 'https://api.blackbaud.services'
}

// Metadata API Client
export const metadataAPI = axios.create({
  baseURL: 'https://metadata.blackbaud.services'
})

const updateMetadataAPIClient = () => {
  metadataAPI.defaults.baseURL = isJustGiving()
    ? isStaging()
      ? 'https://metadata-staging.blackbaud.services'
      : 'https://metadata.blackbaud.services'
    : isStaging()
      ? 'https://mds.everydayhero-staging.io'
      : 'https://mds-engineering.everydayhero.com'
}

// JG Images Client
export const imagesAPI = axios.create({
  baseURL: 'https://images.justgiving.com'
})

const updateImagesAPIClient = () => {
  imagesAPI.defaults.baseURL = isStaging()
    ? 'https://images.staging.justgiving.com'
    : 'https://images.justgiving.com'
}

// JG Identity Client
export const jgIdentityClient = axios.create({
  baseURL: 'https://identity.justgiving.com'
})

const updateJGIdentityClient = () => {
  jgIdentityClient.defaults.baseURL = isStaging()
    ? 'https://identity.staging.justgiving.com'
    : 'https://identity.justgiving.com'
}

export default {
  instance,
  get,
  post,
  put,
  destroy,
  updateClient,
  getBaseURL,
  getPlatform,
  isJustGiving,
  isStaging,
  servicesAPI,
  metadataAPI,
  imagesAPI,
  jgIdentityClient
}
