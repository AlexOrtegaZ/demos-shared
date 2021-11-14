const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const spaceMember = require('./space-member.middleware');

const spaceRole = (role) => async (req, res, next) => {
  const { member } = req;

  if (member.role !== role) {
    return next(new ApiError(httpStatus.BAD_REQUEST, 'This user is not admin on this space'));
  }

  return next();
};

const combineSpaceRoleValidation = (role) => {
  return [spaceMember, spaceRole(role)];
};

module.exports = combineSpaceRoleValidation;
