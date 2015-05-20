var nconf = require('nconf');
nconf.env('__').file(process.cwd() + '/config.json');

var express = require('express');
var streamer = require('./lib/streamer');
var parser = require('./lib/parser');
var poster = require('./lib/poster');
var elastic = require('./lib/elastic');
var filter = require('./lib/filter');
var app = express();

function onTweet(tweet) {
  parser
    .parseTweet(tweet)
    .then(elastic.saveTweet)
    .then(poster.send)
    .then(filter)
    .then(elastic.saveFace)
    .catch(function (error) {
      console.log('something borked!', error);
    })
    .done();
}

app.listen(process.env.PORT ||  3000, function () {
  streamer
  .listen(onTweet)
  .then(function () {
    console.log('started listening to tweets');
  });
});
