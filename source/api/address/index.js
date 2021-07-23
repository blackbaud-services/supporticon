import { servicesAPI } from '../../utils/client'
import { required } from '../../utils/params'

export const searchAddress = (postcode = required()) =>
  servicesAPI
    .get(`/v1/justgiving/addresses/search/postcode/${postcode}`)
    .then(response => response.data)

export const getAddressDetails = (id = required()) =>
  servicesAPI
    .get(`/v1/justgiving/addresses/${id}`)
    .then(response => response.data)

export const deserializeAddress = address => ({
  streetAddress: address.AddressLine1,
  extendedAddress: address.AddressLine2,
  locality: address.Town,
  region: address.County,
  postCode: address.Postcode
})
