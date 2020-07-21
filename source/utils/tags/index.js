export const getPrimaryUnit = measurementDomain => {
  if (measurementDomain.indexOf('activities') > -1) {
    return 'count'
  }

  if (measurementDomain.indexOf('donations_made') > -1) {
    return 'count'
  }

  if (measurementDomain.indexOf('donations_received') > -1) {
    return 'gbp'
  }

  if (measurementDomain.indexOf('elapsed_time') > -1) {
    return 'seconds'
  }

  return 'meters'
}

export const measurementDomains = [
  'fundraising:donations_received',
  'fundraising:donations_made',
  'any:activities',
  'any:distance',
  'any:elapsed_time',
  'any:elevation_gain',
  'hike:activities',
  'hike:distance',
  'hike:elapsed_time',
  'hike:elevation_gain',
  'ride:activities',
  'ride:distance',
  'ride:elapsed_time',
  'ride:elevation_gain',
  'swim:activities',
  'swim:distance',
  'swim:elapsed_time',
  'swim:elevation_gain',
  'walk:activities',
  'walk:distance',
  'walk:elapsed_time',
  'walk:elevation_gain'
]
