import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import get from "lodash/get";
import * as units from "../units";
import { formatNumber } from "../numbers";

dayjs.extend(duration);

const labels = {
  kilometers: { abbreviation: "km", full: "kilometers" },
  miles: { abbreviation: "mi", full: "miles" },
  feet: { abbreviation: "ft", full: "feet" },
  days: { abbreviation: "d", full: "days" },
  hours: { abbreviation: "h", full: "hours" },
  minutes: { abbreviation: "m", full: "minutes" },
  seconds: { abbreviation: "s", full: "seconds" },
  meters: { abbreviation: "m", full: "meters" },
};

export const formatDistance = ({
  amount,
  miles,
  locale,
  label = "abbreviation",
  places = 2,
}) => {
  if (miles) {
    return (
      formatNumber({
        amount: units.convertMetersToMiles(amount),
        locale,
        places,
      }) + ` ${labels.miles[label]}`
    );
  } else {
    return (
      formatNumber({
        amount: units.convertMetersToKm(amount),
        locale,
        places,
      }) + ` ${labels.kilometers[label]}`
    );
  }
};

export const formatDuration = ({
  amount: duration,
  label = "abbreviation",
}) => {
  if (duration >= 86400) {
    return `${Math.floor(dayjs.duration(duration, "seconds").asDays())}${
      labels.days[label]
    } ${dayjs.duration(duration, "seconds").hours()}${labels.hours[label]}`;
  } else if (duration >= 3600) {
    return `${dayjs.duration(duration, "seconds").hours()}${
      labels.hours[label]
    } ${dayjs.duration(duration, "seconds").minutes()}${labels.minutes[label]}`;
  } else {
    return `${dayjs.duration(duration, "seconds").minutes()}${
      labels.minutes[label]
    } ${dayjs.duration(duration, "seconds").seconds()}${labels.seconds[label]}`;
  }
};

export const formatElevation = ({
  amount,
  miles,
  locale,
  label = "abbreviation",
  places = 0,
}) => {
  if (miles) {
    return (
      formatNumber({
        amount: units.convertMetersToFeet(amount),
        locale,
        places,
      }) + ` ${labels.feet[label]}`
    );
  } else {
    return (
      formatNumber({ amount, locale, places }) + ` ${labels.meters[label]}`
    );
  }
};

export const formatActivities = (activities, places) => {
  return formatNumber({ amount: activities, places });
};

export const getDistanceTotal = (page = {}) => {
  if (page.fitness_activity_overview) {
    const overview = page.fitness_activity_overview;

    return Object.keys(overview).reduce((total, key) => {
      return total + overview[key].distance_in_meters;
    }, 0);
  }

  return get(page, "metrics.fitness.total_in_meters", 0);
};

export const getDurationTotal = (page = {}) => {
  if (page.fitness_activity_overview) {
    const overview = page.fitness_activity_overview;

    return Object.keys(overview).reduce((total, key) => {
      return total + overview[key].duration_in_seconds;
    }, 0);
  }

  return get(page, "metrics.fitness.total_in_meters", 0);
};
