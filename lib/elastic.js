'use strict';
var nconf = require('nconf');
var Q = require('q');
var elasticsearch = require('elasticsearch');

var client = new elasticsearch.Client({
  host: nconf.get('elasticsearch').host
});

exports.saveFace = function saveFace(faces) {
  return Q.all(faces.map(function (json) {
    json.timestamp = Date.now();
    var params = {
      index: 'face',
      type: 'item',
      id: json.faceId,
      body: json
    };
    return client.index(params);
  }));
};


exports.saveTweet = function saveTweet(json) {
  json.timestamp = Date.now();
  var params = {
    index: 'tweets',
    type: 'item',
    id: json.id,
    body: json
  };
  return Q.promise(function (resolve, reject) {
    client.index(params, function () {
      resolve(json);
    });
  });
};
