const { PROPOSALS } = require('../constants/entity-names');
const cacheService = require('../services/cache.service');
const CacheRepository = require('../repositories/cache.repository');
const MemberRepository = require('../repositories/member.repository');
const { PUBLISHED } = require('../constants/event-names');

const createProposalsCache = (eventName, userId, data) => {
  return CacheRepository.createCache(PROPOSALS, eventName, userId, data);
};

const notifyEachActiveMemberOn = async (generateCache, spaceId) => {
  const members = await MemberRepository.findUsersSpaceIdAndInvitationStatusAcceptedOrReceived(spaceId);

  members.forEach(async (member) => {
    await generateCache(member);

    cacheService.emitUpdateCache(member.userId);
  });
};

/**
 * Notify all members for a new proposal published
 * @param {number} spaceId
 * @param {number} proposalId
 * @returns {void}>}
 */
const proposalUpdated = (spaceId, proposalId) => {
  notifyEachActiveMemberOn(async (member) => {
    const data = { proposalId, spaceId };
    await createProposalsCache(PUBLISHED, member.userId, data);
  }, spaceId);
};

module.exports = {
  proposalUpdated,
};
