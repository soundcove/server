module.exports = function user(token, callback, verifying) {
  var socket = this;
  if (token) {
    // Validate session
    socket.redis.get(token, function(err, id) {
      if (err) return socket.error('InvalidSession');
      if (verifying) callback();
      else {
        // Get user from id
        socket.pg.query(`SELECT id AS "id", username AS "name", email AS "email"
                         FROM users
                         WHERE id=$1::int`,
        [id], function(err, rows) {
          if (err) return socket.error('ServiceInternal');
          callback(rows[0]);
        });
      }
    });
  } else {
    socket.error('InvalidSession');
  }
};
