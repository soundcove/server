var response = function response(method, payload) {
  return JSON.stringify({
    method: method,
    payload: payload
  });
};

module.exports = response;
