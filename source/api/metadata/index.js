import { isJustGiving } from '../../utils/client'
import { required } from '../../utils/params'

import {
  deserializeMetadata as deserializeJGMetadata,
  fetchMetadata as fetchJGMetadata,
  createMetadata as createJGMetadata,
  updateMetadata as updateJGMetadata
} from './justgiving'

import {
  deserializeMetadata as deserializeEDHMetadata,
  fetchMetadata as fetchEDHMetadata,
  createMetadata as createEDHMetadata,
  updateMetadata as updateEDHMetadata
} from './everydayhero'

export const deserializeMetadata = (data = required()) =>
  isJustGiving() ? deserializeJGMetadata(data) : deserializeEDHMetadata(data)

export const fetchMetadata = (params = required()) =>
  isJustGiving() ? fetchJGMetadata(params) : fetchEDHMetadata(params)

export const createMetadata = (params = required()) =>
  isJustGiving() ? createJGMetadata(params) : createEDHMetadata(params)

export const updateMetadata = (params = required()) =>
  isJustGiving() ? updateJGMetadata(params) : updateEDHMetadata(params)
