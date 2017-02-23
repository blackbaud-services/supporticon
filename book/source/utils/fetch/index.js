import axios from 'axios'
import { required } from '../params'
import map from '../map'

export const instance = axios.create({
  baseURL: 'https://everydayhero-staging.com'
})

export default (
  endpoint = required(),
  params,
  options = {}
) => (
  instance.get(endpoint, {
    params: map(params, options.mappings, options.transforms)
  })
  .then((response) => Promise.resolve(response.data))
  .catch((error) => Promise.reject(error.response))
)
