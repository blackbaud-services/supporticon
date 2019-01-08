import { post } from '../../../utils/client'
import { required } from '../../../utils/params'

export const createPost = ({
  pageId = required(),
  caption = required(),
  token = required(),
  createdAt,
  image
}) => {
  const headers = { Authorization: `Bearer ${token}` }

  const data = {
    caption,
    created_at: createdAt,
    image_url: image,
    page_id: pageId
  }

  return post('api/v2/posts', data, { headers })
}
