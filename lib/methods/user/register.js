var response = require('../../response');
var opts = require('../../config');
var bcrypt = require('bcrypt');
var random = require('crypto').randomBytes;
var error = response.error;

module.exports = function authRegister(socket, pg, redis, payload) {
  var username = payload.username;
  var password = payload.password;
  var email = payload.email;

  // Validate inputs
  if (
    typeof username !== 'string' ||
    typeof password !== 'string' ||
    typeof email !== 'string' ||
    username.length <= 2 || // Username more than 2
    username.length >= 20 || // Username less than 20
    password.length <= 8 || // Password more than 8
    password.length >= 80 || // Password less than 80
    email.length >= 254 || // Email less than 254
    !email.indexOf('@') || !email.indexOf('.') // Email contains "@" and "."
  ) {
    return socket.send(error.InvalidInput);
  }

  // Check that username and email are not registered
  pg.query(`SELECT (username, email) FROM users
            WHERE (id=$1::integer OR email=$2::text)`,
  [username, email], function(err, rows) {
    if (err) {
      console.error(err);
      return socket.send(error.ServiceInternal);
    } else if (rows.length) {
      return socket.send(error.UserExists);
    }

    // Hash password with configuration salt
    bcrypt.hash(password, opts.salt, function(err, hash) {
      if (err) {
        return socket.send(error.ServiceInternal);
      }

      // Insert inputs into database
      pg.query(`INSERT INTO users (username, password, email)
                VALUES ($1::text, $2::text, $3::text)
                RETURNING id;`,
      [username, hash, email], function(err, rows) {
        if (err) {
          return socket.send(error.ServiceInternal);
        }

        // Create and save session token
        var token = random(8).toString('hex');
        redis.set(token, rows[0].id, function(err) {
          if (err) {
            return socket.send(error.ServiceInternal);
          }

          // Respond
          socket.send(response('auth/register', {
            token: token
          }));
        });
      });
    });
  });
};
