var bcrypt = require('bcrypt');
var validate = require('../../validate');

module.exports = function userLogin(socket, pg, redis, payload) {
  var email = payload.email;
  var password = payload.password;

  // Validate inputs
  if (
    !validate.email(email) ||
    !validate.password(password)
  ) {
    return socket.error('InvalidInput');
  }

  // Select the password hash from email.
  pg.query(`SELECT id AS "id", password AS "password"
            FROM users
            WHERE email = $1::text;`,
  [email], function(err, rows) {
    if (err || rows.length > 1) return socket.error('ServiceInternal', err);
    if (!rows.length) return socket.error('UserNonexistent');

    // Compare the input with the hash
    bcrypt.compare(password, rows[0].password, function(err, equal) {
      if (err) return socket.error('ServiceInternal', err);
      if (!equal) return socket.error('InvalidPassword');

      // Create session
      socket.session(rows[0].id);
    });
  });
};
