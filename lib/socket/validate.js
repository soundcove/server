module.exports = function validate(token, callback) {
  var socket = this;
  if (token) {
    socket.redis.get(token, function(err, id) {
      if (err) return socket.error('InvalidSession');
      callback(id);
    });
  }
  socket.error('InvalidSession');
};
