import { getUID } from '../params';

const defaultMappings = {
  campaign: 'campaignGuid',
  charity: 'charityId',
  event: 'eventId',
  endDate: 'end',
  filter: 'q',
  startDate: 'start',
};

const transformUid = (v) => (Array.isArray(v) ? v.map(getUID) : getUID(v));

const defaultTransforms = {
  charity: transformUid,
  campaign: transformUid,
  event: transformUid,
};

export default (params = {}, options = {}) => {
  const { mappings: customMappings = {}, transforms: customTransforms = {} } = options;

  const mappings = {
    ...defaultMappings,
    ...customMappings,
  };

  const transforms = {
    ...defaultTransforms,
    ...customTransforms,
  };

  const transformedParams = Object.keys(params).reduce((transformedParams, param) => {
    const transform = transforms[param];
    const value = params[param];
    const transformedValue = transform ? transform(value) : value;
    return {
      ...transformedParams,
      [param]: transformedValue || value,
    };
  }, {});

  const mappedParams = Object.keys(transformedParams).reduce((mappedParams, param) => {
    const key = mappings[param] || param;
    return {
      ...mappedParams,
      [key]: transformedParams[param],
    };
  }, {});

  return mappedParams;
};
