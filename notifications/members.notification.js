const { MEMBERS } = require('../constants/entity-names');
const { UPDATED, INVITATION } = require('../constants/event-names');
const MemberRepository = require('../repositories/member.repository');
const CacheRepository = require('../repositories/cache.repository');
const cacheService = require('../services/cache.service');

const createMemberCache = (eventName, userId, data) => {
  return CacheRepository.createCache(MEMBERS, eventName, userId, data);
};

const notifyEachActiveMemberOn = async (generateCache, spaceId) => {
  const members = await MemberRepository.findBySpaceIdAndInvitationStatusAccepted(spaceId);

  members.forEach(async (member) => {
    await generateCache(member);

    cacheService.emitUpdateCache(member.userId);
  });
};

const memberUpdated = (spaceId, memberId) => {
  notifyEachActiveMemberOn(async (member) => {
    const data = { memberId, spaceId };
    await createMemberCache(UPDATED, member.userId, data);
  }, spaceId);
};

const newInvitation = async (spaceId, userId) => {
  const data = { spaceId };
  await createMemberCache(INVITATION, userId, data);
  cacheService.emitUpdateCache(userId);
};

const invitationCanceled = async (spaceId, userId, memberId) => {
  const data = { memberId, spaceId };
  await createMemberCache('invitation:canceled', userId, data);
  cacheService.emitUpdateCache(userId);
};

const memberDeleted = async (spaceId, userId, memberId) => {
  const data = { memberId, spaceId };
  await createMemberCache('deleted', userId, data);
  cacheService.emitUpdateCache(userId);
};

module.exports = {
  notifyEachActiveMemberOn,
  memberUpdated,
  newInvitation,
  invitationCanceled,
  memberDeleted,
};
