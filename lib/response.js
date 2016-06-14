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
  ServiceInternal: response('error', {type: 'ServiceInternal'}),
  InvalidInput: response('error', {type: 'InvalidInput'}),
  InvalidSession: response('error', {type: 'InvalidSession'}),
  UserExists: response('error', {type: 'UserExists'}),
  UserNonexistent: response('error', {type: 'UserNonexistent'})
};

module.exports = response;
