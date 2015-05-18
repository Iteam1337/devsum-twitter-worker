var express = require('express');
var worker = require('./lib/worker');
var app = express();

app.listen(process.env.PORT ||  3000, worker.listen);
