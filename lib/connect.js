var methods = require('./methods');
var response = require('./response');
var error = response.error;

module.exports = function connect(socket) {
  var close = function close() {
    socket.close();
  };

  socket.on('message', function message(data) {
    try {
      data = JSON.parse(data);
    } catch (e) {
      return socket.send(error.InvalidJSON, close);
    }

    var method = data.method;
    var payload = data.payload;
    if (!method || !payload || methods.all.indexOf(method) === -1) {
      return socket.send(error.InvalidMessage);
    }

    var session = data.session || null;
    methods[method](payload, socket, session);
  });
};
