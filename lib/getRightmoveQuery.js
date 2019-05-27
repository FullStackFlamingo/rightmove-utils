const Ajv = require('ajv');
const queryString = require('query-string');
const getStationPolyLine = require('./getStationPolyLine');
const Constants = require('./constants');
const ConstantsViewType = require('./constants/viewType');
const ConstantsPropertyType = require('./constants/propertyType');
const ConstantsDontShow = require('./constants/dontShow');
const ConstantsSort = require('./constants/sort');
const ConstantsPrice = require('./constants/price');
const ConstantsRadius = require('./constants/radius');

// useDefaults - fill in defaults if values missing
const ajv = new Ajv({ useDefaults: true });

const rightmoveOptionsSchema = {
  type: 'object',
  properties: {
    locationIdentifier: {
      type: 'string',
    },
    stationId: {
      type: 'string',
    },
    searchLocation: {
      type: 'string',
    },
    viewType: {
      type: 'string',
      enum: [...Object.values(ConstantsViewType)],
      default: Constants.VIEW_TYPE_LIST,
    },
    channel: { type: 'string', default: Constants.CHANNEL_TYPE_BUY },
    minBedrooms: {
      type: ['integer', 'null'],
      anyOf: [{ maximum: 10 }, { type: 'integer' }],
      default: 1,
    },
    maxBedrooms: {
      type: ['integer', 'null'],
      anyOf: [{ maximum: 10 }, { type: 'integer' }],
      default: null,
    },
    maxPrice: {
      type: ['integer', 'null'],
      enum: [...Object.values(ConstantsPrice), null],
      default: null,
    },
    minPrice: {
      type: ['integer', 'null'],
      enum: [...Object.values(ConstantsPrice), null],
      default: null,
    },
    numberOfPropertiesPerPage: {
      type: 'integer',
      anyOf: [{ maximum: 499 }, { type: 'integer' }],
      default: 499,
    },
    radius: {
      type: 'string',
      enum: [...Object.values(ConstantsRadius)],
      default: Constants.RADIUS_1,
    },
    propertyTypes: {
      type: 'array',
      items: {
        type: 'string',
        enum: [...Object.values(ConstantsPropertyType)],
        default: [],
      },
      default: [...Object.values(ConstantsPropertyType)],
    },
    dontShow: {
      type: 'array',
      items: {
        type: 'string',
        enum: [...Object.values(ConstantsDontShow)],
        default: [],
      },
      default: [],
    },
    // primaryDisplayPropertyType: { type: 'string', default: 'houses' },
    includeSSTC: { type: 'boolean', default: false },
    areaSizeUnit: { type: 'string', default: Constants.AREA_SIZE_SQFT },
    sortType: {
      type: 'integer',
      enum: [...Object.values(ConstantsSort)],
      default: Constants.SORT_TYPE_NEWEST,
    },
  },

  if: {
    properties: {
      stationId: { not: { type: 'string' } },
    },
  },
  then: { required: ['locationIdentifier'] },
};

module.exports = async (options = {}) => {
  const validate = ajv.compile(rightmoveOptionsSchema);
  const isValid = validate(options);
  if (!isValid) {
    const error = new Error();
    error.errors = JSON.parse(JSON.stringify(validate.errors));
    throw error;
  }

  let qs = queryString.stringify({
    ...options,
    propertyTypes: options.propertyTypes.join(','),
    dontShow: options.dontShow.join(','),
  });

  // if stationId supplied, set locationIdentifier to station polyline
  if (options.stationId) {
    const encodedLatLng = getStationPolyLine(options.stationId);
    qs = `${qs}&locationIdentifier=USERDEFINEDAREA^{"polylines":"${encodedLatLng}"}`;
  }

  return qs;
};
