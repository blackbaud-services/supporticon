import { servicesAPI } from "../../utils/client";
import get from "lodash/get";
import {
  getUID,
  required,
  dataSource,
  paramsSerializer,
} from "../../utils/params";
import { fetchDonations } from "../feeds";
import { currencyCode } from "../../utils/currencies";
import { fetchTotals, deserializeTotals } from "../../utils/totals";

const fetchCampaignTotals = (id, currency) =>
  Promise.all([
    servicesAPI
      .get(`/v1/justgiving/campaigns/${id}`)
      .then((response) => response.data.donationSummary),
    servicesAPI
      .get(`/v1/justgiving/campaigns/${id}/pages`, { params: { currency } })
      .then((response) => response.data.meta.totalAmount),
  ]).then(
    ([
      {
        directDonationAmount,
        fundraiserRaisedAmount,
        offlineAmount,
        totalNumberOfDonations,
      },
      totalAmount,
    ]) => ({
      totalRaised:
        fundraiserRaisedAmount + directDonationAmount + offlineAmount,
      totalResults: totalNumberOfDonations,
    })
  );

const fetchAllCampaignTotals = (campaignIds, currency) =>
  Promise.all(campaignIds.map((id) => fetchCampaignTotals(id, currency))).then(
    (campaigns) =>
      campaigns.reduce(
        (acc, { totalRaised, totalResults }) => ({
          totalRaised: acc.totalRaised + totalRaised,
          totalResults: acc.totalResults + totalResults,
        }),
        { totalRaised: 0, totalResults: 0 }
      )
  );

export const fetchDonationTotals = (params = required()) => {
  const campaignGuids = Array.isArray(params.campaign)
    ? params.campaign.map(getUID)
    : [getUID(params.campaign)];

  if (campaignGuids.length && params.tagId && params.tagValue) {
    return fetchTotals({
      segment: `page:campaign:${campaignGuids[0]}`,
      tagId: params.tagId,
      tagValue: params.tagValue,
    }).then((totals) =>
      deserializeTotals(totals, currencyCode(params.country))
    );
  }

  const eventArgs = {
    eventid: Array.isArray(params.event)
      ? params.event.map(getUID)
      : getUID(params.event),
    currency: currencyCode(params.country),
  };

  if (params.charity) {
    eventArgs.charityIds = params.charity;
  }

  switch (dataSource(params)) {
    case "donationRef":
      const query = paramsSerializer({
        currencyCode: currencyCode(params.country)
      })

      return servicesAPI.get(`/v1/donationtotal/ref/${params.donationRef}?${query}`).then(({ data }) => data);
    case "event":
      if (params.charity && params.charity.length) {
        // no support for donations count for event & charity combination
        return servicesAPI.get(`/v1/donationTotal/event?${paramsSerializer(eventArgs)}`).then(({ data }) => data)
      }
      return Promise.all([
        fetchDonations(params),
        servicesAPI.get(`/v1/donationTotal/event?${paramsSerializer(eventArgs)}`).then(({ data }) => data)
      ]).then(([feed, totals]) => ({
        ...feed.meta,
        ...totals,
      }));
    case "charity":
      console.log("Charity level reporting has been deprecated");
      return new Promise((resolve) =>
        resolve("Charity level reporting has been deprecated")
      );
    default:
      return fetchAllCampaignTotals(
        campaignGuids,
        params.country && currencyCode(params.country),
        params.includeOffline
      );
  }
};

export const deserializeDonationTotals = (totals) => ({
  raised:
    totals.raised ||
    totals.totalRaised ||
    totals.raisedAmount ||
    totals.DonationsTotal ||
    get(totals, "meta.totalAmount") ||
    get(totals, "donationSummary.totalAmount") ||
    get(totals, "totals.donationTotalAmount") ||
    get(totals, "DonationSummary.TotalAmount") ||
    0,
  offline:
    totals.offline ||
    totals.offlineAmount ||
    totals.raisedAmountOfflineInGBP ||
    get(totals, "donationSummary.offlineAmount") ||
    get(totals, "DonationSummary.offlineAmount") ||
    0,
  donations:
    totals.donations ||
    totals.totalResults ||
    totals.numberOfDirectDonations ||
    totals.NumberOfDonations ||
    get(totals, "donationSummary.totalNumberOfDonations") ||
    get(totals, "totals.donationCount") ||
    get(totals, "DonationSummary.TotalNumberOfDonations") ||
    0,
});
