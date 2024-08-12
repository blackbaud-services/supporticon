import dayjs from "dayjs";
import chunk from "lodash/chunk";
import first from "lodash/first";
import flattenDeep from "lodash/flattenDeep";
import lodashGet from "lodash/get";
import lodashFilter from "lodash/filter";
import slugify from "slugify";
import { v4 as uuid } from "uuid";
import { servicesAPI } from "../../utils/client";
import { apiUrl, apiImageUrl, baseUrl, imageUrl } from "../../utils/justgiving";
import {
  getUID,
  isEmpty,
  isInArray,
  isUuid,
  required,
  getUIDForOnepageCampaign,
} from "../../utils/params";
import { defaultPageTags } from "../../utils/tags";
import { deserializeFitnessActivity } from "../fitness-activities";
import { fetchTotals, deserializeTotals } from "../../utils/totals";
import jsonDate from "../../utils/jsonDate";

export const pageNameRegex = /[^\w\s',-]/gi;

export const deserializePage = (page) => {
  const shortName =
    page.shortName ||
    page.pageShortName ||
    (page.LinkPath || "").substring(1) ||
    page.PageUrl;

  const getImage = () => {
    return (
      page.defaultImage ||
      page.Logo ||
      page.Photo ||
      imageUrl(page.photo) ||
      imageUrl(lodashGet(page, "pageImages[0]")) ||
      lodashGet(page, "image.url") ||
      lodashGet(page, "images[0].url") ||
      apiImageUrl(shortName)
    );
  };

  const getQrCodes = (page) => {
    const images = lodashGet(page, "media.images", []);
    return lodashFilter(images, (image) => image.caption === "qrcode");
  };

  const isOnlinePresent = typeof page.totalRaisedOnline !== "undefined";
  const onlineAmount = isOnlinePresent
    ? parseFloat(page.totalRaisedOnline)
    : parseFloat(page.Amount || page.raisedAmount || page.amountRaised || 0);

  const offlineAmount = parseFloat(page.totalRaisedOffline || 0);
  const status = page.status || page.pageStatus;
  const id = page.pageId || page.Id;

  return {
    active: status
      ? ["Inactive", "Cancelled", "Offline"].indexOf(status) === -1
      : true,
    campaign: page.campaignGuid || page.Subtext || page.eventId || page.EventId,
    campaignDate: jsonDate(page.eventDate) || page.EventDate,
    charity: page.charity || page.CharityId || page.charityId,
    charityId: lodashGet(page, "charity.id") || page.CharityId,
    coordinates: null,
    createdAt: jsonDate(page.createdDate) || page.CreatedDate,
    currencyCode: page.currencyCode,
    currencySymbol: page.currencySymbol,
    donationUrl: id
      ? `${baseUrl("link")}/v1/fundraisingpage/donate/pageId/${id}`
      : `${baseUrl("www")}/fundraising/${shortName}/donate`,
    donateQrCodeImage: `${apiUrl()}/v1/fundraising/pages/${shortName}/qrcode`,
    event: page.Subtext || page.eventId || page.EventId || page.eventName,
    expired: jsonDate(page.expiryDate) && dayjs(page.expiryDate).isBefore(),
    fitness: page.fitness || {},
    fitnessActivities: lodashGet(page, "fitness.activities", []).map(
      deserializeFitnessActivity
    ),
    fitnessGoal: parseInt(page.pageSummaryWhat) || 0,
    fitnessDistanceTotal:
      lodashGet(page, "fitness.totalAmount", 0) ||
      lodashGet(page, "fitness.distance", 0),
    fitnessDurationTotal:
      lodashGet(page, "fitness.totalAmountTaken", 0) ||
      lodashGet(page, "fitness.duration", 0),
    fitnessElevationTotal:
      lodashGet(page, "fitness.totalAmountElevation", 0) ||
      lodashGet(page, "fitness.elevation", 0),
    fitnessSettings: lodashGet(page, "fitness.pageFitnessSettings"),
    groups: null,
    hasUpdatedImage:
      page.imageCount &&
      parseInt(page.imageCount - getQrCodes(page).length) > 1,
    id,
    image:
      getImage() &&
      getImage().split("?")[0] + "?template=CrowdfundingOwnerAvatar",
    name:
      page.title ||
      page.pageTitle ||
      page.Name ||
      page.name ||
      page.PageName ||
      lodashGet(page, "pageOwner.fullName"),
    owner: page.owner
      ? !lodashGet(page, "owner.firstName")
        ? page.owner
        : lodashGet(page, "owner.firstName") +
          " " +
          lodashGet(page, "owner.lastName")
      : page.OwnerFullName ||
        page.PageOwner ||
        page.pageOwner ||
        lodashGet(page, "pageOwner.fullName"),
    ownerGuid:
      page.ownerGuid ||
      page.pageOwnerGuid ||
      lodashGet(page, "owner.userGuid") ||
      lodashGet(page, "owner.id"),
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
    type: page.type || "individual",
    url: page.Link || page.PageUrl || `${baseUrl()}/fundraising/${shortName}`,
    uuid: page.pageGuid || page.fundraisingPageGuid || page.FundraiserPageGuid,
  };
};

const deserializeSegmentation = (tags = []) => {
  return tags.reduce((segments, tag) => {
    const key = lodashGet(tag, "tagDefinition.id");
    const value = lodashGet(tag, "value");

    return {
      ...segments,
      [key]: value,
    };
  }, {});
};

export const fetchPages = (params = required()) => {
  const {
    allPages,
    authType = "Bearer",
    campaign,
    charity,
    event,
    ids,
    token,
    userPages,
    ...args
  } = params;

  const headers = token
    ? { headers: { Authorization: [authType, token].join(" ") } }
    : null;

  if (userPages && token) {
    return servicesAPI
      .get("/v1/pages", {
        headers,
      })
      .then(({ data }) => data);
  }

  if (allPages && ids) {
    const pageIds = Array.isArray(ids) ? ids : ids.split(",");

    if (pageIds.filter(isUuid).length === pageIds.length) {
      return Promise.all(
        chunk(pageIds, 20).map((guids) =>
          servicesAPI
            .get("/v1/justgiving/proxy/fundraising/v2/pages/bulk", {
              params: { pageGuids: guids.join(",") },
            })
            .then((response) => response.data.results)
        )
      )
        .then((results) => flattenDeep(results))
        .then((results) => results.filter((page) => page.status === "Active"));
    }

    return Promise.all(pageIds.map(fetchPage));
  }

  if (allPages && event) {
    return servicesAPI
      .get(`/v1/pages/event/${getUID(event)}`)
      .then(({ data }) => data.fundraisingPages)
      .then((pages) =>
        pages.map((page) => ({
          ...page,
          totalRaisedOffline: page.raisedAmount - page.totalRaisedOnline,
        }))
      );
  }

  const oneSearchParams = {
    campaignGuid: getUIDForOnepageCampaign(campaign),
    charityId: getUID(charity),
    eventId: getUID(event),
    i: "Fundraiser",
    ...args,
    q: `${args.q}*`,
  };

  return servicesAPI
    .get("/v1/pages/onesearch", { params: oneSearchParams })
    .then(({ data }) => data)
    .then(
      (response) =>
        (response.GroupedResults &&
          response.GroupedResults.length &&
          response.GroupedResults[0].Results) ||
        []
    );
};

export const fetchPage = (page = required(), slug, options = {}) => {
  const endpoint = slug || isNaN(page) ? "page" : "page/id";

  const fetchers = [
    new Promise((resolve) =>
      servicesAPI
        .get(`/v1/${endpoint}/${page}`)
        .then(({ data: page }) =>
          options.includeFitness
            ? fetchPageFitness(page, options.fitnessParams).then((fitness) =>
                resolve({ ...page, fitness })
              )
            : resolve(page)
        )
    ),
    options.includeTags && fetchPageTags(page),
  ];

  return Promise.all(fetchers).then(([page, tags]) => ({
    ...page,
    ...tags,
  }));
};

export const fetchUserPages = ({
  authType = "Bearer",
  campaign,
  charity,
  event,
  token = required(),
}) => {
  const headers = {
    Authorization: [authType, token].join(" "),
  };

  const campaignGuids = Array.isArray(campaign)
    ? campaign.map(getUID)
    : [getUID(campaign)];

  const charityIds = Array.isArray(charity)
    ? charity.map(getUID)
    : [getUID(charity)];

  const eventIds = Array.isArray(event) ? event.map(getUID) : [getUID(event)];

  const filterByCampaign = (pages) =>
    isEmpty(campaign)
      ? pages
      : pages.filter((page) => isInArray(campaignGuids, page.campaignGuid));

  const filterByCharity = (pages) =>
    isEmpty(charity)
      ? pages
      : pages.filter((page) => isInArray(charityIds, page.charityId));

  const filterByEvent = (pages) =>
    isEmpty(event)
      ? pages
      : pages.filter((page) => isInArray(eventIds, page.eventId));

  return servicesAPI
    .get("/v1/pages", { headers })
    .then(({ data }) => data)
    .then(filterByCampaign)
    .then(filterByCharity)
    .then(filterByEvent);
};

export const fetchPagesByTag = ({
  tagId = required(),
  tagValue = required(),
  limit = 100,
  offset = 0,
}) =>
  servicesAPI
    .get(
      `v1/pages/tag?tagsQuery=tags.${tagId}=${tagValue}&maxValue=${limit}&offset=${offset}`
    )
    .then(({ data }) => data);

export const fetchPageTags = (page) => {
  return servicesAPI.get(`/v1/page/tags/${page}`).then(({ data }) => data);
};

const fetchPageFitness = (
  page,
  { limit = 100, offset = 0, startDate, endDate, useLegacy = true } = {}
) => {
  const slug = typeof page === "object" ? page.pageShortName : page;

  if (useLegacy) {
    const params = { limit, offset, start: startDate, end: endDate };
    return servicesAPI
      .get(`/v1/fitness/page/${slug}`, params)
      .then(({ data }) => data)
      .then((res) =>
        servicesAPI
          .get(
            `/v1/justgiving/page/${slug}/fitnessTotal?startDate=${startDate}&endDate=${endDate}`
          )
          .then(({ data }) => {
            return {
              ...res,
              totalAmount: data.distance,
              totalAmountElevation: data.elevation,
              totalAmountTaken: data.duration,
            };
          })
      );
  }

  return fetchTotals({
    segment: "page:totals",
    tagId: "page:totals",
    tagValue: `page:fundraising:${page.pageGuid}`,
  }).then(deserializeTotals);
};

export const fetchPageDonationCount = (page = required()) => {
  return servicesAPI
    .get(`/v1/page/${page}/donations`)
    .then(({ data }) => data)
    .then((data) => data.pagination.totalResults);
};

export const fetchPageDonations = (
  pageShortName,
  donations = [],
  pageNum = 1
) => {
  const params = { pageSize: 150, pageNum };
  return servicesAPI
    .get(`/v1/page/${pageShortName}/donations`, { params })
    .then(({ data }) => data)
    .then((data) => {
      const updatedResults = [...donations, ...data.donations];

      return pageNum >= Math.min(data.pagination.totalPages, 10)
        ? updatedResults
        : fetchPageDonations(pageShortName, updatedResults, pageNum + 1);
    });
};

const truncate = (string, length = 50) => {
  if (string) {
    return String(string).length > length
      ? String(string)
          .substring(0, length - 3)
          .trim() + "..."
      : String(string);
  }

  return undefined;
};

export const createPageTagUnclaimedPages = async ({
  id = required(),
  label = required(),
  slug = required(),
  value = required(),
  aggregation = [],
}) => {
  const request = () =>
    servicesAPI
      .post(`/v1/page/${slug}/unclaimedPageTag`, {
        aggregation,
        id,
        label,
        value,
      })
      .then(({ data }) => data);

  return request().catch(() => request()); // Retry if request fails
};

export const createPageTag = ({
  id = required(),
  label = required(),
  slug = required(),
  value = required(),
  token,
  authType = "Bearer",
  aggregation = [],
}) => {
  const headers = token
    ? { headers: { Authorization: [authType, token].join(" ") } }
    : null;

  const request = () =>
    servicesAPI
      .post(
        `/v1/page/${slug}/tag`,
        {
          aggregation,
          id,
          label,
          value,
        },
        headers
      )
      .then(({ data }) => data);

  return request().catch(() => request()); // Retry if request fails
};

export const createPageTagsUnclaimedPages = async ({
  slug = required(),
  tagValues = required(),
}) => {
  const request = () =>
    servicesAPI
      .post(`/v1/page/${slug}/unclaimedPageTags`, {
        tagValues,
      })
      .then(({ data }) => data);

  return request().catch(() => request()); // Retry if request fails
};

export const createPageTags = ({
  slug = required(),
  tagValues = required(),
  token,
  authType = "Bearer",
}) => {
  const headers = token
    ? { headers: { Authorization: [authType, token].join(" ") } }
    : null;
  const request = () =>
    servicesAPI
      .post(
        `/v1/page/${slug}/tags`,
        {
          tagValues,
        },
        headers
      )
      .then(({ data }) => data);

  return request().catch(() => request()); // Retry if request fails
};

const createDefaultPageTags = (page, timeBox, campaignGuidOverride) =>
  createPageTags({
    slug: page.slug,
    tagValues: defaultPageTags(page, timeBox, campaignGuidOverride),
  });

export const createPage = ({
  charityId = required(),
  title = required(),
  token = required(),
  slug,
  activityType = "othercelebration",
  attribution,
  authType = "Bearer",
  campaignId,
  campaignGuid,
  campaignGuidOverride,
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
  forceSlug = false,
  giftAid = true,
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
  timeBox,
  videos,
}) => {
  const pageTitle = title.replace(/’/g, "'");

  return getPageShortName(pageTitle, slug, forceSlug).then((pageShortName) => {
    if (forceSlug && !pageShortName) {
      return false;
    }

    return servicesAPI
      .put(
        "/v1/page",
        {
          ...(eventId
            ? {
                eventId,
              }
            : {
                activityType,
                eventDate,
                eventName: eventName || pageTitle,
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
          videos,
        },
        {
          headers: {
            Authorization: [authType, token].join(" "),
          },
        }
      )
      .then(({ data }) => fetchPage(data.pageId))
      .then((page) => {
        createDefaultPageTags(
          deserializePage(page),
          timeBox,
          campaignGuidOverride
        ).then((tags) => {
          if (typeof tagsCallback === "function") {
            tagsCallback(tags, page);
          }
        });

        return page;
      });
  });
};

export const getPageShortName = (title, slug, forceSlug) => {
  const preferredName = slug || slugify(title, { lower: true, strict: true });

  return servicesAPI
    .get(`/v1/page/suggest?preferredName=${preferredName}`)
    .then(({ data }) => data)
    .then((result) => {
      const firstResult = first(result.Names);
      if (forceSlug) {
        return firstResult === slug ? firstResult : false;
      }

      return firstResult || uuid();
    });
};

export const getPageIdBySlug = (slug) => {
  return servicesAPI.get(`/v1/page/${slug}`).then(({ data }) => data.pageId);
};

export const updatePage = (
  slug = required(),
  {
    token = required(),
    attribution,
    authType = "Bearer",
    image,
    name,
    offline,
    story,
    summaryWhat,
    summaryWhy,
    target,
  }
) => {
  const config = token
    ? { headers: { Authorization: [authType, token].join(" ") } }
    : null;

  return Promise.all(
    [
      attribution &&
        servicesAPI
          .put(`/v1/page/${slug}/attribution`, { attribution }, config)
          .then(({ data }) => data),
      image &&
        servicesAPI
          .put(
            `/v1/page/${slug}/images`,
            { url: image, isDefault: true },
            config
          )
          .then(({ data }) => data),
      name &&
        servicesAPI
          .put(
            `/v1/page/${slug}/pagetitle`,
            { pageTitle: name.replace(/’/g, "'").replace(pageNameRegex, "") },
            config
          )
          .then(({ data }) => data),
      offline &&
        servicesAPI
          .put(`/v1/page/${slug}/offline`, { amount: offline }, config)
          .then(({ data }) => data),
      story &&
        servicesAPI
          .put(`/v1/page/${slug}/pagestory`, { story }, config)
          .then(({ data }) => data),
      target &&
        servicesAPI
          .put(`/v1/page/${slug}/target`, { amount: target }, config)
          .then(({ data }) => data),
      (summaryWhat || summaryWhy) &&
        servicesAPI
          .put(
            `/v1/page/${slug}/summary`,
            { pageSummaryWhat: summaryWhat, pageSummaryWhy: summaryWhy },
            config
          )
          .then(({ data }) => data),
    ].filter((promise) => promise)
  );
};

export const cancelPage = ({
  authType = "Bearer",
  slug = required(),
  token = required(),
}) => {
  const headers = { Authorization: [authType, token].join(" ") };

  return servicesAPI
    .delete(`/v1/page/${slug}`, { headers })
    .then(({ data }) => data);
};
