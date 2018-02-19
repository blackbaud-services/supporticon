import { get, put } from '../../../utils/client'
import { required } from '../../../utils/params'

export const fetchCurrentUser = ({
  token = required()
}) => (
  get('api/v1/me', { access_token: token })
    .then((data) => data.user)
)

export const updateCurrentUser = ({
  token = required(),
  address,
  birthday,
  phone
}) => (
  put(`api/v1/me?access_token=${token}`, {
    user: {
      address: address,
      birthday: birthday,
      phone: phone
    }
  })
)
