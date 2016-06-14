module.exports = function attach(socket) {
  socket.error = require('./error').bind(socket);
  socket.user = require('./user').bind(socket);
  socket.session = require('./session').bind(socket);
};
