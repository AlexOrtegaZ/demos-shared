const { PROPOSALS } = require('../constants/entity-names');
const cacheService = require('../services/cache.service');
const CacheRepository = require('../repositories/cache.repository');
const MemberRepository = require('../repositories/member.repository');
const { PUBLISHED, UPDATED } = require('../constants/event-names');

const createProposalsCache = (eventName, userId, data) => {
  return CacheRepository.createCache(PROPOSALS, eventName, userId, data);
};

const notifyEachActiveMemberOn = async (generateCache, spaceId, exceptForUserId) => {
  const members = await MemberRepository.findBySpaceIdAndInvitationStatusAccepted(spaceId);

  members.forEach(async (member) => {
    if (exceptForUserId != member.userId) {
      await generateCache(member);

      cacheService.emitUpdateCache(member.userId);
    }
  });
};

/**
 * Notify all members for a new proposal published
 * @param {string} spaceId
 * @param {string} proposalId
 * @param {string} exceptForUserId
 * @returns {void}>}
 */
const proposalUpdated = (spaceId, proposalId, exceptForUserId) => {
  notifyEachActiveMemberOn(async (member) => {
    const data = { proposalId, spaceId };
    await createProposalsCache(PUBLISHED, member.userId, data);
  }, spaceId, exceptForUserId);
};

/**
 * Notify all members for a new proposal participation
 * @param {string} spaceId
 * @param {string} proposalId
 * @param {string} proposalParticipationId
 * @param {string} exceptForUserId
 * @returns {void}>}
 */
const proposalVoteUpdated = (spaceId, proposalId, proposalParticipationId, exceptForUserId) => {
  notifyEachActiveMemberOn(async (member) => {
    const data = { proposalParticipationId, proposalId, spaceId };
    await createProposalsCache('voted', member.userId, data);
  }, spaceId, exceptForUserId);
};

module.exports = {
  proposalUpdated,
  proposalVoteUpdated,
};
