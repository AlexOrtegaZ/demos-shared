const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const spaceMember = require('./space-member.middleware');

const spaceRoles = (roles) => async (req, res, next) => {
  const { member } = req;

  if (roles.every((r) => member.role !== r)) {
    return next(
      new ApiError(
        httpStatus.BAD_REQUEST,
        'This user do not have the correct role on this space to do the current operation.'
      )
    );
  }

  return next();
};

const combineSpaceRolesValidation = (...roles) => {
  return [spaceMember, spaceRoles(roles)];
};

module.exports = combineSpaceRolesValidation;
