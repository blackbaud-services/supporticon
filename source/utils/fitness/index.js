import numbro from 'numbro'
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import get from 'lodash/get'
import * as units from '../units'

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

export const formatDistance = (distance, miles, label = 'abbreviation') => {
  if (miles) {
    return (
      numbro(units.convertMetersToMiles(distance)).format('0,0[.]0[0]') +
      ` ${labels.miles[label]}`
    )
  } else {
    return (
      numbro(units.convertMetersToKm(distance)).format('0,0[.]0[0]') +
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

export const formatElevation = (elevation, miles, label = 'abbreviation') => {
  if (miles) {
    return (
      numbro(units.convertMetersToFeet(elevation)).format('0,0') +
      ` ${labels.feet[label]}`
    )
  } else {
    return numbro(elevation).format('0,0') + ` ${labels.meters[label]}`
  }
}

export const formatActivities = activities => {
  return numbro(activities).format('0,0')
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
