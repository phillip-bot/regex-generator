'use strict';

const gp = require('./gp');

const regexFromExamples = function (examples) {
  return gp.run(examples);
};

module.exports = {regexFromExamples};
