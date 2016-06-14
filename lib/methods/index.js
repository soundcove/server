exports['user/register'] = require('./user/register');
exports['user/login'] = require('./user/login');
exports['user/get'] = require('./user/info');

// For checking if a method exists.
exports.all = Object.keys(exports);
