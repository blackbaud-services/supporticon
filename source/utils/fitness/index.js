import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import get from 'lodash/get'
import * as units from '../units'
import { formatNumber } from '../numbers'

dayjs.extend(duration)

const labels = {
  kilometers: { abbreviation: 'km', full: 'kilometers' },
  miles: { abbreviation: 'mi', full: 'miles' },
  feet: { abbreviation: 'ft', full: 'feet' },
  days: { abbreviation: 'd', full: 'days' },
  hours: { abbreviation: 'h', full: 'hours' },
  minutes: { abbreviation: 'm', full: 'minutes' },
  seconds: { abbreviation: 's', full: 'seconds' },
  meters: { abbreviation: 'm', full: 'meters' }
}

export const formatMeasurementDomain = sortBy => {
  switch (sortBy) {
    case 'duration':
      return 'elapsed_time'
    case 'elevation':
      return 'elevation_gain'
    default:
      return sortBy
  }
}

export const formatDistance = ({
  amount,
  miles,
  label = 'abbreviation',
  places = 0
}) => {
  if (miles) {
    return (
      formatNumber({ amount: units.convertMetersToMiles(amount), places }) +
      ` ${labels.miles[label]}`
    )
  } else {
    return (
      formatNumber({ amount: units.convertMetersToKm(amount), places }) +
      ` ${labels.kilometers[label]}`
    )
  }
}

export const formatDuration = (duration, label = 'abbreviation') => {
  if (duration >= 86400) {
    return `${Math.floor(dayjs.duration(duration, 'seconds').asDays())}${
      labels.days[label]
    } ${dayjs.duration(duration, 'seconds').hours()}${labels.hours[label]}`
  } else if (duration >= 3600) {
    return `${dayjs.duration(duration, 'seconds').hours()}${
      labels.hours[label]
    } ${dayjs.duration(duration, 'seconds').minutes()}${labels.minutes[label]}`
  } else {
    return `${dayjs.duration(duration, 'seconds').minutes()}${
      labels.minutes[label]
    } ${dayjs.duration(duration, 'seconds').seconds()}${labels.seconds[label]}`
  }
}

export const formatElevation = (
  elevation,
  miles,
  label = 'abbreviation',
  places
) => {
  if (miles) {
    return (
      formatNumber({ amount: units.convertMetersToFeet(elevation), places }) +
      ` ${labels.feet[label]}`
    )
  } else {
    return (
      formatNumber({ amount: elevation, places }) + ` ${labels.meters[label]}`
    )
  }
}

export const formatActivities = (activities, places) => {
  return formatNumber({ amount: activities, places })
}

export const getDistanceTotal = (page = {}) => {
  if (page.fitness_activity_overview) {
    const overview = page.fitness_activity_overview

    return Object.keys(overview).reduce((total, key) => {
      return total + overview[key].distance_in_meters
    }, 0)
  }

  return get(page, 'metrics.fitness.total_in_meters', 0)
}

export const getDurationTotal = (page = {}) => {
  if (page.fitness_activity_overview) {
    const overview = page.fitness_activity_overview

    return Object.keys(overview).reduce((total, key) => {
      return total + overview[key].duration_in_seconds
    }, 0)
  }

  return get(page, 'metrics.fitness.total_in_meters', 0)
}
