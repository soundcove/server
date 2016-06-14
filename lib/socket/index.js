module.exports = function attach(socket) {
  socket.error = require('./error').bind(socket);
  socket.validate = require('./validate').bind(socket);
  socket.session = require('./session').bind(socket);
};
