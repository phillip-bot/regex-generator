'use strict';

const gp = require('./gp');

const regexFromExamples = function (examples, options) {
  return gp.run(examples, options);
};

module.exports = {regexFromExamples};
