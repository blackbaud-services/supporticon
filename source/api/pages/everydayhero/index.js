import { get, post, put } from '../../../utils/client'
import { required } from '../../../utils/params'

export const deserializePage = page => {
  const amountInCents = page.metrics
    ? page.metrics.fundraising.total_in_cents
    : page.amount
      ? page.amount.cents
      : 0

  return {
    active: page.active || page.state === 'active',
    campaign: page.campaign || page.campaign_name,
    campaignDate: page.campaign_date || page.event_date,
    charity: page.charity || page.beneficiary || page.charity_name,
    coordinates: page.coordinate,
    donationUrl: page.donation_url,
    expired: page.expired,
    fitness: page.metrics
      ? page.metrics.fitness
      : page.fitness_activity_overview,
    fitnessGoal: page.fitness_goal,
    groups: page.page_groups,
    id: page.id,
    image: page.image && page.image.large_image_url,
    name: page.name,
    owner: page.owner_uid || page.user_id,
    raised: amountInCents / 100,
    slug: page.slug,
    story: page.story,
    target: page.metrics ? page.metrics.fundraising.goal : page.target_cents,
    teamPageId: page.team_page_id,
    url: page.url,
    uuid: page.uuid
  }
}

export const fetchPages = (params = required()) => {
  const { allPages, ...finalParams } = params
  const mappings = { type: 'type' }
  const transforms = allPages
    ? {}
    : {
      type: v => (v === 'individual' ? 'user' : v)
    }

  const promise = allPages
    ? get('api/v2/pages', finalParams, { mappings, transforms })
    : get('api/v2/search/pages', finalParams, { mappings, transforms })

  return promise.then(response => response.pages)
}

export const fetchPage = (id = required()) => {
  if (typeof id === 'object') {
    const {
      campaignSlug = required(),
      countryCode = required(),
      slug = required()
    } = id

    return get(
      `api/v3/prerelease/pages/${countryCode}/${campaignSlug}/${slug}`
    ).then(response => response.page)
  }

  return get(`api/v2/pages/${id}`).then(response => response.page)
}

export const fetchPageDonationCount = (id = required()) => {
  return get(`/api/v2/pages/${id}`).then(data => data.total_donations)
}

export const createPage = ({
  token = required(),
  campaignId = required(),
  birthday = required(),
  name,
  target,
  nickname,
  slug,
  image,
  charityId,
  expiresAt,
  fitnessGoal,
  campaignDate,
  groupValues,
  skipNotification,
  directMarketingConsent,
  inviteToken
}) => {
  return post(`/api/v2/pages?access_token=${token}`, {
    campaign_id: campaignId,
    birthday,
    name,
    target,
    nickname,
    slug,
    image,
    charity_id: charityId,
    expires_at: expiresAt,
    fitness_goal: fitnessGoal,
    campaign_date: campaignDate,
    group_values: groupValues,
    skip_notification: skipNotification,
    direct_marketing_consent: directMarketingConsent,
    token: inviteToken
  }).then(response => response.page)
}

export const updatePage = (
  pageId,
  {
    token = required(),
    name,
    target,
    slug,
    story,
    image,
    expiresAt,
    fitnessGoal,
    campaignDate,
    groupValues
  }
) => {
  return put(`/api/v2/pages/${pageId}?access_token=${token}`, {
    name,
    target,
    slug,
    story,
    image,
    expires_at: expiresAt,
    fitness_goal: fitnessGoal,
    campaign_date: campaignDate,
    group_values: groupValues
  }).then(response => response.page)
}
