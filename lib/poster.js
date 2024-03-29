'use strict';
var request = require('request');
var nconf = require('nconf');
var Q = require('q');

exports.send = function send(tweet) {
  return Q.promise(function (resolve, reject) {
    var url = nconf.get('faceapi').url;
    console.log('\n sending picture to api at %s', url, tweet);

    // request.get({
    //   url: url,
    //   timeout: 10000,
    //   qs: {
    //     url: tweet.images.slice().shift().media_url
    //   },
    //   json: true
    // }, function (err, result, body) {
    //   if (err) {
    //     console.log('got error from api', err);
    //     return reject(err);
    //   }
    //   console.log('got response from api', body);
    //   return resolve(body);
    // });

    request.post({
      url: url,
      body: {
        url: tweet.images.slice().shift().media_url
      },
      json: true
    }, function (err, result, body) {
      if (err) {
        console.log('got error from api', err);
        return reject(err);
      }
      console.log('got response from api', body);
      return resolve({
        Result: body
      });
    })
  });
};
