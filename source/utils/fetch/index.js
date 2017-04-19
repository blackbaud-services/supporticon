import axios from 'axios'
import { required } from '../params'
import map from '../map'
import getBaseURL from '../base-url'

const getAxiosInstance = () => (axios.create({
  baseURL: getBaseURL()
}))

export default (
  endpoint = required(),
  params,
  options = {}
) => (
  getAxiosInstance().get(endpoint, {
    params: map(params, options.mappings, options.transforms)
  })
  .then((response) => Promise.resolve(response.data))
  .catch((error) => Promise.reject(error.response))
)
