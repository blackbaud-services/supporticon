import { get, put, jgIdentityClient } from '../../utils/client'
import { required } from '../../utils/params'

const countryCode = country => {
  switch (country) {
    case 'Australia':
      return 'AU'
    case 'United States':
      return 'US'
    case 'Ireland':
      return 'IE'
    case 'New Zealand':
      return 'NZ'
    case 'Hong Kong':
      return 'HK'
    case 'United Kingdom':
      return 'GB'
    default:
      return 'GB'
  }
}

const formattedAddress = ({
  line1,
  line2,
  townOrCity,
  countyOrState,
  postcodeOrZipcode,
  country
}) =>
  [line1, line2, townOrCity, countyOrState, postcodeOrZipcode, country].join(
    ', '
  )

export const deserializeUser = user => ({
  address: user.address
    ? {
      streetAddress: user.address.line1,
      extendedAddress: user.address.line2,
      locality: user.address.townOrCity,
      state: user.address.countyOrState,
      postcode: user.address.postcodeOrZipcode,
      country: user.address.country
    }
    : {},
  birthday: null,
  country: user.country,
  countryCode: countryCode(user.country),
  email: user.email,
  firstName: user.firstName || user.given_name,
  formattedAddress: user.address ? formattedAddress(user.address) : null,
  id: user.accountId || user.justgiving_consumer_id,
  image:
    user.profileImageUrls && user.profileImageUrls.length
      ? user.profileImageUrls[0]['Value']
      : 'https://assets.blackbaud-sites.com/images/supporticon/user.svg',
  lastName: user.lastName || user.family_name,
  name: user.name || [user.firstName, user.lastName].join(' '),
  pageCount: user.activePageCount,
  phone: null,
  uuid: user.userId || user.sub
})

export const fetchCurrentUser = ({
  token = required(),
  authType = 'Basic'
}) => {
  if (authType === 'Basic' || token.length > 32) {
    return get(
      'v1/account',
      {},
      {},
      {
        headers: {
          Authorization: [authType, token].join(' ')
        }
      }
    )
  } else {
    return jgIdentityClient
      .get('connect/userinfo', {
        headers: {
          Authorization: [authType, token].join(' ')
        }
      })
      .then(response => response.data)
  }
}

export const updateCurrentUser = ({
  token = required(),
  uuid = required(),
  email = required(),
  authType = 'Basic',
  firstName,
  lastName,
  address = {}
}) =>
  put(
    `v1/account/${uuid}`,
    {
      firstName,
      lastName,
      email,
      address: {
        line1: address.line1 || address.streetAddress,
        line2: address.line2 || address.extendedAddress,
        townOrCity: address.townOrCity || address.locality,
        countyOrState: address.countyOrState || address.region,
        postcodeOrZipcode: address.postcodeOrZipcode || address.postCode,
        country: address.country
      }
    },
    {
      headers: {
        Authorization: [authType, token].join(' ')
      }
    }
  )
