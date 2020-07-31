const jwtHelper = require('../helpers/jwt.helper');
const config = require('../config.json');
const User = require('../models/user.model');
const debug = console.log.bind(console);
const accessTokenSecret = config.secret;

/**
 * Middleware: Authorization user by Token
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
const isAuth = async (req, res, next) => {
  const clientToken = req.headers['x-access-token'];
  if (clientToken) {
    try {
      const decoded = await jwtHelper.verifyToken(clientToken, accessTokenSecret);
      const user = await User.findOne({ accessToken: clientToken });
      if (user) {
        req.jwtDecoded = decoded;
        next();
      } else {
        res.status(400).json({
          code: 400,
          message: 'Token is invalid!'
        });
      }
    } catch (error) {
      res.status(403).json({
        code: 403,
        message: 'Token is expired!'
      });
    }
  } else {
    res.status(401).json({
      code: 401,
      message: 'Unauthorized!'
    });
  }
}

module.exports = {
  isAuth: isAuth,
};
