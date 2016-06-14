var response = require('./response');
var random = require('crypto').randomBytes;

module.exports = function session(id, name, callback) {
  // Create and save session token
  random(8, function randomBytes(err, bytes) {
    if (err) return this.error('InternalService', err);

    // Create and set token.
    var token = bytes.toString('hex');
    this.redis.set(token, id, function(err) {
      if (err) return this.error('InternalService', err);

      // Respond
      this.send(response(name, {
        token: token
      }), function sent() {
        callback(token);
      });
    });
  });
};
