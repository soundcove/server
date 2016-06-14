var error = require('./response').error;

module.exports = function validate(token, socket, redis, callback) {
  redis.get(token, function(err, id) {
    if (err) {
      return socket.send(error.InvalidSession, socket.kill);
    }
    callback(id);
  });

  return true;
};
