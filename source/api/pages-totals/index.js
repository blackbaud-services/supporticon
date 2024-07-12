import { servicesAPI } from "../../utils/client";
import { getUID, required, dataSource } from "../../utils/params";
import { currencyCode } from "../../utils/currencies";
import { fetchPagesByTag } from "../pages";
import lodashGet from "lodash/get";
import lodashSum from "lodash/sum";

export const fetchEvent = (id) =>
  servicesAPI
    .get(`/v1/event/${id}/total`)
    .then(({ data }) => data.totalFundraisingPages);

const fetchCampaign = ({ campaign }) => {
  const query = `
  query getTotalsWithLeaderboard($id: ID) {
    page(type: ONE_PAGE, id: $id) {
        leaderboard(type: FUNDRAISERS, first: 1) {
          totalCount
        }
      }
    }
  `;

  return servicesAPI
    .post("/v1/justgiving/graphql", {
      query,
      variables: { id: campaign },
    })
    .then((response) => response.data)
    .then((result) => lodashGet(result, "data.page.leaderboard.totalCount", 0));
};

const fetchCampaignTeams = (id) =>
  servicesAPI
    .get(`/v1/campaign/${id}/teams`)
    .then(({ data }) => data.totalResults);

export const fetchPagesTotals = (params = required()) => {
  if (params.tagId && params.tagValue) {
    return fetchPagesByTag(params).then((res) => res.numberOfHits);
  }

  const eventIds = Array.isArray(params.event) ? params.event : [params.event];

  switch (dataSource(params)) {
    case "event":
      return Promise.all(eventIds.map(getUID).map(fetchEvent)).then((events) =>
        events.reduce((acc, total) => acc + total, 0)
      );
    case "campaign":
      if (params.type === "team") {
        const campaignIds = Array.isArray(params.campaign)
          ? params.campaign
          : [params.campaign];

        return Promise.all(
          campaignIds.map(getUID).map(fetchCampaignTeams)
        ).then((campaigns) => campaigns.reduce((acc, total) => acc + total, 0));
      } else {
        const campaignIds = Array.isArray(params.campaign)
          ? params.campaign
          : [params.campaign];

        return Promise.all(
          campaignIds.map((id) => fetchCampaign({ campaign: getUID(id) }))
        ).then((total) => lodashSum(total));
      }
    default:
      console.log("Charity level reporting has been deprecated");
      return new Promise((resolve) =>
        resolve("Charity level reporting has been deprecated")
      );
  }
};
