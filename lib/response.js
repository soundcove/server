module.exports = function response(method, payload) {
  return JSON.stringify([method, payload || {}]);
};
