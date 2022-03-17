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
