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
