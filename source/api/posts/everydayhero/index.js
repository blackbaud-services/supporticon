import { get, post } from '../../../utils/client'
import { required } from '../../../utils/params'

export const deserializePost = post => ({
  id: post.id,
  createdAt: post.created_at,
  message: post.caption,
  page: post.page_id,
  image: post.image_url
})

export const fetchPosts = (params = required()) => {
  const mappings = { type: 'type' }

  return get(
    'api/v2/search/feed',
    { ...params, type: 'Post' },
    { mappings }
  ).then(response => response.results)
}

export const createPost = ({
  message = required(),
  pageId = required(),
  token = required(),
  createdAt,
  image
}) => {
  const headers = { Authorization: `Bearer ${token}` }

  const data = {
    caption: message,
    created_at: createdAt,
    image_url: image || null,
    page_id: pageId
  }

  return post('api/v2/posts', data, { headers })
}
