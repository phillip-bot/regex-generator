'use strict';

const utils = require('./utils');

/**
 * @param {Number} size - population size
 * @param {String} seed - a seed for random number generation
 * @returns {Array<Node>} an array of Regex trees
 */
const seedPopulation = function (size) {
  const population = [];

  for (let i = 0; i < size; i++) {
    const operation = utils.generateRegex();
    population.push(operation);
  }

  return population;
};

module.exports = {seedPopulation};
