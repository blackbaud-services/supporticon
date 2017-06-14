import { get, put } from '../../utils/client'
import { required } from '../../utils/params'

export const c = {
  ENDPOINT: 'api/v1/me',
  NAMESPACE: 'app/me'
}

export const fetchCurrentUser = ({
  token = required()
}) => {
  return get(c.ENDPOINT, { access_token: token })
    .then((data) => data.user)
}

export const updateCurrentUser = ({
  token = required(),
  address,
  birthday,
  phone
}) => {
  return put(`${c.ENDPOINT}?access_token=${token}`, {
    user: {
      address: address,
      birthday: birthday,
      phone: phone
    }
  })
}
