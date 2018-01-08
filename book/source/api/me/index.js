import { get, put, isJustGiving } from '../../utils/client'
import { required } from '../../utils/params'

export const c = {
  ENDPOINT: 'api/v1/me'
}

export const fetchCurrentUser = ({
  token = required()
}) => {
  if (isJustGiving()) return Promise.reject('This method is not supported for JustGiving')

  return get(c.ENDPOINT, { access_token: token })
    .then((data) => data.user)
}

export const updateCurrentUser = ({
  token = required(),
  address,
  birthday,
  phone
}) => {
  if (isJustGiving()) return Promise.reject('This method is not supported for JustGiving')

  return put(`${c.ENDPOINT}?access_token=${token}`, {
    user: {
      address: address,
      birthday: birthday,
      phone: phone
    }
  })
}
