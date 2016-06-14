var response = require('../../response');

var success = response('user/logout', {success: true});

module.exports = function userLogout(socket, pg, redis, payload, session) {
  // Validate session token.
  socket.user(session, function() {
    // Delete session.
    redis.del(session, function(err) {
      if (err) return socket.error('ServiceInternal');
      socket.send(success);
    });
  }, true);
};
