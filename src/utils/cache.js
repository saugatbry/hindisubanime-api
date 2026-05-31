const NodeCache = require('node-cache');
const config = require('../config');

const cache = new NodeCache({
  stdTTL: config.cacheTtl,
  checkperiod: 120,
});

module.exports = cache;
