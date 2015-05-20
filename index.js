var nconf = require('nconf');
nconf.env('__').file(process.cwd() + '/config.json');

var streamer = require('./lib/streamer');
var parser = require('./lib/parser');
var poster = require('./lib/poster');
var elastic = require('./lib/elastic');
var filter = require('./lib/filter');

var io = require('socket.io').listen(process.env.PORT ||  3000);

io.on('connection', function (socket) {
  socket.emit('news', { hello: 'world' });
});

io.on('error', function(){ console.log('io error', arguments); });

function onTweet(tweet) {
  parser
    .parseTweet(tweet)
    .then(elastic.saveTweet)
    .then(poster.send)
    .then(filter)
    .then(elastic.saveFace)
    .then(io.emit)
    .catch(function (error) {
      console.error('something borked!', error);
    })
    .done();
}

streamer
.listen(onTweet)
.then(function () {
  console.log('started listening to tweets');
});
