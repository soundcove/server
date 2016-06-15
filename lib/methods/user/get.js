var response = require('../../response');
var validate = require('../../validate');

module.exports = function userGet(socket, pg, redis, payload) {
  var username = payload.username;

  // Validate input for faster disconnect.
  if (!validate.username(username)) {
    return socket.error('InvalidInput');
  }

  // Select username from database.
  pg.query(`SELECT id AS "id", username AS "username"
            FROM users
            WHERE username = $1::text`,
  [username], function(err, rows) {
    if (err) return socket.error('ServiceInternal', err);
    if (rows.length > 1) return socket.error('InvalidInput');
    socket.send(response('reply', rows[0]));
  });
};
