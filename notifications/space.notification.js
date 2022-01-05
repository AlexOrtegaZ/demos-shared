const { SPACE } = require('../constants/entity-names');
const { UPDATED } = require('../constants/event-names');
const cacheService = require('../services/cache.service');
const CacheRepository = require('../repositories/cache.repository');
const MemberRepository = require('../repositories/member.repository');

const createSpaceCache = (eventName, userId, data) => {
  return CacheRepository.createCache(SPACE, eventName, userId, data);
};

const notifyEachActiveMemberOn = async (generateCache, spaceId) => {
  const members = await MemberRepository.findUsersSpaceIdAndInvitationStatusAcceptedOrReceived(spaceId);

  members.forEach(async (member) => {
    await generateCache(member);

    cacheService.emitUpdateCache(member.userId);
  });
};

const spaceUpdated = (spaceId) => {
  notifyEachActiveMemberOn(async (member) => {
    const data = { spaceId };
    await createSpaceCache(UPDATED, member.userId, data);
  }, spaceId);
};

module.exports = {
  spaceUpdated,
};
