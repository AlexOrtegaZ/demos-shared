/*
  DEMOS
  Copyright (C) 2022 Julian Alejandro Ortega Zepeda, Erik Ivanov Domínguez Rivera, Luis Ángel Meza Acosta
  This file is part of DEMOS.

  DEMOS is free software: you can redistribute it and/or modify
  it under the terms of the GNU General Public License as published by
  the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.

  DEMOS is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU General Public License for more details.

  You should have received a copy of the GNU General Public License
  along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

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
