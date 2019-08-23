'use strict';

const utils = require('./utils');

const mutate = function (node) {
  const newNode = node.copy();
  const mutation = utils.generateRegex();
  return utils.join(newNode, mutation);
};

module.exports = {mutate};
