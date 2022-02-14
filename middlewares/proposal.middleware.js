const httpStatus = require('http-status');
const ProposalRepository = require('../repositories/proposal.repository');
const ApiError = require('../utils/ApiError');

const proposal = async (req, res, next) => {
  const { proposalId, spaceId } = req.params;

  const proposal = await ProposalRepository.findBySpaceIdAndProposalId(spaceId, proposalId);

  if (!proposal) {
    return next(new ApiError(httpStatus.BAD_REQUEST, 'The proposal did not exist.'));
  }

  req.proposal = proposal;

  return next();
};

module.exports = proposal;
