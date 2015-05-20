'use strict';
var request = require('request');
var nconf = require('nconf');
var Q = require('q');

exports.send = function send(tweet) {
  return Q.promise(function (resolve, reject) {
    request.post({
      url: nconf.get('api').url,
      body: tweet,
      json: true
    }, function (err, result, body) {
      if (err) {
        return reject(err);
      }
      return resolve(body);
    });
  });
};
