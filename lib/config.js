module.exports = require('rc')('api', {
  host: '0.0.0.0',
  port: 8880,
  redis: 'localhost:6379',
  postgres: 'localhost'
});
