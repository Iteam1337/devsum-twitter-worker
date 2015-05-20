var nconf = require('nconf');
nconf.env('__').file(process.cwd() + '/config.json');

var streamer = require('./lib/streamer');
var parser = require('./lib/parser');
var poster = require('./lib/poster');
var elastic = require('./lib/elastic');
var filter = require('./lib/filter');

var io = require('socket.io').listen(process.env.PORT ||  3000);

io.on('connection', function (socket) {
  socket.emit('news', {
    hello: 'world'
  });
});

io.on('error', function () {
  console.log('io error', arguments);
});

function emit(object) {
  console.log('\n Emit a face event', JSON.stringify(object));
  io.emit('face', object);
}

function onTweet(tweet) {
  var parsedTweet = parser.parseTweet(tweet);

  if (parsedTweet) {
    elastic.saveTweet(parsedTweet)
      .then(poster.send)
      .then(filter)
      .then(function (faces) {
        return elastic.saveFaces({
          faces: faces,
          tweet: parsedTweet
        }, emit);
      })
      .catch(function (error) {
        console.error('something borked!', error);
      })
      .done();
    } else {
      console.log('No images here', tweet);
    }
}

streamer
  .listen(onTweet)
  .then(function (tag) {
    console.log('started listening to %s tweets', tag);
  });
