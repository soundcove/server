var methods = require('./methods');
var helpers = require('./helpers');

// Connection handler
module.exports = function(pg, redis) {
  return function connection(socket) {
    // Create method to close socket with unbreakable context.
    socket._close = socket.close;
    socket.close = function close() {
      return socket._close();
    };

    // Attach helpers to socket.
    socket.redis = redis;
    socket.pg = pg;
    helpers(socket);

    // Disconnect if resources aren't ready.
    if (!redis.connected || !pg.connected) {
      return socket.error('ServiceUnavailable', socket.close);
    }

    // Handle a socket message
    socket.on('message', function message(data) {
      // Parse message, disconnect if invalid JSON.
      try {
        data = JSON.parse(data);
      } catch (e) {
        return socket.error('InvalidJSON', socket.close);
      }

      // Disconnect if message types are invalid
      if (
        data.constructor !== Array || // Message body is an array.
        typeof data[0] !== 'string' || // Method is a string.
        methods.all.indexOf(data[0]) === -1 || // Method exists.
        typeof data[1] !== 'object' || !data[0] // Payload is a object.
      ) {
        return socket.error('InvalidMessage');
      }

      // Execute method handler function.
      methods[data[0]](socket, pg, redis, data[1]);
    });
  };
};
