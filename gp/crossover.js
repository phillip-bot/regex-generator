'use strict';

const {Literal} = require('../lib/regex');
const utils = require('./utils');

const crossover = function (a, b) {
  if (a instanceof Literal || b instanceof Literal) {
    return [a, b];
  }

  return [cross(a, b), cross(b, a)];
};

function cross(a, b) {
  const branch = utils.cut(b);
  return utils.join(a, branch);
}

module.exports = {crossover};
