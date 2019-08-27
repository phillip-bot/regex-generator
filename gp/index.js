'use strict';

const bunyan = require('bunyan');
const uuid = require('uuid');

const {generatePossibleRegexes} = require('../lib/regex-from-string');
const {treeToRegex} = require('../lib/regex');

const utils = require('./utils');
const {seedPopulation} = require('./seed-population');
const {fitness} = require('./fitness');
const {mutate} = require('./mutate');
const {crossover} = require('./crossover');

const stage = {};

const SATURATION = 1000;

const REPLICATION = 0.2;
const MUTATION = 0.3;
const CROSSOVER = 0.5;

const POPULATION_SIZE = 100000;
const DELTA_THRESHOLD = 0.0001;
const ITERATION_THRESHOLD = 5;

const LOG_LEVEL = process.env.LOG_LEVEL;

const log = bunyan.createLogger({
  name: 'regex-generator/gp',
  level: LOG_LEVEL
});

const run = function (
  examples,
  {
    weightedSize = false,

    // Educated guesses
    guessRegex = false,
    saturation = SATURATION,

    // Population
    population = [],
    populationSize = POPULATION_SIZE,

    // Population weights
    mutationWeight = MUTATION,
    crossoverWeight = CROSSOVER,
    replicationWeight = REPLICATION,

    // Termination conditions
    iterationsThreshold = ITERATION_THRESHOLD,
    deltaThreshold = DELTA_THRESHOLD
  } = {}
) {
  const seed = `seed-${uuid()}`;

  let delta = Infinity;
  let iterations = 0;
  let best = [];

  if (guessRegex) {
    examples.forEach(function (substring) {
      for (let i = 0; i < saturation; i++) {
        population = [...population, ...generatePossibleRegexes(substring)];
      }
    });
  }

  population = [...population, ...seedPopulation(populationSize)];

  for (
    let generation = 0;
    delta > deltaThreshold || iterations < iterationsThreshold;
    generation++
  ) {
    log.info(`Generation: ${generation}`);
    log.info('Fitness');
    const fitnessResult = stage.fitness(population, examples, weightedSize);
    const sortedPopulation = fitnessResult.population;

    log.info('Mutation');
    const mutationResult = stage.mutate(sortedPopulation, {
      weight: mutationWeight,
      populationSize
    });
    log.info('Cross over');
    const crossoverResult = stage.crossover(sortedPopulation, {
      weight: crossoverWeight,
      populationSize
    });

    population = [
      ...crossoverResult.population,
      ...mutationResult.population,
      ...sortedPopulation.slice(
        0,
        Math.ceil(populationSize * replicationWeight)
      )
    ];

    // Termination condition
    best.push(fitnessResult.scores[0]);

    const prevDelta = delta;
    if (best.length > 1) {
      delta = best[best.length - 2] - best[best.length - 1];
    }

    log.info(`Best: ${best[best.length - 1]}`);

    if (isNaN(delta)) {
      log.info(best[best.length - 2]);
      log.info(best[best.length - 1]);
      break;
    }

    if (prevDelta === delta) {
      iterations++;
    } else {
      iterations = 0;
    }
  }

  const regex = treeToRegex(stage.fitness(population, examples).population[0]);

  return {
    seed,
    regex
  };
};

/**
 * Assess the fitness of a population
 *
 * @param {Array<Node>} population - list of nodes
 * @param {Map<String, String>} examples - examples to test fitness
 * @returns {Object} a sorted population and sorted scores
 */
stage.fitness = function (population, examples, weightedSize) {
  let results = [];

  population.forEach(function (node) {
    try {
      const re = treeToRegex(node);

      let score = 0;
      // Const start = new Date();
      examples.forEach(function (expectedStr, string) {
        const match = string.match(re);
        const actualStr = match ? match[0] : '';

        score += fitness({node, actualStr, expectedStr, weightedSize});
      });

      /*
      Const end = new Date();
      const time = end - start;

      If (time > 10) {
        log.info(`\nTime penalty: ${time}`);
        log.info(re);
        score += time * 10;
      }
      */

      results.push({node, score});
    } catch (err) {
      if (!(err instanceof SyntaxError)) {
        console.error(err);
      }
    }
  });

  results = results.sort(function (a, b) {
    return a.score - b.score;
  });

  return {
    population: results.map(({node}) => node),
    scores: results.map(({score}) => score)
  };
};

/**
 * Mutate a population
 * @param {Array<Node>} sortedPopulation - array of candidates sorted by fitness
 * @return {Object} a mutated population
 */
stage.mutate = function (sortedPopulation, {weight, populationSize}) {
  const size = Math.max(
    Math.ceil(populationSize * weight),
    Math.ceil(sortedPopulation.length * weight)
  );

  const population = sortedPopulation.slice(0, size).map(function (node) {
    const mutated = mutate(node);

    return mutated;
  });

  return {
    population
  };
};

/**
 * Crosses with other members of the population
 * @param {Array<Node>} sortedPopulation - array of candidates sorted by fitness
 * @return {Object} a cross over population
 */
stage.crossover = function (sortedPopulation, {weight, populationSize}) {
  const size = Math.max(
    Math.ceil(populationSize * weight) / 2,
    Math.ceil(sortedPopulation.length * weight) / 2
  );
  const crossoverPopulation = sortedPopulation.slice(0, size);

  let population = [];
  crossoverPopulation.forEach(function (a) {
    const b = utils.getRandomValueFromArray(crossoverPopulation);
    const candidates = crossover(a, b);
    population = [...population, ...candidates];
  });

  return {population};
};

module.exports = {run};
