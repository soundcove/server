var response = require('../../response');

module.exports = function sessionUser(socket, pg, redis, payload) {
  // Fetch session user and send.
  socket.user(payload.session, function(user) {
    socket.send(response('reply', user));
  });
};
