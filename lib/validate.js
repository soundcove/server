exports.password = function password(input) {
  return typeof input === 'string' &&
         input.length >= 8 &&
         input.length <= 60;
};

exports.username = function username(input) {
  return typeof input === 'string' &&
         input.length >= 3 &&
         input.length <= 30;
};

exports.email = function email(input) {
  var at = input.indexOf('@');
  var dot = input.lastIndexOf('.');

  return typeof input === 'string' &&
         input.length <= 254 &&
         at > 0 &&
         at + 1 < dot &&
         dot < input.length - 1;
};

exports.session = function session(input) {
  return input.length === 32;
};
