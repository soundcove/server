var methods = require('./methods');
var redisClient = require('redis').createClient;
var PostgresClient = require('pg-native');
var opts = require('./config');
var attach = require('./socket');

var redis = redisClient('redis://' + opts.redis);
redis.on('error', console.error.bind(console));

var pg = new PostgresClient();
pg.connect('postgres://' + opts.postgres, function(err) {
  if (err) {
    console.error(err);
  } else {
    pg.connected = true;
  }
});

module.exports = function connect(socket) {
  socket.kill = function kill() {
    socket.close();
  };

  if (redis.connected && pg.connected) {
    socket.redis = redis;
    socket.pg = pg;
    attach(socket);
    socket.on('message', function message(data) {
      try {
        data = JSON.parse(data);
      } catch (e) {
        return socket.error('InvalidJSON', socket.kill);
      }

      var method = data.method;
      var payload = data.payload;
      if (!method || methods.all.indexOf(method) === -1) {
        return socket.error('InvalidMessage');
      }

      var session = data.session || null;
      methods[method](socket, pg, redis, payload, session);
    });
  } else {
    socket.error('ServiceUnavailable', socket.kill);
  }
};
