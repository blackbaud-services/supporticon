import get from "lodash/get";
import { fetchPages } from "../pages";
import { getUID, required } from "../../utils/params";
import { baseUrl, imageUrl } from "../../utils/justgiving";
import { fetchLeaderboard } from "../../utils/leaderboards";
import { getMonetaryValue } from "../../utils/totals";
import { servicesAPI } from "../../utils/client";

const fetchActivePages = (pages) => {
  const pageGuids = pages.map((page) => page.ID).filter(Boolean);

  if (!pageGuids.length) {
    return pages;
  }

  return fetchPages({ ids: pageGuids, allPages: true })
    .then((results) => results.map((page) => page.pageGuid))
    .then((activePageIds) =>
      pages.filter((page) => activePageIds.indexOf(page.ID) > -1)
    );
};

export const fetchFitnessLeaderboard = ({
  campaign = required(),
  activeOnly,
  activityType = "any",
  endDate,
  limit = 10,
  offset,
  sortBy = "distance",
  startDate,
  tagId,
  tagValue,
  type,
  useLegacy = true,
}) => {
  if (tagId || tagValue || sortBy !== "distance") {
    return fetchLeaderboard({
      activityType,
      id: getUID(campaign),
      limit,
      sortBy,
      tagId,
      tagValue,
      type: "campaign",
    });
  }

  if (useLegacy || type === "teams") {
    const params = {
      campaignGuid: campaign,
      limit: Math.max(limit, 200),
      offset: offset || 0,
      start: startDate,
      end: endDate,
    };

    return servicesAPI
      .get("/v1/fitness/campaign", { params })
      .then(({ data }) => data)
      .then((result) => (type === "team" ? result.teams : result.pages))
      .then((items) => items.slice(0, limit || 100))
      .then((items) =>
        activeOnly && type !== "team" ? fetchActivePages(items) : items
      )
      .then((items) => items.filter((item) => item.Details))
      .then((items) =>
        items.map((item) => ({ ...item, type: type || "individual" }))
      );
  }

  return fetchLeaderboard({
    activityType,
    id: getUID(campaign),
    sortBy,
    type: "campaign",
  });
};

export const deserializeFitnessLeaderboard = (item, index) => {
  const slug = get(item, "Details.Url") || item.slug;

  return {
    charity: item.charity_name,
    distance: item.TotalValue || get(item, "amounts[1].value", 0),
    id: item.ID || item.legacyId,
    image: get(item, "heroMedia.url")
      ? `${get(item, "heroMedia.url")}?template=Size186x186Crop`
      : null ||
        imageUrl(get(item, "Details.ImageId"), "Size186x186Crop") ||
        "https://assets.blackbaud-sites.com/images/supporticon/user.svg",
    name: get(item, "Details.Name") || item.title || item.tagValue,
    position: index + 1,
    raised: getMonetaryValue(get(item, "donationSummary.totalAmount")),
    slug,
    status: item.status,
    subtitle: get(item, "owner.name"),
    totals: get(item, "amounts", []).reduce(
      (totals, amount) => ({
        ...totals,
        [amount.unit]: amount.value,
      }),
      {}
    ),
    url:
      item.url ||
      [baseUrl(), item.type === "team" ? "team" : "fundraising", slug].join(
        "/"
      ),
  };
};
