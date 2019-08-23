'use strict';

const utils = require('../lib/utils');

const fitness = function ({node, actualStr, expectedStr}) {
  return node.size() * 0.01 + utils.editDistance(actualStr, expectedStr);
};

module.exports = {fitness};
