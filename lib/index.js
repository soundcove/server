var config = require('./config');
var Server = require('uws').Server;
var soundcove = new Server(config);
soundcove.on('error', console.error.bind(console));
soundcove.on('connection', require('./connect'));
