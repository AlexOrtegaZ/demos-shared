const passport = require('passport');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const UserRepository = require('../repositories/user.repository');

const verifyCallback = (req, resolve, reject) => async (err, tokenUser, info) => {
  if (err || info || !tokenUser) {
    return reject(new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate'));
  }
  const cognitoId = tokenUser.username;
  const user = await UserRepository.findOneByCognitoId(cognitoId);

  if (!user) {
    return reject(new ApiError(httpStatus.UNAUTHORIZED, 'User not found'));
  }

  req.user = user;

  resolve();
};

const auth = () => async (req, res, next) => {
  return new Promise((resolve, reject) => {
    passport.authenticate('jwt', { session: false }, verifyCallback(req, resolve, reject))(req, res, next);
  })
    .then(() => next())
    .catch((err) => next(err));
};

module.exports = auth;
