import lodashGet from 'lodash/get'
import { servicesAPI } from '../../../utils/client'
import { required } from '../../../utils/params'
import { videoRegex } from 'constructicon/lib/oembed'

const getMedia = (post, filterMethod) =>
  lodashGet(lodashGet(post, 'media', []).filter(filterMethod), '[0].url')

export const deserializePost = post => ({
  id: post.id,
  createdAt: post.createdAt,
  message: post.message,
  media: post.media,
  image: getMedia(
    post,
    media => media.__typename === 'ImageMedia' && !videoRegex.test(media.url)
  ),
  type: post.type,
  video:
    getMedia(post, media => media.__typename === 'VideoMedia') ||
    getMedia(post, media => videoRegex.test(media.url))
})

export const fetchPosts = ({ slug = required() }) => {
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
              ... on ImageMedia { url caption }
              ... on VideoMedia { url }
            }
          }
        }
      }
    }
  `

  return servicesAPI
    .post('/v1/justgiving/graphql', { query })
    .then(response => response.data)
    .then(result => lodashGet(result, 'data.page.timeline.nodes', []))
}

export const createPost = ({
  pageId = required(),
  userId = required(),
  message = required(),
  token = required(),
  image,
  video
}) => {
  const headers = {
    Authorization: `Bearer ${token}`
  }

  const imageMedia = image ? `imageMedia: { url: "${image}" }` : ''
  const videoMedia = video ? `videoMedia: { url: "${video}" }` : ''
  const media = image || video ? `media: { ${imageMedia} ${videoMedia} }` : ''

  const query = `
    mutation {
      createTimelineEntry (
        input: {
          type: FUNDRAISING
          pageId: "${pageId}"
          creatorGuid: "${userId}"
          message: "${message}"
          ${media}
        }
      ) {
        id
        message
        createdAt
        media {
          __typename
          ... on ImageMedia { url }
          ... on VideoMedia { url }
        }
      }
    }
  `

  return servicesAPI
    .post('/v1/justgiving/graphql', { query }, { headers })
    .then(response => response.data)
    .then(result => lodashGet(result, 'data.createTimelineEntry'))
}
