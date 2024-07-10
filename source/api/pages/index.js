import dayjs from "dayjs";
import chunk from "lodash/chunk";
import first from "lodash/first";
import flattenDeep from "lodash/flattenDeep";
import lodashGet from "lodash/get";
import lodashFilter from "lodash/filter";
import slugify from "slugify";
import { v4 as uuid } from "uuid";
import { destroy, get, post, put, servicesAPI } from "../../utils/client";
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

  if (userPages && token) {
    return get(
      "/v1/fundraising/pages",
      {},
      {},
      {
        headers: {
          Authorization: [authType, token].join(" "),
        },
      }
    );
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
    const mappings = { limit: "pageSize" };

    return get(`/v1/event/${getUID(event)}/pages`, args, { mappings })
      .then((response) => response.fundraisingPages)
      .then((pages) =>
        pages.map((page) => ({
          ...page,
          totalRaisedOffline: page.raisedAmount - page.totalRaisedOnline,
        }))
      );
  }

  return get(
    `/v1/onesearch${
      !!campaign && "?campaignGuid=" + getUIDForOnepageCampaign(campaign)
    }`,
    {
      charityId: getUID(charity),
      eventId: getUID(event),
      i: "Fundraiser",
      ...args,
      q: `${args.q}*`,
    }
  ).then(
    (response) =>
      (response.GroupedResults &&
        response.GroupedResults.length &&
        response.GroupedResults[0].Results) ||
      []
  );
};

export const fetchPage = (page = required(), slug, options = {}) => {
  const endpoint = slug ? "pages" : isNaN(page) ? "pages" : "pagebyid";

  const fetchers = [
    new Promise((resolve) =>
      get(`/v1/fundraising/${endpoint}/${page}`).then((page) =>
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

  return get("/v1/fundraising/pages", {}, {}, { headers })
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
  get(
    `v1/tags/search?tagsQuery=tags.${tagId}=${tagValue}&maxValue=${limit}&offset=${offset}`
  );

export const fetchPageTags = (page) => {
  return get(`v1/tags/${page}`);
};

const fetchPageFitness = (
  page,
  { limit = 100, offset = 0, startDate, endDate, useLegacy = true } = {}
) => {
  const slug = typeof page === "object" ? page.pageShortName : page;

  if (useLegacy) {
    const params = { limit, offset, start: startDate, end: endDate };
    return get(`/v1/fitness/fundraising/${slug}`, params).then((res) =>
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
  return get(`/v1/fundraising/pages/${page}/donations`).then(
    (data) => data.pagination.totalResults
  );
};

export const fetchPageDonations = (
  pageShortName,
  donations = [],
  pageNum = 1
) =>
  get(`v1/fundraising/pages/${pageShortName}/donations`, {
    pageSize: 150,
    pageNum,
  }).then((data) => {
    const updatedResults = [...donations, ...data.donations];

    return pageNum >= Math.min(data.pagination.totalPages, 10)
      ? updatedResults
      : fetchPageDonations(pageShortName, updatedResults, pageNum + 1);
  });

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
  aggregation = []
}) => 
  servicesAPI
  .post("/v1/justgiving/iam/login", { email: process.env.HOLDER_USER_EMAIL, password: process.env.HOLDER_USER_PASSWORD })
  .then(res => {
    const token = `Bearer ${res.data.access_token}`
    return createPageTag({
      id,
      label, 
      slug, 
      value,
      token,
      aggregation
    })
  })
  .catch((error) => Promise.reject(error.message))

export const createPageTag = ({
  id = required(),
  label = required(),
  slug = required(),
  value = required(),
  token = required(),
  aggregation = [],
}) => {
  const request = () =>
    post(
      `/v1/tags/${slug}`,
      {
        aggregation,
        id,
        label,
        value,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
      {
        timeout: 5000,
      }
    );

  return request().catch(() => request()); // Retry if request fails
};

export const createPageTagsUnclaimedPages = async ({
  slug = required(),
  tagValues = required()
}) => 
  servicesAPI
  .post("/v1/justgiving/iam/login", { email: 'holdinguser@justgiving.com', password: '' })
  .then(res => {
    const token = `Bearer ${res.data.access_token}`
    return createPageTags({
      slug, 
      tagValues,
      token
    })
  })
  .catch((error) => Promise.reject(error.message))

export const createPageTags = ({
  slug = required(),
  tagValues = required(),
  token = required()
}) => {
  const request = () =>
    post(
      `/v1/tags/${slug}/multiple`,
      {
        tagValues,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
      {
        timeout: 5000,
      }
    );

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

    return put(
      "/v1/fundraising/pages",
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
      .then((result) => fetchPage(result.pageId))
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

  const params = {
    preferredName: preferredName.substring(0, 45),
  };

  return get("/v1/fundraising/pages/suggest", params).then((result) => {
    const firstResult = first(result.Names);
    if (forceSlug) {
      return firstResult === slug ? firstResult : false;
    }

    return firstResult || uuid();
  });
};

export const getPageIdBySlug = (slug) => {
  return get(`/v1/fundraising/pages/${slug}`).then((res) => res.pageId);
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
  const config = { headers: { Authorization: [authType, token].join(" ") } };

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
          { pageTitle: name.replace(/’/g, "'").replace(pageNameRegex, "") },
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
            pageSummaryWhy: summaryWhy,
          },
          config
        ),
    ].filter((promise) => promise)
  );
};

export const cancelPage = ({
  authType = "Bearer",
  slug = required(),
  token = required(),
}) => {
  const headers = { Authorization: [authType, token].join(" ") };

  return destroy(`/v1/fundraising/pages/${slug}`, { headers });
};
