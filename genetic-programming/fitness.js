'use strict';

const utils = require('../lib/utils');

const fitness = function ({node, actualStr, expectedStr}) {
  return utils.editDistance(actualStr, expectedStr);
};

module.exports = {fitness};
