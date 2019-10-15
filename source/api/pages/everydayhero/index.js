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
    teamRole: page.team_role,
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
  birthday = required(),
  campaignDate,
  campaignId = required(),
  charityId,
  directMarketingConsent,
  expiresAt,
  fitnessGoal,
  giftAid,
  groupValues,
  image,
  inviteToken,
  name,
  nickname,
  redirectTo,
  skipNotification,
  slug,
  story,
  target,
  token = required(),
  user
}) => {
  return post(`/api/v2/pages?access_token=${token}`, {
    birthday,
    campaign_date: campaignDate,
    campaign_id: campaignId,
    charity_id: charityId,
    direct_marketing_consent: directMarketingConsent,
    expires_at: expiresAt,
    fitness_goal: fitnessGoal,
    gift_aid_eligible: giftAid,
    group_values: groupValues,
    image,
    name,
    nickname,
    redirect_to: redirectTo,
    skip_notification: skipNotification,
    slug,
    story,
    target,
    token: inviteToken,
    uid: user
  }).then(response => response.page)
}

export const updatePage = (
  pageId,
  {
    campaignDate,
    expiresAt,
    fitnessGoal,
    groupValues,
    image,
    name,
    redirectTo,
    slug,
    story,
    target,
    token = required()
  }
) => {
  return put(`/api/v2/pages/${pageId}?access_token=${token}`, {
    campaign_date: campaignDate,
    expires_at: expiresAt,
    fitness_goal: fitnessGoal,
    group_values: groupValues,
    image,
    name,
    redirect_to: redirectTo,
    slug,
    story,
    target
  }).then(response => response.page)
}
