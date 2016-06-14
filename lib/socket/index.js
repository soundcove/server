module.exports = function attach(socket) {
  socket.error = require('./error');
  socket.validate = require('./validate');
  socket.session = require('./session');
};
