var response = function response(method, payload) {
  return JSON.stringify({
    method: method,
    payload: payload
  });
};

response.error = {
  InvalidJSON: response('error', {type: 'InvalidJSON'}),
  InvalidMessage: response('error', {type: 'InvalidMessage'}),
  ServiceUnavailable: response('error', {type: 'ServiceUnavailable'}),
  ServiceInternalError: response('error', {type: 'ServiceInternalError'}),
  InvalidRegistration: response('error', {type: 'InvalidRegistration'})
};

module.exports = response;
