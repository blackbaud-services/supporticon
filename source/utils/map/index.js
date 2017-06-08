const defaultMappings = {
  campaign: 'campaign_id',
  charity: 'charity_id',
  group: 'group_value',
  type: 'group_by',
  filter: 'q',
  startDate: 'start_at',
  endDate: 'end_date'
}

const defaultTransforms = {}

export default (params = {}, options = {}) => {
  const {
    mappings: customMappings = {},
    transforms: customTransforms = {}
  } = options

  const mappings = {
    ...defaultMappings,
    ...customMappings
  }

  const transforms = {
    ...defaultTransforms,
    ...customTransforms
  }

  const transformedParams = Object.keys(params).reduce((transformedParams, param) => {
    const transform = transforms[param]
    const value = params[param]
    const transformedValue = transform ? transform(value) : value
    return {
      ...transformedParams,
      [param]: transformedValue || value
    }
  }, {})

  const mappedParams = Object.keys(transformedParams).reduce((mappedParams, param) => {
    const key = mappings[param] || param
    return {
      ...mappedParams,
      [key]: transformedParams[param]
    }
  }, {})

  return mappedParams
}
