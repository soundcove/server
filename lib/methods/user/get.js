var response = require('../../response');

module.exports = function userGet(socket, pg, redis, payload, session) {
  var username = payload.username;

  // Validate input for faster disconnect.
  if (
    typeof username !== 'string' ||
    username.length < 2 || // Username more than 2
    username.length > 20 // Username less than 20
  ) return socket.error('InvalidInput');

  // Get socket user
  socket.user(session, function(user) {
    if (user.name === username) {
      socket.send(response('user/info', user));
    }

    pg.query(`SELECT id AS "id", username AS "username" FROM users
              WHERE username=$1::text`,
    [username], function(err, rows) {
      if (err) return socket.error('ServiceInternal', err);
      if (rows.length > 1) return socket.error('InvalidInput');
      socket.send(response('user/info', rows[0]));
    });
  });
};
