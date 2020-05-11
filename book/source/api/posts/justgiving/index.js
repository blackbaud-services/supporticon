import lodashGet from 'lodash/get'
import { jgGraphqlClient } from '../../../utils/client'
import { required } from '../../../utils/params'

export const deserializePost = post => ({
  id: post.id,
  createdAt: post.createdAt,
  message: post.message,
  media: post.media,
  type: post.type
})

export const fetchPosts = (slug = required()) => {
  const query = `
    {
      page(type: FUNDRAISING, slug: "${slug}") {
        timeline {
          nodes {
            id
            message
            type
            createdAt
            media {
              __typename
              ... on ImageMedia { url caption alt }
              ... on VideoMedia { url posterUrl }
            }
          }
        }
      }
    }
  `

  return jgGraphqlClient
    .post(null, { query })
    .then(response => lodashGet(response.data, 'page.timeline.nodes'), [])
}

export const createPost = ({
  pageId = required(),
  message = required(),
  token = required()
}) => {
  const headers = {
    Authorization: `Bearer ${token}`
  }

  const query = `
    mutation {
      createTimelineEntry (
        input: {
          type: FUNDRAISING
          pageId: ${pageId}
          message: "${message}"
        }
      ) {
        id
        message
        createdAt
      }
    }
  `

  return jgGraphqlClient
    .post(null, { query }, { headers })
    .then(response => lodashGet(response.data, 'createTimelineEntry'))
}
