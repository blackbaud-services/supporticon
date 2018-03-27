import { get, post, put } from '../../../utils/client'
import { getUID, required } from '../../../utils/params'

export const deserializePage = (page) => ({
  active: null,
  campaign: null,
  campaignDate: null,
  charity: null,
  coordinates: null,
  donatationUrl: null,
  expired: null,
  groups: null,
  id: page.Id,
  image: page.Logo,
  name: page.Name,
  raised: page.Amount,
  story: page.ProfileWhy,
  target: page.TargetAmount,
  teamPageId: null,
  url: page.Link,
  uuid: null
})

export const fetchPages = ({
  token = required()
}) => {
  return get('/v1/fundraising/pages', {}, {}, {
    headers: {
      'Authorization': `Basic ${token}`
    }
  })
}

export const searchPages = (params = required()) => {
  const {
    campaign,
    charity,
    event,
    ...args
  } = params

  return get('/v1/onesearch', {
    campaignId: getUID(campaign),
    charityId: getUID(charity),
    eventId: getUID(event),
    i: 'Fundraiser',
    ...args
  }).then((response) => (
    response.GroupedResults &&
    response.GroupedResults.length &&
    response.GroupedResults[0].Results || []
  ))
}

export const fetchPage = (page = required()) => {
  return get(`/v1/fundraising/pages/${page}`)
}

export const createPage = ({
  charityId = required(),
  charityOptIn = required(),
  slug = required(),
  title = required(),
  token = required(),
  activityType,
  attribution,
  causeId,
  charityFunded,
  companyAppealId,
  consistentErrorResponses,
  currency,
  eventDate,
  eventId,
  eventName,
  expiryDate,
  images,
  story,
  summaryWhat,
  summaryWhy,
  reference,
  rememberedPersonReference,
  target,
  teamId,
  theme,
  videos
}) => {
  return put('/v1/fundraising/pages', {
    activityType,
    attribution,
    causeId,
    charityFunded,
    charityId,
    charityOptIn,
    companyAppealId,
    consistentErrorResponses,
    currency,
    eventDate,
    eventId,
    eventName,
    expiryDate,
    images,
    pageShortName: slug,
    pageStory: story,
    pageSummaryWhat: summaryWhat,
    pageSummaryWhy: summaryWhy,
    pageTitle: title,
    reference,
    rememberedPersonReference,
    targetAmount: target,
    teamId,
    theme,
    videos
  }, {
    headers: {
      'Authorization': `Basic ${token}`
    }
  })
}

export const updatePage = (slug = required(), {
  token = required(),
  attribution,
  image,
  story,
  summaryWhat,
  summaryWhy
}) => {
  const config = { headers: { 'Authorization': `Basic ${token}` } }

  return Promise.all([
    attribution && put(`/v1/fundraising/pages/${slug}/attribution`, { attribution }, config),
    image && put(`/v1/fundraising/pages/${slug}/images`, { url: image, isDefault: true }, config),
    story && post(`/v1/fundraising/pages/${slug}`, { storySupplement: story }, config),
    (summaryWhat || summaryWhy) && put(`/v1/fundraising/pages/${slug}/summary`, {
      pageSummaryWhat: summaryWhat,
      pageSummaryWhy: summaryWhy
    }, config)
  ].filter(promise => promise))
}
