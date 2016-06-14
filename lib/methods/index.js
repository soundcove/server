exports['user/register'] = require('./user/register');
exports['user/login'] = require('./user/login');
exports['user/logout'] = require('./user/logout');
exports['user/get'] = require('./user/get');

// For checking if a method exists.
exports.all = Object.keys(exports);
