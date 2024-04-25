import React from "react";
import PropTypes from "prop-types";
import dayjs from "dayjs";
import { formatNumber } from "../../utils/numbers";
import { convertMetersToUnit } from "../../utils/units";
import { useFitnessTotals } from "../../hooks/use-fitness-totals";

import Grid from "constructicon/grid";
import GridColumn from "constructicon/grid-column";
import Heading from "constructicon/heading";
import Loading from "constructicon/loading";
import Metric from "constructicon/metric";
import Progress from "constructicon/progress-bar";

const FitnessProgressBar = ({
  campaign,
  distanceLabel,
  endDate,
  eventDate,
  grid,
  heading,
  metric,
  offset,
  places,
  progressBar,
  remainingLabel,
  refreshInterval: refetchInterval,
  startDate,
  target,
  targetLabel,
  travelledLabel,
  unit,
}) => {
  const { data, status } = useFitnessTotals(
    {
      campaign,
      startDate,
      endDate,
    },
    { refetchInterval }
  );

  const calculateDaysRemaining = (eventDate) => {
    const today = dayjs();
    const eventDateObj = dayjs(eventDate);
    const daysDiff = Math.ceil(eventDateObj.diff(today, "days", true)); // we want to round up
    return Math.max(0, daysDiff);
  };

  const calculatePercentage = () =>
    Math.min(100, Math.floor(((data.distance / 1000 + offset) / target) * 100));

  if (status === "success") {
    const distance = convertMetersToUnit(data.distance, unit);
    const progress = calculatePercentage();

    return (
      <Grid spacing={0.25} {...grid}>
        <GridColumn xs={6}>
          <Metric
            align="left"
            label={distanceLabel}
            amount={`${formatNumber({
              amount: distance + offset,
              places,
            })}${unit}`}
            {...metric}
          />
        </GridColumn>
        <GridColumn xs={6} xsAlign="right">
          <Metric
            align="right"
            label={targetLabel}
            amount={`${formatNumber({ amount: target, places })}${unit}`}
            {...metric}
          />
        </GridColumn>
        <GridColumn>
          <Progress
            alt={`${progress}% there`}
            progress={progress}
            {...progressBar}
          />
        </GridColumn>
        <GridColumn xs={6}>
          {travelledLabel && (
            <>
              <Heading size={0} tag="strong" {...heading}>
                {progress}%
              </Heading>{" "}
              {travelledLabel}
            </>
          )}
        </GridColumn>
        {remainingLabel && eventDate && (
          <GridColumn xs={6} xsAlign="right">
            <Heading size={0} tag="strong" {...heading}>
              {calculateDaysRemaining(eventDate)}
            </Heading>{" "}
            {remainingLabel}
          </GridColumn>
        )}
      </Grid>
    );
  }

  return <Loading />;
};

FitnessProgressBar.propTypes = {
  /**
   * The campaign uid to fetch totals for
   */
  campaign: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),

  /**
   * Unit
   */
  unit: PropTypes.oneOf(["mi", "km"]),

  /**
   * Offset
   */
  offset: PropTypes.number,

  /**
   * Target
   */
  target: PropTypes.number.isRequired,

  /**
   * Raised label
   */
  distanceLabel: PropTypes.string,

  /**
   * Target label
   */
  targetLabel: PropTypes.string,

  /**
   * Show funded label
   */
  travelledLabel: PropTypes.string,

  /**
   * Show time remaining label
   */
  remainingLabel: PropTypes.string,

  /**
   * Props to be passed to the Constructicon Grid component
   */
  grid: PropTypes.object,

  /**
   * Props to be passed to the Constructicon Heading components
   */
  heading: PropTypes.object,

  /**
   * The max number of places after decimal point to display
   */
  places: PropTypes.number,

  /**
   * Props to be passed to the Constructicon Metric components
   */
  metric: PropTypes.object,

  /**
   * Props to be passed to the Constructicon ProgressBar component
   */
  progressBar: PropTypes.object,

  /**
   * Start date filter (ISO Format)
   */
  startDate: PropTypes.string,

  /**
   * End date filter (ISO Format)
   */
  endDate: PropTypes.string,

  /**
   * Interval (in milliseconds) to refresh data from API
   */
  refreshInterval: PropTypes.number,
};

FitnessProgressBar.defaultProps = {
  places: 0,
  unit: "km",
  offset: 0,
};

export default FitnessProgressBar;
