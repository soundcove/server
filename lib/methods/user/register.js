var opts = require('../../config');
var bcrypt = require('bcrypt');
var validate = require('../../validate');

// "user/register" method handler.
module.exports = function userRegister(socket, pg, redis, payload, name) {
  var username = payload.username;
  var password = payload.password;
  var email = payload.email;

  // Validate inputs
  if (
    !validate.username(username) ||
    !validate.password(password) ||
    !validate.email(email)
  ) {
    return socket.error('InvalidInput');
  }

  // Check that username and email are not registered
  pg.query(`SELECT (username, email)
            FROM users
            WHERE (username = $1::text OR email = $2::text)`,
  [username, email], function(err, rows) {
    if (err) return socket.error('ServiceInternal', err);
    if (rows.length) return socket.error('UserExists');

    // Hash password with configuration salt
    bcrypt.hash(password, opts.salt, function(err, hash) {
      if (err) return socket.error('ServiceInternal', err);

      // Insert inputs into database
      pg.query(`INSERT INTO users (username, password, email)
                VALUES ($1::text, $2::text, $3::text)
                RETURNING id;`,
      [username, hash, email], function(err, rows) {
        if (err) socket.error('ServiceInternal');

        // Create session
        socket.session(rows[0].id, name);
      });
    });
  });
};
