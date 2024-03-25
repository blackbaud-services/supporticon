import React, { useState } from "react";
import PropTypes from "prop-types";
import { useFitnessLeaderboard } from "../../hooks/use-fitness-leaderboard";
import { formatNumber, setLocaleFromCountry } from "../../utils/numbers";
import { formatMeasurementDomain } from "../../utils/tags";
import {
  formatActivities,
  formatDistance,
  formatDuration,
  formatElevation,
} from "../../utils/fitness";

import Filter from "constructicon/filter";
import Grid from "constructicon/grid";
import LeaderboardItem from "constructicon/leaderboard-item";
import LeaderboardWrapper from "constructicon/leaderboard";
import Pagination from "constructicon/pagination";
import PaginationLink from "constructicon/pagination-link";
import RichText from "constructicon/rich-text";
import Section from "constructicon/section";

const FitnessLeaderboard = ({
  activeOnly,
  activity,
  campaign,
  charity,
  country,
  deserializeMethod,
  endDate,
  excludePageIds,
  filter,
  leaderboard,
  leaderboardItem,
  limit,
  miles,
  multiplier,
  offset,
  page,
  pageSize,
  places,
  refreshInterval: refetchInterval,
  showPage,
  sortBy,
  startDate,
  subtitleMethod,
  tagId,
  tagValue,
  type,
  units,
}) => {
  const [query, setQuery] = useState("");
  const { data = [], status } = useFitnessLeaderboard(
    {
      activeOnly,
      activity,
      campaign,
      charity,
      country,
      endDate,
      limit: limit + 10,
      page,
      q: query,
      sortBy: formatMeasurementDomain(sortBy),
      startDate,
      tagId,
      tagValue,
      type,
    },
    {
      refetchInterval,
      deserializeMethod,
    }
  );

  const removeExcludedPages = (item) => {
    const id = tagId ? item.name : item.id;

    const excluded = Array.isArray(excludePageIds)
      ? excludePageIds
      : excludePageIds.split(",");

    return excluded.indexOf(id.toString()) === -1;
  };

  const getMetric = (leader, label) => {
    const { totals = {} } = leader;
    const distance = (offset + leader.distance) * multiplier;
    const locale = setLocaleFromCountry(country);

    switch (sortBy) {
      case "activities":
        return formatActivities((offset + totals.count) * multiplier);
      case "duration":
        return formatDuration({
          amount: (offset + totals.seconds) * multiplier,
          label,
        });
      case "elevation":
        return formatElevation({
          amount: (offset + totals.meters) * multiplier,
          label,
          locale,
          miles,
          places,
        });
      default:
        return units
          ? formatDistance({ amount: distance, miles, label, places })
          : formatNumber({ amount: distance, places });
    }
  };

  const items = (
    excludePageIds ? data.filter(removeExcludedPages) : data
  ).slice(0, limit);

  return (
    <div>
      {filter && <Filter onChange={setQuery} {...filter} />}
      {status === "loading" && <LeaderboardWrapper {...leaderboard} loading />}
      {status === "error" && <LeaderboardWrapper {...leaderboard} error />}
      {status === "success" && items.length === 0 && (
        <LeaderboardWrapper {...leaderboard} empty />
      )}
      {status === "success" && (
        <Pagination max={pageSize} toPaginate={items}>
          {({
            currentPage,
            isPaginated,
            prev,
            next,
            canPrev,
            canNext,
            pageOf,
          }) => (
            <>
              <LeaderboardWrapper {...leaderboard}>
                {currentPage.map((item, index) => (
                  <LeaderboardItem
                    key={item.id || index}
                    title={item.name}
                    subtitle={subtitleMethod(item)}
                    image={item.image}
                    amount={getMetric(item)}
                    amountLabel={getMetric(item, "full")}
                    href={item.url}
                    rank={index + 1}
                    {...leaderboardItem}
                  />
                ))}
              </LeaderboardWrapper>
              {pageSize && isPaginated && (
                <Section spacing={{ t: 0.5 }}>
                  <Grid align="center" justify="center">
                    <PaginationLink
                      onClick={prev}
                      direction="prev"
                      disabled={!canPrev}
                    />
                    {showPage && <RichText size={-1}>{pageOf}</RichText>}
                    <PaginationLink
                      onClick={next}
                      direction="next"
                      disabled={!canNext}
                    />
                  </Grid>
                </Section>
              )}
            </>
          )}
        </Pagination>
      )}
    </div>
  );
};

FitnessLeaderboard.propTypes = {
  /**
   * The campaign uid to fetch pages for
   */
  campaign: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),

  /**
   * The charity uid to fetch pages for
   */
  charity: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),

  /**
   * The type of page to include in the leaderboard
   */
  type: PropTypes.oneOf(["individual", "team", "group"]),

  /**
   * The activity type of page to include in the leaderboard (walk, run, ride, hike, swim, wheelchair)
   */
  activity: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),

  /**
   * Start date filter (ISO Format)
   */
  startDate: PropTypes.string,

  /**
   * End date filter (ISO Format)
   */
  endDate: PropTypes.string,

  /**
   * Use imperial units (miles, feet, yards)
   */
  miles: PropTypes.bool,

  /**
   * The number of records to fetch
   */
  limit: PropTypes.number,

  /**
   * The number of records to show per page, disables pagination if not specified.
   */
  pageSize: PropTypes.number,

  /**
   * The page to fetch
   */
  page: PropTypes.number,

  /**
   * The max number of places after decimal point to display
   */
  places: PropTypes.number,

  /**
   * The tag ID to group the leaderboard by
   */
  tagId: PropTypes.string,

  /**
   * The tag value to filter by
   */
  tagValue: PropTypes.string,

  /**
   * Override the deserializeLeaderboard method
   */
  deserializeMethod: PropTypes.func,

  /**
   * The type of measurement to sort by
   */
  sortBy: PropTypes.oneOf(["distance", "duration", "elevation"]),

  /**
   * Props to be passed to the Constructicon Leaderboard component
   */
  leaderboard: PropTypes.object,

  /**
   * Props to be passed to the Constructicon LeaderboardItem component
   */
  leaderboardItem: PropTypes.object,

  /**
   * Props to be passed to the Filter component (false to hide)
   */
  filter: PropTypes.any,

  /**
   * Include distance units?
   */
  units: PropTypes.bool,

  /**
   * Only show active pages?
   */
  activeOnly: PropTypes.bool,

  /**
   * Offset to be applied to each page distance
   */
  offset: PropTypes.number,

  /**
   * The amount to multiply each page distance by for custom conversions
   */
  multiplier: PropTypes.number,

  /**
   * Interval (in milliseconds) to refresh data from API
   */
  refreshInterval: PropTypes.number,

  /**
   * A function to
   */
  subtitleMethod: PropTypes.func,
};

FitnessLeaderboard.defaultProps = {
  activeOnly: true,
  country: "gb",
  filter: {},
  limit: 10,
  multiplier: 1,
  offset: 0,
  page: 1,
  places: 2,
  showPage: false,
  sortBy: "distance",
  subtitleMethod: (item) => item.subtitle,
  units: true,
};

export default FitnessLeaderboard;
