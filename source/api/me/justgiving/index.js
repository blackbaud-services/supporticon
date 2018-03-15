import { get, put } from '../../../utils/client'
import { required } from '../../../utils/params'

const countryCode = (country) => {
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
}) => [line1, line2, townOrCity, countyOrState, postcodeOrZipcode, country].join(', ')

export const deserializeUser = (user) => ({
  address: {
    streetAddress: user.address.line1,
    extendedAddress: user.address.line2,
    locality: user.address.townOrCity,
    state: user.address.countyOrState,
    postcode: user.postcodeOrZipcode,
    country: user.address.country
  },
  birthday: null,
  country: user.country,
  countryCode: countryCode(user.country),
  email: user.email,
  firstName: user.firstName,
  formattedAddress: formattedAddress(user.address),
  id: user.accountId,
  image: user.profileImageUrls.length ? user.profileImageUrls[0]['Value'] : null,
  lastName: user.lastName,
  name: [user.firstName, user.lastName].join(' '),
  pageCount: user.activePageCount,
  phone: null,
  uuid: user.userId
})

export const fetchCurrentUser = ({
  token = required()
}) => (
  get('v1/account', {}, {}, {
    headers: {
      'Authorization': `Basic ${token}`
    }
  })
)

export const updateCurrentUser = ({
  token = required(),
  userId = required(),
  email = required(),
  firstName,
  lastName,
  address
}) => (
  put(`v1/account/${userId}`, {
    firstName,
    lastName,
    email,
    address
  }, {
    headers: {
      'Authorization': `Basic ${token}`
    }
  })
)
