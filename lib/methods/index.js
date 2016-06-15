// All of the methods.
exports.all = [
  'user/register',
  'user/login',
  'user/get',
  'session/destroy',
  'session/user',
  'session/renew'
];

// Map each method to a handler.
exports.all.forEach(function(method) {
  exports[method] = require('./' + method);
});
