module.exports = require('rc')('api', {
  host: '0.0.0.0',
  port: 8880,

  redis: {
    host: '127.0.0.1',
    port: 8881
  },

  postgre: {
    host: '127.0.0.1',
    port: 8882
  }
});
