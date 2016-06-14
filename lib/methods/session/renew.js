var response = require('../../response');

var success = response('session/renew', {success: true});

module.exports = function sessionRenew(socket, pg, redis, payload, session) {
  socket.user(session, function() {
    pg.query(`UPDATE sessions
              SET expire = now() + interval '4 days'
              WHERE token = $1::text`,
    [session], function(err) {
      if (err) return socket.error('ServiceInternal');
      socket.send(success);
    });
  }, true);
};
