import { post } from '../../../utils/client'
import { required } from '../../../utils/params'

export const createPost = ({
  slug = required(),
  caption = required(),
  token = required(),
  authType = 'Basic',
  createdAt,
  video
}) =>
  post(
    `/v1/fundraising/pages/${slug}/updates`,
    {
      Message: caption,
      CreatedDate: createdAt,
      Video: video
    },
    {
      headers: {
        Authorization: [authType, token].join(' ')
      }
    }
  )
