'use strict';
var Q = require('q');

module.exports = function filter(response) {
  return Q.Promise(function (resolve, reject) {
    if (!response.Result) {
      return reject('Not a human');
    }
    return resolve(response.Result);
  });
};
