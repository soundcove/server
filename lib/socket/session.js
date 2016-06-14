var response = require('../response');
var random = require('crypto').randomBytes;

module.exports = function session(id, name, callback) {
  var socket = this;

  // Create and save session token
  random(8, function randomBytes(err, bytes) {
    if (err) return socket.error('InternalService', err);

    // Create and set token.
    var token = bytes.toString('hex');
    socket.redis.set(token, id, function(err) {
      if (err) return socket.error('InternalService', err);

      // Respond
      if (callback) {
        socket.send(response(name, {
          token: token
        }), function sent() {
          callback(id);
        });
      } else {
        socket.send(response(name, {
          token: token
        }));
      }
    });
  });
};
