import { post } from '../../../utils/client'
import { required } from '../../../utils/params'

export const fetchDonation = () =>
  Promise.reject(new Error('This method is not supported by Everydayhero'))

export const replyToDonation = ({
  pageId = required(),
  donationId = required(),
  caption = required(),
  token = required()
}) => {
  const headers = { Authorization: `Bearer ${token}` }
  return post(
    `api/v2/pages/${pageId}/donations/${donationId}/comments`,
    { caption },
    { headers }
  )
}
