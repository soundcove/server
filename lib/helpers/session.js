var response = require('../response');
var random = require('crypto').randomBytes;

module.exports = function session(id, callback) {
  var socket = this;

  // Create and save session token
  random(16, function randomBytes(err, bytes) {
    if (err) return socket.error('ServiceInternal', err);

    // Create and set token.
    var token = bytes.toString('hex');

    socket.redis.set(token, id, function(err) {
      if (err) return socket.error('ServiceInternal', err);

      // Respond
      if (callback) {
        socket.send(response('reply', {
          session: token
        }), function sent() {
          callback(id);
        });
      } else {
        socket.send(response('reply', {
          session: token
        }));
      }
    });

    socket.pg.query(`INSERT INTO sessions (uid, token, expire)
                     VALUES ($1::int, $2::text, now() + interval '4 days')`,
    [id, token], function(err) {
      if (err) return socket.error('ServiceInternal', err);
    });
  });
};
