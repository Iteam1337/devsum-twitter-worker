'use strict';
var request = require('request');
var nconf = require('nconf');

nconf.env().file(process.cwd() + '/config.json');

exports.send = function send(tweet) {
  console.log(JSON.stringify(tweet));
  return;
  request.post({
    url: nconf.get('api').url,
    body: tweet,
    json: true
  }, function (err, result) {

    console.log('result', result);
  });
};
