import omit from 'lodash/omit'
import { get, put } from '../../../utils/client'
import { required } from '../../../utils/params'

const imageUrl = user =>
  `https://supporter-1.cdn.everydayhero.com/assets/users/images/large/avatars/${[
    user.first_name[0],
    user.last_name[0]
  ]
    .join('')
    .toUpperCase()}_C6D152.png`

export const deserializeUser = user => ({
  address: {
    streetAddress: user.street_address,
    extendedAddress: user.extended_address,
    locality: user.locality,
    state: user.state,
    postcode: user.postcode,
    country: user.country_name
  },
  birthday: user.birthday,
  country: user.country_name,
  countryCode: user.country_code,
  email: user.email,
  firstName: user.first_name,
  formattedAddress: user.formattedAddress,
  id: user.id,
  image: user.image_url || imageUrl(user),
  lastName: user.last_name,
  name: user.name,
  pageCount: user.page_ids.length,
  phone: user.phone,
  uuid: user.uuid
})

export const fetchCurrentUser = ({ token = required() }) =>
  get('api/v1/me', { access_token: token }).then(data => data.user)

export const updateCurrentUser = ({
  token = required(),
  name,
  address = {},
  birthday,
  phone,
  nickname
}) =>
  put(`api/v1/me?access_token=${token}`, {
    user: {
      name,
      address: address && {
        street_address: address.streetAddress,
        extended_address: address.extendedAddress,
        postal_code: address.postCode,
        ...omit(address, ['streetAddress', 'extendedAddress', 'postCode'])
      },
      birthday,
      phone,
      nickname
    }
  })
