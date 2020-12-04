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

export const defaultPageTags = page => {
  const tags = [
    {
      tagDefinition: {
        id: 'page:totals',
        label: 'Page Totals'
      },
      value: `page:fundraising:${page.uuid}`,
      aggregation: [{
        measurementDomains: ['all'],
        segment: 'page:totals'
      }]
    },
    {
      tagDefinition: {
        id: 'CommsFitness',
        label: 'CommsFitness'
      },
      value: `page:fundraising:${page.uuid}`,
      aggregation: [{
        measurementDomains: [
          'any:activities',
          'any:distance',
          'any:elapsed_time',
          'any:elevation_gain',
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
        ],
        segment: 'AllCommsFitness'
      }]
    },
    {
      tagDefinition: {
        id: 'page:charity',
        label: 'Charity Link'
      },
      value: `page:charity:${page.charityId}`,
      aggregation: [{
        measurementDomains: ['all'],
        segment: `page:charity:${page.charityId}`
      }]
    },
    {
      tagDefinition: {
        id: `page:charity:${page.charityId}`,
        label: 'Page Charity Link'
      },
      value: `page:fundraising:${page.uuid}`,
      aggregation: [{
        measurementDomains: ['all'],
        segment: `page:charity:${page.charityId}`
      }]
    },
    {
      tagDefinition: {
        id: 'page:event',
        label: 'Event Link'
      },
      value: `page:event:${page.event}`,
      aggregation: [{
        measurementDomains: ['all'],
        segment: `page:event:${page.event}`
      }]
    },
    {
      tagDefinition: {
        id: `page:event:${page.event}`,
        label: 'Page Event Link'
      },
      value: `page:fundraising:${page.uuid}`,
      aggregation: [{
        measurementDomains: ['all'],
        segment: `page:event:${page.event}`
      }]
    }
  ]

  const campaignTags = [
    {
      tagDefinition: {
        id: 'page:campaign',
        label: 'Campaign Link'
      },
      value: `page:campaign:${page.campaign}`,
      aggregation: [{
        measurementDomains: ['all'],
        segment: `page:campaign:${page.campaign}`
      }]
    },
    {
      tagDefinition: {
        id: 'page:campaign:charity',
        label: 'Charity Campaign Link'
      },
      value: `page:campaign:${page.campaign}:charity:${page.charityId}`,
      aggregation: [{
        measurementDomains: ['all'],
        segment: `page:campaign:${page.campaign}:charity:${page.charityId}`
      }]
    },
    {
      tagDefinition: {
        label: 'Page Campaign Link',
        id: `page:campaign:${page.campaign}`
      },
      value: `page:fundraising:${page.uuid}`,
      aggregation: [{
        measurementDomains: ['all'],
        segment: `page:campaign:${page.campaign}`
      }]
    },
    {
      tagDefinition: {
        label: 'Page Charity Campaign Link',
        id: `page:campaign:${page.campaign}:charity:${page.charityId}`
      },
      value: `page:fundraising:${page.uuid}`,
      aggregation: [{
        measurementDomains: ['all'],
        segment: `page:campaign:${page.campaign}:charity:${page.charityId}`
      }]
    }
  ]

  return page.campaign ? campaignTags.concat(tags) : tags
}
