'use strict';

const gp = require('./gp');

/**
 * Generates a regex from a map of examples
 * @param {Map<String, String>} examples - a map of examples, where the key is the string and the value is the substring to match
 * @param {Object} options - configuration options
 * @param {Boolean} options.weightedSize - a flag to uses weighted sizes in genetic programming
 * @param {Boolean} options.guessRegex - guess the regex using the examples and use this as seed data for the genetic program
 * @param {Array<Node>} options.population - a seed population
 * @param {Number} options.populationSize - the size of a seed population
 * @param {Number} options.mutationWeight - percentage as a decimal of the size of the population to mutate
 * @param {Number} options.crossoverWeight - percentage as a decimal of the size of the population to crossover
 * @param {Number} options.replicationWeight - percentage as a decimal of the size of the population to replicate to the next
 * @param {Number} options.iterationsThreshold - number of iterations to determine convergence
 * @param {Number} options.deltaThreshold - the score difference between best canidates that will result in termination
 *
 * @return {Object} with seed and regex
 */
const regexFromExamples = function (examples, options) {
  return gp.run(examples, options);
};

module.exports = {regexFromExamples};
