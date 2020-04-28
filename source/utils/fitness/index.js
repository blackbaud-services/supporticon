import numbro from 'numbro'
import moment from 'moment'
import get from 'lodash/get'
import * as units from '../units'

export const formatDistance = (distance, miles) => {
  if (miles) {
    const distanceInMiles = units.convertMetersToMiles(distance)

    return distanceInMiles < 0.5
      ? numbro(distanceInMiles * 1760).format('0,0') + ' yd'
      : numbro(distanceInMiles).format('0,0[.]0') + ' mi'
  } else {
    return distance < 1000
      ? numbro(distance).format('0,0') + ' m'
      : numbro(units.convertMetersToKm(distance)).format('0,0[.]0') + ' km'
  }
}

export const formatDuration = duration => {
  if (duration >= 86400) {
    return `${Math.floor(
      moment.duration(duration, 'seconds').asDays()
    )}d ${moment.duration(duration, 'seconds').hours()}h`
  } else if (duration >= 3600) {
    return `${moment.duration(duration, 'seconds').hours()}h ${moment
      .duration(duration, 'seconds')
      .minutes()}m`
  } else {
    return `${moment
      .duration(duration, 'seconds')
      .minutes()}m ${moment.duration(duration, 'seconds').seconds()}s`
  }
}

export const formatElevation = (elevation, miles) => {
  if (miles) {
    return numbro(units.convertMetersToFeet(elevation)).format('0,0') + ' ft'
  } else {
    return numbro(elevation).format('0,0') + ' m'
  }
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
