var opts = require('./config');
var prune = require('./prune');
var redisClient = require('redis').createClient;
var PostgresClient = require('pg-native');
var Server = require('uws').Server;

// Start redis connection
var redis = redisClient('redis://' + opts.redis);
redis.on('error', console.error.bind(console));

// Start postgres connection
var pg = new PostgresClient();
pg.connect('postgres://' + opts.postgres, function(err) {
  if (err) console.error(err);
  else pg.connected = true;
});

// Start prune system.
setInterval(prune(pg, redis), 21600000);

// Start WebSocket server
var soundcove = new Server(opts);
soundcove.on('error', console.error.bind(console));
soundcove.on('connection', require('./connection')(pg, redis));
