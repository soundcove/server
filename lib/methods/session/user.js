var response = require('../../response');

module.exports = function sessionUser(socket, pg, redis, payload, session) {
  socket.user(session, function(user) {
    socket.send(response('session/user', user));
  });
};
