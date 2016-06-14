var response = require('../response');
var random = require('crypto').randomBytes;

module.exports = function session(id, name, callback) {
  var socket = this;

  // Create and save session token
  random(8, function randomBytes(err, bytes) {
    if (err) return socket.error('ServiceInternal', err);

    // Create and set token.
    var token = bytes.toString('hex');

    socket.redis.set(token, id, function(err) {
      if (err) return socket.error('ServiceInternal', err);

      // Respond
      if (callback) {
        socket.send(response(name, {
          session: token
        }), function sent() {
          callback(id);
        });
      } else {
        socket.send(response(name, {
          session: token
        }));
      }
    });

    socket.pg.query(`INSERT INTO sessions (uid, token, expire)
                     VALUES ($1::int, $2::text, now() + interval '12 hours')`,
    [id, token], function(err) {
      if (err) return socket.error('ServiceInternal', err);
    });
  });
};
