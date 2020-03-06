import { jgClient } from '../../../utils/client'
import { required } from '../../../utils/params'

export const searchAddress = (postcode = required()) => {
  console.log('hello')

  return jgClient
    .get(`/address/paf-tuples-by-postcode/${postcode}`)
    .then(({ data }) => {
      if (data.IsSuccess) {
        return data.IsMultiple ? data.MultipleAddresses : [data.OneAddress]
      }

      return []
    })
}

export const getAddressDetails = (id = required()) =>
  jgClient.get(`/address/paf-by-id/${id}`).then(({ data }) => data.OneAddress)

export const deserializeAddress = address => ({
  streetAddress: address.AddressLine1,
  extendedAddress: address.AddressLine2,
  locality: address.Town,
  region: address.County,
  postCode: address.Postcode
})
