var config = require('./config');
var Server = require('uws').Server;
var soundcove = new Server(config);
soundcove.on('error', require('./error'));
soundcove.on('connection', require('./connect'));
