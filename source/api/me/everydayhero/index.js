import omit from 'lodash/omit'
import { get, put } from '../../../utils/client'
import { required } from '../../../utils/params'

export const deserializeUser = (user) => ({
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
  image: null,
  lastName: user.last_name,
  name: user.name,
  pageCount: user.page_ids.length,
  phone: user.phone,
  uuid: user.uuid
})

export const fetchCurrentUser = ({
  token = required()
}) => (
  get('api/v1/me', { access_token: token })
    .then((data) => data.user)
)

export const updateCurrentUser = ({
  token = required(),
  name,
  address = {},
  birthday,
  phone
}) => (
  put(`api/v1/me?access_token=${token}`, {
    user: {
      name,
      address: address && {
        ...omit(address, ['streetAddress', 'extendedAddress', 'postCode']),
        street_address: address.streetAddress,
        extended_address: address.extendedAddress,
        postal_code: address.postCode
      },
      birthday: birthday,
      phone: phone
    }
  })
)
