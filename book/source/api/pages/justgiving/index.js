import moment from 'moment'
import lodashGet from 'lodash/get'
import { get, put } from '../../../utils/client'
import { getUID, required } from '../../../utils/params'
import jsonDate from '../../../utils/jsonDate'

export const deserializePage = (page) => {
  const url = page.Link || `https://${page.domain || 'www.justgiving.com'}/fundraising/${page.pageShortName}`

  return {
    active: page.status === 'Active',
    campaign: page.eventId || page.EventId,
    campaignDate: jsonDate(page.eventDate) || page.EventDate,
    charity: page.charity || page.CharityId,
    coordinates: null,
    createdAt: jsonDate(page.createdDate) || page.CreatedDate,
    donationUrl: [url, 'donate'].join('/'),
    expired: jsonDate(page.expiryDate) && moment(page.expiryDate).isBefore(),
    groups: null,
    id: page.pageId || page.Id,
    image: page.defaultImage || page.Logo || lodashGet(page, 'image.url'),
    name: page.title || page.Name,
    owner: page.owner || page.OwnerFullName,
    raised: parseFloat(page.grandTotalRaisedExcludingGiftAid || page.Amount || 0),
    slug: page.pageShortName,
    story: page.story || page.ProfileWhat || page.ProfileWhy,
    target: parseFloat(page.fundraisingTarget || page.TargetAmount || 0),
    teamPageId: null,
    url,
    uuid: null
  }
}

export const fetchPages = (params = required()) => {
  const {
    campaign,
    charity,
    event,
    userPages,
    token,
    authType = 'Basic',
    ...args
  } = params

  if (userPages && token) {
    return get('/v1/fundraising/pages', {}, {}, {
      headers: {
        'Authorization': [authType, token].join(' ')
      }
    })
  }

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
  const endpoint = isNaN(page) ? 'pages' : 'pagebyid'
  return get(`/v1/fundraising/${endpoint}/${page}`)
}

export const createPage = ({
  charityId = required(),
  charityOptIn = required(),
  slug = required(),
  title = required(),
  token = required(),
  authType = 'Basic',
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
      'Authorization': [authType, token].join(' ')
    }
  })
}

export const updatePage = (slug = required(), {
  token = required(),
  authType = 'Basic',
  attribution,
  image,
  name,
  story,
  summaryWhat,
  summaryWhy,
  target
}) => {
  const config = { headers: { 'Authorization': [authType, token].join(' ') } }

  return Promise.all([
    attribution && put(`/v1/fundraising/pages/${slug}/attribution`, { attribution }, config),
    image && put(`/v1/fundraising/pages/${slug}/images`, { url: image, isDefault: true }, config),
    name && put(`/v1/fundraising/pages/${slug}/pagetitle`, { pageTitle: name }, config),
    story && put(`/v1/fundraising/pages/${slug}/pagestory`, { story }, config),
    target && put(`/v1/fundraising/pages/${slug}/target`, { amount: target }, config),
    (summaryWhat || summaryWhy) && put(`/v1/fundraising/pages/${slug}/summary`, {
      pageSummaryWhat: summaryWhat,
      pageSummaryWhy: summaryWhy
    }, config)
  ].filter(promise => promise))
}
