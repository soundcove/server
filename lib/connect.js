var methods = require('./methods');
var response = require('./response');
var redisClient = require('redis').createClient;
var PostgresClient = require('pg-native');
var opts = require('./config');
var error = response.error;

var redis = redisClient(opts.redis);
redis.on('error', console.error.bind(console));

var pg = new PostgresClient();
pg.connect(opts.postgres, function(err) {
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
    socket.on('message', function message(data) {
      try {
        data = JSON.parse(data);
      } catch (e) {
        return socket.send(error.InvalidJSON, socket.kill);
      }

      var method = data.method;
      var payload = data.payload;
      if (!method || !payload || methods.all.indexOf(method) === -1) {
        return socket.send(error.InvalidMessage);
      }

      var session = data.session || null;
      methods[method](socket, pg, redis, payload, session);
    });
  } else {
    socket.send(error.ServiceUnavailable, socket.kill);
  }
};
