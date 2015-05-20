'use strict';
var nconf = require('nconf');
var Q = require('q');
var elasticsearch = require('elasticsearch');

nconf.env().file(process.cwd() + '/config.json');

var client = new elasticsearch.Client({
  host: nconf.get('elasticsearch').host
});

exports.save = function save(tweet) {
  var params = {
    index: 'twitter',
    type: 'tweets',
    id: tweet.id,
    body: tweet
  };
  return client.index(params);
};
