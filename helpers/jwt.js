const expressJwt = require('express-jwt');
const config = require('../config.json');
const User = require('../models/user.model');

module.exports = jwt;

function jwt() {
  const secret = config.secret;
  return expressJwt({
    secret,
    algorithms: ['HS256'],
    isRevoked
  }).unless({
    path: [
      // public routes that don't require authentication
      '/api/users/login',
      '/api/users/register'
    ]
  });
}

isRevoked = (req, done) => {
  var token = req.headers['x-access-token'];
  if(!token) {
    return done(null, true);
  } else {
    User.findOne({ token }).then(user => {
      if (!user) {
        return done(null, true);
      }
      done();
    });
  }
};
