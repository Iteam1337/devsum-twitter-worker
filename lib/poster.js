'use strict';
var request = require('request');
var nconf = require('nconf');
var Q = require('q');

exports.send = function send(tweet) {
  return Q.promise(function (resolve, reject) {
    console.log('\n sending picture to api');
    request.get({
      url: nconf.get('api').url,
      qs: {
        url: tweet.images.slice().shift().media_url
      },
      json: true
    }, function (err, result, body) {
      if (err) {
        console.log('got error from api', err);
        return reject(err);
      }
      console.log('got response from api', body);
      return resolve(body);
    });
  });
};
