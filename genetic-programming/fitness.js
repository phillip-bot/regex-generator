'use strict';

const ALPHA = 0.01;

const fitness = function ({node, actualStr, expectedStr}) {
  const weightedLength = ALPHA * node.size();
  return weightedLength + editDistance(actualStr, expectedStr);
};

function editDistance(strA, strB) {
  const m = strA.length + 1;
  const n = strB.length + 1;

  const editDistance = [];

  for (let i = 0; i < m; i++) {
    editDistance.push([]);
    for (let j = 0; j < n; j++) {
      if (i === 0) {
        editDistance[i][j] = j;
      } else if (j === 0) {
        editDistance[i][j] = i;
      } else if (strA[i - 1] === strB[j - 1]) {
        editDistance[i][j] = editDistance[i - 1][j - 1];
      } else {
        editDistance[i][j] =
          1 +
          Math.min(
            editDistance[i][j - 1],
            editDistance[i - 1][j],
            editDistance[i - 1][j - 1]
          );
      }
    }
  }

  return editDistance[m - 1][n - 1];
}

module.exports = {fitness};
