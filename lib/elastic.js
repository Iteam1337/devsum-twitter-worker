'use strict';
var nconf = require('nconf');
var Q = require('q');
var elasticsearch = require('elasticsearch');

var client = new elasticsearch.Client({
  host: nconf.get('elasticsearch').host
});

exports.saveFace = function saveFace(json) {
  var params = {
    index: 'face',
    type: 'item',
    id: json.faceId,
    body: json
  };
  return client.index(params);
};


exports.saveTweet = function saveTweet(json) {
   var params = {
    index: 'tweets',
    type: 'item',
    id: json.id,
    body: json
  };
  return client.index(params);
};
