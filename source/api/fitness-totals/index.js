import { servicesAPI } from "../../utils/client";
import { isEmpty, required } from "../../utils/params";
import { fetchTotals, deserializeTotals } from "../../utils/totals";

export const fetchFitnessSummary = (campaign = required(), types) =>
  Promise.reject(new Error("This method is not supported for JustGiving"));

export function fetchFitnessTotals({
  campaign = required(),
  charity,
  limit = 100,
  offset = 0,
  useLegacy = true,
  startDate,
  endDate,
  tagId,
  tagValue,
}) {
  if (!isEmpty(charity)) {
    return fetchTotals({
      segment: `page:campaign:${campaign}:charity:${charity}`,
      tagId: "page:campaign:charity",
      tagValue: `page:campaign:${campaign}:charity:${charity}`,
    })
      .then(deserializeTotals)
      .then((result) => ({
        distance: result.fitnessDistanceTotal,
        duration: result.fitnessDurationTotal,
        elevation: result.fitnessElevationTotal,
      }));
  }

  if ((tagId && tagValue) || !useLegacy) {
    return fetchTotals({
      segment: `page:campaign:${campaign}`,
      tagId: tagId || "page:campaign",
      tagValue: tagValue || `page:campaign:${campaign}`,
    })
      .then(deserializeTotals)
      .then((result) => ({
        distance: result.fitnessDistanceTotal,
        duration: result.fitnessDurationTotal,
        elevation: result.fitnessElevationTotal,
      }));
  }

  const params = {
    campaignGuid: campaign,
    limit,
    offset,
    start: startDate,
    end: endDate,
  };

  return servicesAPI
    .get('/v1/fitness/campaign', { params })
    .then(({ data }) => data)
    .then((result) => ({
      distance: result.totalAmount,
      duration: result.totalAmountTaken,
      elevation: result.totalAmountElevation,
    }));
}
