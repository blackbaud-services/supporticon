import { servicesAPI } from "../../utils/client";
import {
  getUID,
  required,
  paramsSerializer,
  isURL,
  getUIDForOnepageCampaign,
} from "../../utils/params";
import { baseUrl } from "../../utils/justgiving";

export const fetchCharity = (id = required()) => servicesAPI.get(`/v1/charity/${id}`).then(({ data }) => data);

export const searchCharities = (params = required()) => {
  const campaign = getUID(params.campaign);

  if (campaign) {
    const finalParams = paramsSerializer({
      ...params,
      field: "charityNameSuggest",
      includeFuzzySearch: true,
      maxResults: params.limit,
      campaignGuid:
        !!campaign && getUIDForOnepageCampaign(campaign),
    });

    return servicesAPI.get(`/v1/charity/campaign?${finalParams}`).then(({ data }) => data);
  } else {
    const finalParams = paramsSerializer({
      ...params,
      country: params.country === "uk" ? "gb" : params.country,
      filterCountry: !!params.country,
      i: "Charity",
    });

    return servicesAPI.get(`/v1/charity/search?${finalParams}`).then(
      ({ data }) =>
        (data.GroupedResults &&
          data.GroupedResults.length &&
          data.GroupedResults[0].Results) ||
        []
    )
  }
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
      (isURL(charity.Logo)
        ? charity.Logo
        : `${baseUrl("images")}/image/${charity.Logo}`),
    name: charity.displayName || charity.name || charity.Name,
    registrationNumber: charity.registrationNumber,
    slug:
      charity.pageShortName || (charity.Link && charity.Link.split("/").pop()),
    url: charity.profilePageUrl,
  };
};
