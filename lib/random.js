'use strict';

const seedrandom = require('seedrandom');
const uuid = require('uuid');

const seed = `seed-${uuid}`;
let number = seedrandom(seed);

const setSeed = function () {
  number = seedrandom(seed);
};

module.exports = {number, setSeed};
