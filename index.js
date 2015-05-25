var nconf = require('nconf');
nconf.env('__').file(process.cwd() + '/config.json');

var streamer = require('./lib/streamer');
var parser = require('./lib/parser');
var poster = require('./lib/poster');
var elastic = require('./lib/elastic');
var filter = require('./lib/filter');
var Q = require('q');
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

function emitFaces(faces) {
  var tweet = this;
  return Q.all(faces.map(function (face) {
    var faceObject = {
      face: face,
      tweet: tweet,
      timestamp: Date.now()
    };
    emit(faceObject);
    return faceObject;
  }));
}

function onTweet(tweet) {
  var parsedTweet = parser.parseTweet(tweet);

  if (parsedTweet) {
    poster
      .send(parsedTweet)
      .then(filter)
      .then(emitFaces.bind(parsedTweet))
      .then(elastic.saveFace)
      .then(elastic.saveTweet.bind(null, parsedTweet))
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
