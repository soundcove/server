var response = require('../response');

var error = function socketError(name, err, callback) {
  if (name === 'ServiceInternal') {
    console.log(err);
    this.send(error[name], callback);
  } else {
    this.send(error[name], err);
  }
};

error.InvalidJSON = response('error', {name: 'InvalidJSON'});
error.InvalidMessage = response('error', {name: 'InvalidMessage'});
error.ServiceUnavailable = response('error', {name: 'ServiceUnavailable'});
error.ServiceInternal = response('error', {name: 'ServiceInternal'});
error.InvalidInput = response('error', {name: 'InvalidInput'});
error.InvalidSession = response('error', {name: 'InvalidSession'});
error.UserExists = response('error', {name: 'UserExists'});
error.UserNonexistent = response('error', {name: 'UserNonexistent'});
error.InvalidPassword = response('error', {name: 'InvalidPassword'});

module.exports = error;
