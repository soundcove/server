var response = require('../../response');
var bcrypt = require('bcrypt');
var random = require('crypto').randomBytes;
var error = response.error;

module.exports = function login(socket, pg, redis, payload) {
  var username = payload.username;
  var password = payload.password;

  // Validate input for faster disconnect.
  if (
    typeof username !== 'string' ||
    typeof password !== 'string' ||
    username.length <= 2 || // Username more than 2
    username.length >= 20 || // Username less than 20
    password.length <= 8 || // Password more than 8
    password.length >= 80 // Password less than 80
  ) {
    return socket.send(error.InvalidInput);
  }

  // Select the password hash from username.
  pg.query(`SELECT (id AS id, password AS password) FROM users
            WHERE username=$1::text;`,
  [username], function(err, rows) {
    console.log(rows);
    if (err || rows.length > 1) {
      console.error(err);
      return socket.send(error.ServiceInternal);
    } else if (!rows.length) {
      return socket.send(error.UserNonexistent);
    }

    // Compare the input with the hash
    bcrypt.compare(password, rows[0].password, function(err, equal) {
      if (err) {
        console.error(err);
        return socket.send(error.ServiceInternal);
      } else if (!equal) {
        return socket.send(error.InvalidPassword);
      }

      // Create and save session token
      var token = random(8).toString('hex');
      redis.set(token, rows[0].id, function(err) {
        if (err) {
          console.error(err);
          return socket.send(error.ServiceInternal);
        }

        // Respond
        socket.send(response('user/login', {
          token: token
        }));
      });
    });
  });
};
