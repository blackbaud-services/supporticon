import lodashGet from 'lodash/get'
import { get, post, destroy } from '../../../utils/client'
import { required } from '../../../utils/params'
import { videoRegex } from 'constructicon/lib/oembed'

export const deserializePost = post => ({
  id: post.id,
  createdAt: post.created_at,
  message: post.caption
    .split('\n\n')
    .filter(item => !videoRegex.test(item.trim()))
    .join('\n\n'),
  page: post.page_id,
  image: post.image_url,
  video: lodashGet(post.caption.match(videoRegex), '[0]')
})

export const fetchPosts = (params = required()) => {
  const mappings = {
    page: 'page_id',
    team: 'team_id',
    type: 'type',
    index: 'page'
  }

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
  image,
  video
}) => {
  const headers = { Authorization: `Bearer ${token}` }

  const data = {
    caption: [message, video].filter(Boolean).join('\n\n'),
    created_at: createdAt,
    image_url: image || null,
    page_id: pageId
  }

  return post('api/v2/posts', data, { headers }).then(data => data.post)
}

export const deletePost = ({ id = required(), token = required() }) =>
  destroy(`api/v2/posts/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  })
