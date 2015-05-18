'use strict';
var request = require('request');
var nconf = require('nconf');
var parser = require('./parser');

nconf.env().file(process.cwd() + '/config.json');

exports.send = function send(tweet) {
  var parsedTweet = parser.parseTweet(tweet);
  if (parsedTweet) {
    request.post({
      url: nconf.get('api').url,
      body: parsedTweet,
      json: true
    }, function (err, result, body) {
      if (err) {
        console.log(err);
      } else if (result.statusCode === 200) {
        console.log('body', body);
      }
    });
  }
};
