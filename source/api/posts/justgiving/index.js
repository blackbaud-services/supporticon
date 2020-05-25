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

export const fetchPosts = ({
  slug = required(),
  allPosts = false,
  after,
  results = [],
  type = 'FUNDRAISING'
}) => {
  const query = `
    {
      page(type: "${type}", slug: "${slug}") {
        timeline${after ? `(after: "${after}") ` : ' '} {
          pageInfo {
            hasNextPage
            endCursor
          }
          nodes {
            id
            legacyId
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
    .then(result => {
      const data = lodashGet(result, 'data.page.timeline', {})
      const { pageInfo = {}, nodes = [] } = data
      const updatedResults = [...results, ...nodes]

      if (allPosts && pageInfo.hasNextPage) {
        return fetchPosts({
          slug,
          after: pageInfo.endCursor,
          results: updatedResults,
          allPosts: true
        })
      } else {
        return updatedResults
      }
    })
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
