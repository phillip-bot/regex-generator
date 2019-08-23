'use strict';
const uuid = require('uuid');

const {treeToRegex} = require('../lib/regex');

const utils = require('./utils');
const {seedPopulation} = require('./seed-population');
const {fitness} = require('./fitness');
const {mutate} = require('./mutate');
const {crossover} = require('./crossover');

const stage = {};

const REPLICATION = 0.2;
const MUTATION = 0.3;
const CROSSOVER = 0.5;

const POPULATION_SIZE = 1000;
const DELTA_THRESHOLD = 0.0001;
const ITERATION_THRESHOLD = 3;

const run = function (
  examples,
  {
    mutationWeight = MUTATION,
    crossoverWeight = CROSSOVER,
    replicationWeight = REPLICATION,
    iterationsThreshold = ITERATION_THRESHOLD,
    deltaThreshold = DELTA_THRESHOLD,
    populationSize = POPULATION_SIZE
  } = {}
) {
  const seed = `seed-${uuid()}`;

  let delta = Infinity;
  let iterations = 0;
  let best = [];

  let population = seedPopulation(populationSize);
  for (
    let generation = 0;
    delta > deltaThreshold || iterations < iterationsThreshold;
    generation++
  ) {
    // Console.log(`Generation: ${generation}`);
    // console.log(`...Delta: ${delta}`);

    const fitnessResult = stage.fitness(population, examples);
    const sortedPopulation = fitnessResult.population;

    const mutationResult = stage.mutate(sortedPopulation, {
      weight: mutationWeight,
      populationSize
    });
    const crossoverResult = stage.crossover(sortedPopulation, {
      weight: crossoverWeight,
      populationSize
    });

    population = [
      ...crossoverResult.population,
      ...mutationResult.population,
      ...sortedPopulation.slice(0, sortedPopulation * replicationWeight)
    ];

    // Termination condition
    best.push(fitnessResult.scores[0]);

    const prevDelta = delta;
    if (best.length >= 2) {
      delta = best[best.length - 2] - best[best.length - 1];
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
stage.fitness = function (population, examples) {
  let results = [];
  population.forEach(function (node) {
    try {
      const re = treeToRegex(node);

      let score = 0;
      examples.forEach(function (expectedStr, string) {
        const match = string.match(re);
        const actualStr = match ? match[0] : '';

        score += fitness({node, actualStr, expectedStr});
      });

      results.push({node, score: score});
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
  const size = Math.min(
    populationSize * weight,
    sortedPopulation.length * weight
  );
  return {population: sortedPopulation.slice(0, size).map(mutate)};
};

/**
 * Crosses with other members of the population
 * @param {Array<Node>} sortedPopulation - array of candidates sorted by fitness
 * @return {Object} a cross over population
 */
stage.crossover = function (sortedPopulation, {weight, populationSize}) {
  const size = Math.min(
    (populationSize * weight) / 2,
    (sortedPopulation.length * weight) / 2
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
