const added = require('./added');
const dontShow = require('./dontShow');
const misc = require('./misc');
const mustHaves = require('./mustHaves');
const price = require('./price');
const propertyType = require('./propertyType');
const radius = require('./radius');
const sort = require('./sort');
const viewType = require('./viewType');

module.exports = Object.freeze({
  ...added,
  ...dontShow,
  ...misc,
  ...mustHaves,
  ...price,
  ...propertyType,
  ...radius,
  ...sort,
  ...viewType,
});
