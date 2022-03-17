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

const { SPACE } = require('../constants/entity-names');
const { UPDATED } = require('../constants/event-names');
const cacheService = require('../services/cache.service');
const CacheRepository = require('../repositories/cache.repository');
const MemberRepository = require('../repositories/member.repository');

const createSpaceCache = (eventName, userId, data) => {
  return CacheRepository.createCache(SPACE, eventName, userId, data);
};

const notifyEachActiveMemberOn = async (generateCache, spaceId, exceptForUserId) => {
  const members = await MemberRepository.findUsersSpaceIdAndInvitationStatusAcceptedOrReceived(spaceId);

  members.forEach(async (member) => {
    if (exceptForUserId != member.userId) {
      await generateCache(member);

      cacheService.emitUpdateCache(member.userId);
    }
  });
};

const spaceUpdated = (spaceId, exceptForUserId) => {
  notifyEachActiveMemberOn(async (member) => {
    const data = { spaceId };
    await createSpaceCache(UPDATED, member.userId, data);
  }, spaceId, exceptForUserId);
};

module.exports = {
  spaceUpdated,
};
