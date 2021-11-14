const httpStatus = require('http-status');
const SpaceRepository = require('../repositories/space.repository');
const MemberRepository = require('../repositories/member.repository');
const ApiError = require('../utils/ApiError');

const spaceMember = async (req, res, next) => {
  const { user } = req;
  const { spaceId } = req.params;

  const member = await MemberRepository.findByUserIdAndSpaceId(user.userId, spaceId);
  if (!member) {
    return next(new ApiError(httpStatus.BAD_REQUEST, 'This user is not member of this space'));
  }

  req.member = member;

  const space = await SpaceRepository.findById(spaceId);
  if (!space) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Space not found');
  }

  req.space = space;

  return next();
};

module.exports = spaceMember;
