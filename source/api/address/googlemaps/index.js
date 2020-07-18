import { servicesAPI } from '../../../utils/client'
import { required } from '../../../utils/params'
import get from 'lodash/get'
import find from 'lodash/find'

export const setSessionToken = () =>
  Math.random()
    .toString(36)
    .substring(2, 15) +
  Date.now().toString() +
  Math.random()
    .toString(36)
    .substring(2, 15)

export const deserializePlace = address => {
  const setAddressProp = (type, property = 'long_name') =>
    get(
      find(address.address_components, i => i.types.indexOf(type) !== -1),
      property,
      null
    )

  const line1 = [
    setAddressProp('subpremise'),
    setAddressProp('floor'),
    setAddressProp('room')
  ].reduce((acc, v) => (v !== null ? acc.concat(v) : acc), [])

  const streetAddress =
    setAddressProp('street_address') ||
    (setAddressProp('street_number') !== null
      ? setAddressProp('street_number') + ' '
      : '') + setAddressProp('route')

  return {
    line1: line1.length === 0 ? streetAddress : line1.join(),
    line2: line1.length > 0 ? streetAddress : '',
    townOrCity:
      setAddressProp('locality', 'short_name') ||
      setAddressProp('administrative_area_level_2', 'short_name'),
    countyOrState: setAddressProp('administrative_area_level_1'),
    country: setAddressProp('country'),
    postcodeOrZipcode: setAddressProp('postal_code')
  }
}

export const getAddressSuggestions = ({
  q = required(),
  country,
  sessiontoken
}) =>
  servicesAPI
    .post(`/v1/googlemaps/autocomplete/${q}`, { country, sessiontoken })
    .then(response => response.data)

export const getPlaceDetail = (id = required(), sessiontoken) =>
  servicesAPI
    .post(`/v1/googlemaps/placedetail/${id}`, { sessiontoken })
    .then(response => response.data)
