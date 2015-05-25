var nconf = require('nconf');
nconf.env('__').file(process.cwd() + '/config.json');

var streamer = require('./lib/streamer');
var parser = require('./lib/parser');
var poster = require('./lib/poster');
var elastic = require('./lib/elastic');
var filter = require('./lib/filter');
var lastFace;

var io = require('socket.io').listen(process.env.PORT ||  3000);

io.on('connection', function (socket) {
  if (lastFace) {
    socket.emit('face', lastFace);
  }
});

function emit(face) {
  console.log('\n Emit a face event', JSON.stringify(face));
  io.emit('face', face);
  lastFace = face;
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
      .catch(function () {
        console.error('something borked!', arguments);
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

streamer.search(onTweet);
