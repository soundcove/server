var response = function response(method, payload) {
  return JSON.stringify({
    method: method,
    payload: payload
  });
};

response.error = {
  InvalidJSON: response('error', {name: 'InvalidJSON'}),
  InvalidMessage: response('error', {name: 'InvalidMessage'}),
  ServiceUnavailable: response('error', {name: 'ServiceUnavailable'}),
  ServiceInternal: response('error', {name: 'ServiceInternal'}),
  InvalidInput: response('error', {name: 'InvalidInput'}),
  InvalidSession: response('error', {name: 'InvalidSession'}),
  UserExists: response('error', {name: 'UserExists'}),
  UserNonexistent: response('error', {name: 'UserNonexistent'}),
  InvalidPassword: response('error', {name: 'InvalidPassword'})
};

module.exports = response;
