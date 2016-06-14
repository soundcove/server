var response = require('../../response');
var error = response.error;

module.exports = function login(socket, pg, redis, payload, session) {
  var username = payload.username;
  var password = payload.password;

  // Validate input for faster disconnect.
  if (
    typeof username === 'string' &&
    typeof password === 'string' &&
    username.length >= 2 && // Username more than 2
    username.length <= 20 && // Username less than 20
    password.length >= 8 && // Password more than 8
    password.length <= 80 // Password less than 80
  ) {
    // Select the password hash and compare.
    pg.query(`SELECT password FROM users WHERE username=$1::text`,
    [username], function(err, rows) {
      console.log(rows);
      if (err) {
        return socket.send(error.ServiceInternalError);
      }
    });
  } else {
    socket.send(error.InvalidInput);
  }
};
