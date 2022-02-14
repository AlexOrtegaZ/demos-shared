const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const proposalMiddleware = require('./proposal.middleware');

const proposalStatus = (status) => async (req, res, next) => {
  const { proposal } = req;

  if (status.every((s) => proposal.status !== s)) {
    return next(new ApiError(httpStatus.BAD_REQUEST, 'The proposal is not in the correct status.'));
  }

  return next();
};

const combineProposalsValidation = (...status) => {
  return [proposalMiddleware, proposalStatus(status)];
};

module.exports = combineProposalsValidation;
