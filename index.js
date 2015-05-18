var express = require('express');
var streamer = require('./lib/streamer');
var app = express();

app.listen(process.env.PORT ||  3000, streamer.listen);
