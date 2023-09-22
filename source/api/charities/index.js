import { get } from '../../utils/client';
import { baseUrl } from '../../utils/justgiving';
import { getUID, isURL, paramsSerializer, required } from '../../utils/params';

export const fetchCharity = (id = required()) => get(`/v1/charity/${id}`);

export const searchCharities = (params = required()) => {
  const campaign = getUID(params.campaign);

  if (campaign) {
    const finalParams = {
      ...params,
      field: 'charityNameSuggest',
      includeFuzzySearch: true,
      maxResults: params.limit,
      campaignGuid: campaign,
    };

    return get('/v1/campaign/autocomplete', finalParams, {}, { paramsSerializer });
  }
  const finalParams = {
    ...params,
    country: params.country === 'uk' ? 'gb' : params.country,
    filterCountry: !!params.country,
    i: 'Charity',
  };

  return get('/v1/onesearch', finalParams).then(
    (response) =>
      (response.GroupedResults &&
        response.GroupedResults.length &&
        response.GroupedResults[0].Results) ||
      []
  );
};

export const deserializeCharity = (charity) => {
  const id = charity.id || charity.Id;

  return {
    active: true,
    categories: charity.categories,
    country: charity.countryCode || charity.CountryCode,
    description: charity.description || charity.Description,
    donateUrl: `${baseUrl()}/onecheckout/donation/direct/${id}`,
    email: charity.emailAddress,
    events: charity.EventIds,
    getStartedUrl: `${baseUrl()}/fundraising-page/creation/?cid=${id}`,
    id,
    logo:
      charity.logoAbsoluteUrl ||
      (isURL(charity.Logo) ? charity.Logo : `${baseUrl('images')}/image/${charity.Logo}`),
    name: charity.displayName || charity.name || charity.Name,
    registrationNumber: charity.registrationNumber,
    slug: charity.pageShortName || (charity.Link && charity.Link.split('/').pop()),
    url: charity.profilePageUrl,
  };
};
