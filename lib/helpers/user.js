var validate = require('../validate');

module.exports = function user(token, callback, verifying) {
  var socket = this;

  // Validate input
  if (!validate(token)) {
    return socket.error('InvalidSession');
  }

  // Validate session
  socket.redis.get(token, function(err, id) {
    if (err) return socket.error('InvalidSession');
    if (verifying) return callback();

    // Get user from id
    socket.pg.query(`SELECT id AS "id", username AS "name", email AS "email"
                     FROM users
                     WHERE id=$1::int`,
    [id], function(err, rows) {
      if (err) return socket.error('ServiceInternal');
      callback(rows[0]);
    });
  });
};
