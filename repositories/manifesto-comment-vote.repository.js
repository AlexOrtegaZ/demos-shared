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

const DbHelper = require('./db.helper');
const ManifestoCommentVote = require('../models/manifesto-comment-vote.model');
const SqlQuery = require('../utils/sqlQuery');
const { excuteQuery } = require('./db.utils');

class ManifestoCommentVoteRepository extends DbHelper {
  constructor() {
    super();
    this.entityName = ManifestoCommentVote.name;
    this.tableName = 'manifesto_comment_vote';
    this.colId = 'manifesto_comment_vote_id';
  }

  /**
   * @param {string} manifestoCommentId
   * @param {string} userId
   * @returns {Promise<ManifestoCommentVote>}
   */
  async findByManifestoCommentIdAndUserId(manifestoCommentId, userId) {
    const query = SqlQuery.select
      .from(this.tableName)
      .where({ manifesto_comment_id: manifestoCommentId, user_id: userId })
      .limit(1)
      .build();

    const result = await excuteQuery(query);
    return result[0];
  }

  /**
   * @param {string} manifestoCommentId
   * @param {boolean} upvote
   * @param {string} userId
   * @returns {Promise<ManifestoCommentVote>}
   */
  async createManifestoCommentVote(manifestoCommentId, upvote, userId) {
    const newCommentVote = new ManifestoCommentVote();
    newCommentVote.manifestoCommentId = manifestoCommentId;
    newCommentVote.upvote = upvote;
    newCommentVote.userId = userId;

    return this.create(newCommentVote);
  }

  /**
   * @param {string} manifestoCommentVoteId
   * @param {boolean} upvote
   * @returns {Promise<ManifestoCommentVote>}
   */
  async updateCommentVote(manifestoCommentVoteId, upvote) {
    const query = SqlQuery.update
      .into(this.tableName)
      .set({
        upvote,
      })
      .where({ [this.colId]: manifestoCommentVoteId })
      .build();

    await excuteQuery(query);
    return this.findById(manifestoCommentVoteId);
  }

  /**
   * @param {string} manifestoCommentVoteId
   * @returns {Promise<void>}
   */
  async deleteCommentVote(manifestoCommentVoteId) {
    const query = SqlQuery.remove
      .from(this.tableName)
      .where({ [this.colId]: manifestoCommentVoteId })
      .build();

    await excuteQuery(query);
  }
}

module.exports = new ManifestoCommentVoteRepository();
