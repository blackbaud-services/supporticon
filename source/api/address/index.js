import { isJustGiving } from '../../utils/client'

import {
  getAddressDetails as getEDHAddressDetails,
  searchAddress as searchEDHAddress,
  deserializeAddress as deserializeEDHAddress
} from './everydayhero'

import {
  getAddressDetails as getJGAddressDetails,
  searchAddress as searchJGAddress,
  deserializeAddress as deserializeJGAddress
} from './justgiving'

/**
* @function search an address
*/
export const searchAddress = (query, region) => (
  isJustGiving()
    ? searchJGAddress(query, region)
    : searchEDHAddress(query, region)
)

/**
* @function get address details
*/
export const getAddressDetails = (id, region) => (
  isJustGiving()
    ? getJGAddressDetails(id, region)
    : getEDHAddressDetails(id, region)
)

/**
* @function deserialize an address
*/
export const deserializeAddress = (address) => (
  isJustGiving()
    ? deserializeJGAddress(address)
    : deserializeEDHAddress(address)
)
