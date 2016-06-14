module.exports = function validate(token, callback) {
  if (token) {
    this.redis.get(token, function(err, id) {
      if (err) return this.error('InvalidSession');
      callback(id);
    });
  }
  this.error('InvalidSession');
};
