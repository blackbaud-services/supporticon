import moment from 'moment'
import lodashGet from 'lodash/get'
import { get, put, isStaging, servicesAPI } from '../../../utils/client'
import { getUID, getShortName, required } from '../../../utils/params'
import jsonDate from '../../../utils/jsonDate'

export const deserializePage = page => {
  const subdomain = isStaging() ? 'www.staging' : 'www'
  const url =
    page.Link ||
    `https://${subdomain}.justgiving.com/fundraising/${page.pageShortName}`

  const getImage = () => {
    if (page.pageImages && page.pageImages.length > 0) {
      return `https://images${subdomain.replace('www', '')}.jg-cdn.com/image/${
        page.pageImages[0]
      }`
    }

    return (
      page.defaultImage ||
      page.Logo ||
      lodashGet(page, 'image.url') ||
      lodashGet(page, 'images[0].url') ||
      `https://${subdomain}.justgiving.com/fundraising/images/user-profile/${lodashGet(
        page,
        'pageOwner.accountId'
      )}`
    )
  }

  return {
    active:
      (!page.status && !page.pageStatus) ||
      [page.status, page.pageStatus].indexOf('Inactive') > -1,
    campaign: page.Subtext || page.eventId || page.EventId,
    campaignDate: jsonDate(page.eventDate) || page.EventDate,
    charity: page.charity || page.CharityId,
    coordinates: null,
    createdAt: jsonDate(page.createdDate) || page.CreatedDate,
    donationUrl: [url, 'donate'].join('/'),
    expired: jsonDate(page.expiryDate) && moment(page.expiryDate).isBefore(),
    groups: null,
    hasUpdatedImage: page.imageCount !== '1',
    id: page.pageId || page.Id,
    image: getImage(),
    name:
      page.title ||
      page.pageTitle ||
      page.Name ||
      lodashGet(page, 'pageOwner.fullName'),
    owner:
      page.owner || page.OwnerFullName || lodashGet(page, 'pageOwner.fullName'),
    raised: parseFloat(
      page.grandTotalRaisedExcludingGiftAid ||
        page.Amount ||
        page.raisedAmount ||
        page.amountRaised ||
        0
    ),
    slug: page.pageShortName,
    story: page.story || page.ProfileWhat || page.ProfileWhy,
    target: parseFloat(
      page.fundraisingTarget ||
        page.TargetAmount ||
        page.targetAmount ||
        page.target ||
        0
    ),
    teamPageId:
      page.teams && page.teams.length > 0 ? page.teams[0].teamGuid : null,
    teamShortName:
      page.teams && page.teams.length > 0 ? page.teams[0].teamShortName : null,
    url,
    uuid: null
  }
}

export const fetchPages = (params = required()) => {
  const {
    allPages,
    authType = 'Basic',
    campaign,
    charity,
    event,
    token,
    userPages,
    ...args
  } = params

  if (userPages && token) {
    return get(
      '/v1/fundraising/pages',
      {},
      {},
      {
        headers: {
          Authorization: [authType, token].join(' ')
        }
      }
    )
  }

  if (allPages && event) {
    const mappings = { limit: 'pageSize' }

    return get(`/v1/event/${getUID(event)}/pages`, args, { mappings }).then(
      response => response.fundraisingPages
    )
  }

  if (allPages && campaign && charity) {
    return get(
      `/v1/campaigns/${getShortName(charity)}/${getShortName(campaign)}/pages`
    ).then(response => response.fundraisingPages)
  }

  if (campaign && !event) {
    return servicesAPI
      .get(`/v1/justgiving/campaigns/${getUID(campaign)}/leaderboard`, {
        params: args
      })
      .then(({ data }) => data.results)
  }

  return get('/v1/onesearch', {
    campaignId: getUID(campaign),
    charityId: getUID(charity),
    eventId: getUID(event),
    i: 'Fundraiser',
    ...args
  }).then(
    response =>
      (response.GroupedResults &&
        response.GroupedResults.length &&
        response.GroupedResults[0].Results) ||
      []
  )
}

export const fetchPage = (page = required(), slug) => {
  const endpoint = slug ? 'pages' : isNaN(page) ? 'pages' : 'pagebyid'
  return get(`/v1/fundraising/${endpoint}/${page}`)
}

export const fetchPageDonationCount = (page = required()) => {
  return get(`/v1/fundraising/pages/${page}/donations`).then(
    data => data.pagination.totalResults
  )
}

export const createPage = ({
  charityId = required(),
  slug = required(),
  title = required(),
  token = required(),
  activityType,
  attribution,
  authType = 'Basic',
  campaignId,
  campaignGuid,
  causeId,
  charityFunded,
  charityOptIn = false,
  companyAppealId,
  consistentErrorResponses,
  currency,
  customCodes,
  eventDate,
  eventId,
  eventName,
  expiryDate,
  giftAid,
  images,
  reference,
  rememberedPersonReference,
  story,
  summaryWhat,
  summaryWhy,
  target,
  teamId,
  theme,
  videos
}) => {
  return put(
    '/v1/fundraising/pages',
    {
      activityType,
      attribution,
      campaignGuid: campaignGuid || campaignId,
      causeId,
      charityFunded,
      charityId,
      charityOptIn,
      companyAppealId,
      consistentErrorResponses,
      currency,
      customCodes,
      eventDate,
      eventId,
      eventName,
      expiryDate,
      images,
      isGiftAidable: giftAid,
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
    },
    {
      headers: {
        Authorization: [authType, token].join(' ')
      }
    }
  )
}

export const updatePage = (
  slug = required(),
  {
    token = required(),
    attribution,
    authType = 'Basic',
    image,
    name,
    story,
    summaryWhat,
    summaryWhy,
    target
  }
) => {
  const config = { headers: { Authorization: [authType, token].join(' ') } }

  return Promise.all(
    [
      attribution &&
        put(
          `/v1/fundraising/pages/${slug}/attribution`,
          { attribution },
          config
        ),
      image &&
        put(
          `/v1/fundraising/pages/${slug}/images`,
          { url: image, isDefault: true },
          config
        ),
      name &&
        put(
          `/v1/fundraising/pages/${slug}/pagetitle`,
          { pageTitle: name },
          config
        ),
      story &&
        put(`/v1/fundraising/pages/${slug}/pagestory`, { story }, config),
      target &&
        put(`/v1/fundraising/pages/${slug}/target`, { amount: target }, config),
      (summaryWhat || summaryWhy) &&
        put(
          `/v1/fundraising/pages/${slug}/summary`,
          {
            pageSummaryWhat: summaryWhat,
            pageSummaryWhy: summaryWhy
          },
          config
        )
    ].filter(promise => promise)
  )
}