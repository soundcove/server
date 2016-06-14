['users/register',
 'users/login',
 'users/get',
 'session/destroy',
 'session/user'
].forEach(function(method) {
  exports[method] = require('./' + method);
});

// For checking if a method exists.
exports.all = Object.keys(exports);
