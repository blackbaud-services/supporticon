import moment from 'moment'
import chunk from 'lodash/chunk'
import first from 'lodash/first'
import flattenDeep from 'lodash/flattenDeep'
import lodashGet from 'lodash/get'
import lodashFilter from 'lodash/filter'
import slugify from 'slugify'
import { v4 as uuid } from 'uuid'
import { get, post, put, servicesAPI } from '../../../utils/client'
import { apiImageUrl, baseUrl, imageUrl } from '../../../utils/justgiving'
import {
  getUID,
  isEqual,
  isEmpty,
  isUuid,
  required
} from '../../../utils/params'
import { defaultPageTags } from '../../../utils/tags'
import { deserializeFitnessActivity } from '../../fitness-activities/justgiving'
import { fetchTotals, deserializeTotals } from '../../../utils/totals'
import jsonDate from '../../../utils/jsonDate'

export const pageNameRegex = /[^\w\s',-]/gi

export const deserializePage = page => {
  const shortName =
    page.shortName || page.pageShortName || (page.LinkPath || '').substring(1)

  const getImage = () => {
    return (
      page.defaultImage ||
      page.Logo ||
      page.Photo ||
      imageUrl(page.photo) ||
      imageUrl(lodashGet(page, 'pageImages[0]')) ||
      lodashGet(page, 'image.url') ||
      lodashGet(page, 'images[0].url') ||
      apiImageUrl(shortName)
    )
  }

  const getQrCodes = page => {
    const images = lodashGet(page, 'media.images', [])
    return lodashFilter(images, image => image.caption === 'qrcode')
  }

  const isOnlinePresent = typeof page.totalRaisedOnline !== 'undefined'
  const onlineAmount = isOnlinePresent
    ? parseFloat(page.totalRaisedOnline)
    : parseFloat(page.Amount || page.raisedAmount || page.amountRaised || 0)

  const offlineAmount = parseFloat(page.totalRaisedOffline || 0)
  const status = page.status || page.pageStatus
  const id = page.pageId || page.Id

  return {
    active: status ? ['Inactive', 'Cancelled'].indexOf(status) === -1 : true,
    campaign: page.campaignGuid || page.Subtext || page.eventId || page.EventId,
    campaignDate: jsonDate(page.eventDate) || page.EventDate,
    charity: page.charity || page.CharityId || page.charityId,
    charityId: lodashGet(page, 'charity.id') || page.CharityId,
    coordinates: null,
    createdAt: jsonDate(page.createdDate) || page.CreatedDate,
    currencyCode: page.currencyCode,
    currencySymbol: page.currencySymbol,
    donationUrl: id
      ? `${baseUrl('link')}/v1/fundraisingpage/donate/pageId/${id}`
      : `${baseUrl('www')}/fundraising/${shortName}/donate`,
    event: page.Subtext || page.eventId || page.EventId || page.eventName,
    expired: jsonDate(page.expiryDate) && moment(page.expiryDate).isBefore(),
    fitness: page.fitness || {},
    fitnessActivities: lodashGet(page, 'fitness.activities', []).map(
      deserializeFitnessActivity
    ),
    fitnessGoal: parseInt(page.pageSummaryWhat) || 0,
    fitnessDistanceTotal:
      lodashGet(page, 'fitness.totalAmount', 0) ||
      lodashGet(page, 'fitness.distance', 0),
    fitnessDurationTotal:
      lodashGet(page, 'fitness.totalAmountTaken', 0) ||
      lodashGet(page, 'fitness.duration', 0),
    fitnessElevationTotal:
      lodashGet(page, 'fitness.totalAmountElevation', 0) ||
      lodashGet(page, 'fitness.elevation', 0),
    fitnessSettings: lodashGet(page, 'fitness.pageFitnessSettings'),
    groups: null,
    hasUpdatedImage:
      page.imageCount &&
      parseInt(page.imageCount - getQrCodes(page).length) > 1,
    id,
    image:
      getImage() &&
      getImage().split('?')[0] + '?template=CrowdfundingOwnerAvatar',
    name:
      page.title ||
      page.pageTitle ||
      page.Name ||
      page.name ||
      page.PageName ||
      lodashGet(page, 'pageOwner.fullName'),
    owner: page.owner
      ? !lodashGet(page, 'owner.firstName')
        ? page.owner
        : lodashGet(page, 'owner.firstName') +
          ' ' +
          lodashGet(page, 'owner.lastName')
      : page.OwnerFullName ||
        page.PageOwner ||
        page.pageOwner ||
        lodashGet(page, 'pageOwner.fullName'),
    qrCodes: getQrCodes(page),
    raised: onlineAmount + offlineAmount,
    raisedOnline: onlineAmount,
    raisedOffline: offlineAmount,
    segmentation: deserializeSegmentation(page.tags),
    slug: shortName,
    story: page.story || page.ProfileWhat || page.ProfileWhy,
    tags: page.tags || [],
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
    type: page.type || 'individual',
    url: page.Link || page.PageUrl || `${baseUrl()}/fundraising/${shortName}`,
    uuid: page.pageGuid || page.fundraisingPageGuid
  }
}

const deserializeSegmentation = (tags = []) => {
  return tags.reduce((segments, tag) => {
    const key = lodashGet(tag, 'tagDefinition.id')
    const value = lodashGet(tag, 'value')

    return {
      ...segments,
      [key]: value
    }
  }, {})
}

const recursivelyFetchJGPages = ({
  campaign,
  q,
  limit = 10,
  results = [],
  page = 1
}) => {
  const options = {
    params: { page, q }
  }
  return servicesAPI
    .get(`/v1/justgiving/campaigns/${campaign}/pages`, options)
    .then(response => response.data)
    .then(data => {
      const { currentPage, totalPages } = data.meta
      const updatedResults = [...results, ...data.results]

      if (
        Number(currentPage) === totalPages ||
        updatedResults.length >= limit ||
        totalPages === 0
      ) {
        return updatedResults
      } else {
        page++
        return recursivelyFetchJGPages({
          campaign,
          q,
          limit,
          results: updatedResults,
          page
        })
      }
    })
}

export const fetchPages = (params = required()) => {
  const {
    allPages,
    authType = 'Basic',
    campaign,
    charity,
    event,
    ids,
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

  if (allPages && ids) {
    const pageIds = Array.isArray(ids) ? ids : ids.split(',')

    if (pageIds.filter(isUuid).length === pageIds.length) {
      return Promise.all(
        chunk(pageIds, 20).map(guids =>
          servicesAPI
            .get('/v1/justgiving/proxy/fundraising/v2/pages/bulk', {
              params: { pageGuids: guids.join(',') }
            })
            .then(response => response.data.results)
        )
      )
        .then(results => flattenDeep(results))
        .then(results => results.filter(page => page.status === 'Active'))
    }

    return Promise.all(pageIds.map(fetchPage))
  }

  if (allPages && event) {
    const mappings = { limit: 'pageSize' }

    return get(`/v1/event/${getUID(event)}/pages`, args, { mappings })
      .then(response => response.fundraisingPages)
      .then(pages =>
        pages.map(page => ({
          ...page,
          totalRaisedOffline: page.raisedAmount - page.totalRaisedOnline
        }))
      )
  }

  if (!isEmpty(campaign) && !event) {
    return recursivelyFetchJGPages({ campaign: getUID(campaign), ...args })
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

export const fetchPage = (page = required(), slug, options = {}) => {
  const endpoint = slug ? 'pages' : isNaN(page) ? 'pages' : 'pagebyid'

  const fetchers = [
    new Promise(resolve =>
      get(`/v1/fundraising/${endpoint}/${page}`).then(
        page =>
          options.includeFitness
            ? fetchPageFitness(page, options.fitnessParams).then(fitness =>
              resolve({ ...page, fitness })
            )
            : resolve(page)
      )
    ),
    options.includeTags && fetchPageTags(page)
  ]

  return Promise.all(fetchers).then(([page, tags]) => ({
    ...page,
    ...tags
  }))
}

export const fetchUserPages = ({
  authType = 'Basic',
  campaign,
  charity,
  event,
  token = required()
}) => {
  const headers = {
    Authorization: [authType, token].join(' ')
  }

  const filterByCampaign = (pages, campaign) =>
    campaign
      ? pages.filter(page => isEqual(page.campaignGuid, campaign))
      : pages

  const filterByCharity = (pages, charity) =>
    charity ? pages.filter(page => isEqual(page.charityId, charity)) : pages

  const filterByEvent = (pages, event) =>
    event ? pages.filter(page => isEqual(page.eventId, event)) : pages

  return get('/v1/fundraising/pages', {}, {}, { headers })
    .then(pages => filterByCampaign(pages, campaign))
    .then(pages => filterByCharity(pages, charity))
    .then(pages => filterByEvent(pages, event))
}

export const fetchPageTags = page => {
  return get(`v1/tags/${page}`)
}

const fetchPageFitness = (
  page,
  { limit = 100, offset = 0, startDate, endDate, useLegacy = true } = {}
) => {
  const slug = typeof page === 'object' ? page.pageShortName : page

  if (useLegacy) {
    const params = { limit, offset, start: startDate, end: endDate }
    return get(`/v1/fitness/fundraising/${slug}`, params)
  }

  return fetchTotals({
    segment: 'page:totals',
    tagId: 'page:totals',
    tagValue: `page:fundraising:${page.pageGuid}`
  }).then(deserializeTotals)
}

export const fetchPageDonationCount = (page = required()) => {
  return get(`/v1/fundraising/pages/${page}/donations`).then(
    data => data.pagination.totalResults
  )
}

const truncate = (string, length = 50) => {
  if (string) {
    return String(string).length > length
      ? String(string)
        .substring(0, length - 3)
        .trim() + '...'
      : String(string)
  }

  return undefined
}

export const createPageTag = ({
  id = required(),
  label = required(),
  slug = required(),
  value = required(),
  aggregation = []
}) => {
  const request = () =>
    post(
      `/v1/tags/${slug}`,
      {
        aggregation,
        id,
        label,
        value
      },
      {
        timeout: 5000
      }
    )

  return request().catch(() => request()) // Retry if request fails
}

export const createPageTags = page => {
  const request = () =>
    post(
      `/v1/tags/${page.slug}/multiple`,
      {
        tagValues: defaultPageTags(page)
      },
      {
        timeout: 5000
      }
    )

  return request().catch(() => request()) // Retry if request fails
}

export const createPage = ({
  charityId = required(),
  title = required(),
  token = required(),
  slug,
  activityType = 'othercelebration',
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
  image,
  images = [],
  reference,
  rememberedPersonReference,
  story,
  summaryWhat,
  summaryWhy,
  tags,
  tagsCallback,
  target,
  teamId,
  theme,
  videos
}) => {
  const pageTitle = title.replace(/’/g, "'")

  return getPageShortName(pageTitle, slug).then(pageShortName => {
    return put(
      '/v1/fundraising/pages',
      {
        ...(eventId
          ? {
            eventId
          }
          : {
            activityType,
            eventDate,
            eventName: eventName || pageTitle
          }),
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
        expiryDate,
        images: images.length
          ? images
          : image
            ? [{ url: image, isDefault: true }]
            : undefined,
        isGiftAidable: giftAid,
        pageShortName,
        pageStory: story,
        pageSummaryWhat: summaryWhat,
        pageSummaryWhy: truncate(summaryWhy),
        pageTitle,
        reference,
        rememberedPersonReference,
        tags,
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
      .then(result => fetchPage(result.pageId))
      .then(page => {
        createPageTags(deserializePage(page)).then(tags => {
          if (typeof tagsCallback === 'function') {
            tagsCallback(tags, page)
          }
        })

        return page
      })
  })
}

export const getPageShortName = (title, slug) => {
  const preferredName = slug || slugify(title, { lower: true, strict: true })

  const params = {
    preferredName: preferredName.substring(0, 45)
  }

  return get('/v1/fundraising/pages/suggest', params).then(
    result => first(result.Names) || uuid()
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
    offline,
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
          { pageTitle: name.replace(/’/g, "'").replace(pageNameRegex, '') },
          config
        ),
      offline &&
        put(
          `/v1/fundraising/pages/${slug}/offline`,
          { amount: offline },
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
