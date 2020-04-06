export const convertKmToMeters = data => data * 1000
export const convertMilesToMeters = data => data * 1609.344
export const convertFeetToMeters = data => data * 0.3048

export const convertMetersToKm = data => data / 1000
export const convertMetersToMiles = data => data * 0.000621371
export const convertMetersToFeet = data => data * 3.28084

export const convertMetersToUnit = (amount, unit) => {
  if (isNaN(amount)) {
    return 0
  }

  switch (unit) {
    case 'km':
    case 'kilometers':
    case 'kilometres':
      return convertMetersToKm(amount)
    case 'mi':
    case 'miles':
      return convertMetersToMiles(amount)
    case 'ft':
    case 'feet':
      return convertMetersToFeet(amount)
    default:
      return Number(amount)
  }
}

export const convertToMeters = (amount, unit = 'm') => {
  if (isNaN(amount)) {
    return 0
  }

  switch (unit) {
    case 'km':
    case 'kilometers':
    case 'kilometres':
      return convertKmToMeters(amount)
    case 'mi':
    case 'miles':
      return convertMilesToMeters(amount)
    case 'ft':
    case 'feet':
      return convertFeetToMeters(amount)
    default:
      return Number(amount)
  }
}

export const convertToSeconds = (amount, unit = 'seconds') => {
  if (isNaN(amount)) {
    return 0
  }

  switch (unit) {
    case 'day':
    case 'days':
      return amount * 86400
    case 'hr':
    case 'hrs':
    case 'hour':
    case 'hours':
      return amount * 3600
    case 'min':
    case 'minute':
    case 'minutes':
      return amount * 60
    default:
      return Number(amount)
  }
}
