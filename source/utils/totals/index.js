import find from "lodash/find";
import get from "lodash/get";
import { servicesAPI } from "../client";
import { required } from "../params";
import { getPrimaryUnit, measurementDomains } from "../tags";

export const fetchTotals = ({
  segment = required(),
  tagId = required(),
  tagValue = required(),
  measurementDomain,
}) => {
  const measurementDomainString = measurementDomain
    ? `measurementDomain: "${measurementDomain}"`
    : "";
  const query = `
    {
      totals(
        segment: "${segment}",
        tagDefinitionId: "${tagId}",
        tagValue: "${tagValue}",
        ${measurementDomainString}
      ) {
        measurementDomain
        amounts {
          value
          unit
        }
      }
    }
  `;

  return servicesAPI
    .post("/v1/justgiving/graphql", { query })
    .then((response) => response.data)
    .then((result) => get(result, "data.totals", []));
};

export const getMonetaryValue = (val) => get(val, "value", 0) / 100;

export const getAmountByCurrency = (amounts = [], currency = "GBP") =>
  get(find(amounts, { unit: currency.toLowerCase() }), "value", 0);

export const deserializeTotals = (totals, currency = "GBP") =>
  measurementDomains
    .map(
      (measurementDomain) =>
        find(totals, { measurementDomain }) || { measurementDomain }
    )
    .reduce((acc, { measurementDomain, amounts = [] }) => {
      const label = measurementDomain.split(":")[0];
      const unit = getPrimaryUnit(measurementDomain);
      const value = get(find(amounts, { unit }), "value", 0);

      switch (measurementDomain) {
        case "fundraising:donations_received":
          return {
            ...acc,
            raised: getAmountByCurrency(amounts, currency),
          };

        case "fundraising:offline_donations":
          return {
            ...acc,
            offlineAmount: getAmountByCurrency(amounts, currency),
          };

        case "fundraising:donations_made":
          return {
            ...acc,
            donations: value,
          };

        case "any:activities":
          return {
            ...acc,
            fitnessCount: value,
          };

        case "walk:activities":
        case "ride:activities":
        case "swim:activities":
        case "hike:activities":
          return {
            ...acc,
            [`${label}Count`]: value,
          };

        case "any:distance":
          return {
            ...acc,
            fitnessDistanceTotal: value,
          };

        case "walk:distance":
        case "ride:distance":
        case "swim:distance":
        case "hike:distance":
          return {
            ...acc,
            [`${label}DistanceTotal`]: value,
          };

        case "any:elapsed_time":
          return {
            ...acc,
            fitnessDurationTotal: value,
          };

        case "walk:elapsed_time":
        case "ride:elapsed_time":
        case "swim:elapsed_time":
        case "hike:elapsed_time":
          return {
            ...acc,
            [`${label}DurationTotal`]: value,
          };

        case "any:elevation_gain":
          return {
            ...acc,
            fitnessElevationTotal: value,
          };

        case "walk:elevation_gain":
        case "ride:elevation_gain":
        case "swim:elevation_gain":
        case "hike:elevation_gain":
          return {
            ...acc,
            [`${label}ElevationTotal`]: value,
          };

        default:
          return acc;
      }
    }, {});
