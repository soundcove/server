var response = function response(method, payload) {
  return JSON.stringify({
    method: method,
    payload: payload
  });
};

response.error = {
  InvalidJSON: response('error', {
    type: 'InvalidJSON'
  }),

  InvalidMessage: response('error', {
    type: 'InvalidMessage'
  })
};

module.exports = response;
