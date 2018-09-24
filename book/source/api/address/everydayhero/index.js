import { get } from '../../../utils/client'
import { required } from '../../../utils/params'

export const searchAddress = (query = required(), region = 'au') => {
  const params = { q: query, country_code: region }

  return get('api/v2/addresses', params).then(data => data.addresses)
}

export const getAddressDetails = (id = required(), region = 'au') => {
  return get(`api/v2/addresses/${region}/${id}`).then(data => data.address)
}

export const deserializeAddress = address => ({
  streetAddress: address.street_address,
  extendedAddress: address.extendedAddress,
  locality: address.locality,
  region: address.region,
  postCode: address.postal_code
})
