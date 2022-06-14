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

const { COMMENT_VOTES } = require('../constants/entity-names');
const { PUBLISHED, UPDATED, DELETED } = require('../constants/event-names');
const CacheRepository = require('../repositories/cache.repository');
const notifyEachActiveMemberOn = require('./utils/utils');

const createCommentVoteCache = (eventName, userId, data) => {
  return CacheRepository.createCache(COMMENT_VOTES, eventName, userId, data);
};

const newCommentVote = async (spaceId, manifestoCommentVoteId, userId) => {
  notifyEachActiveMemberOn(async (member) => {
    const data = { spaceId, manifestoCommentVoteId };
    await createCommentVoteCache(PUBLISHED, member.userId, data);
  }, spaceId, userId);
};

const updateCommentVote = async (spaceId, manifestoCommentVoteId, userId) => {
  notifyEachActiveMemberOn(async (member) => {
    const data = { spaceId, manifestoCommentVoteId };
    await createCommentVoteCache(UPDATED, member.userId, data);
  }, spaceId, userId);
};

const deleteCommentVote = async (spaceId, manifestoCommentVoteId, userId) => {
  notifyEachActiveMemberOn(async (member) => {
    const data = { spaceId, manifestoCommentVoteId };
    await createCommentVoteCache(DELETED, member.userId, data);
  }, spaceId, userId);
};

module.exports = {
  newCommentVote,
  updateCommentVote,
  deleteCommentVote
};