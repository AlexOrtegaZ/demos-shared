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
const ProposalVote = require('../models/proposal-vote.model');
const SqlQuery = require('../utils/sqlQuery');
const { excuteQuery } = require('./db.utils');

class ProposalVoteRepository extends DbHelper {
  constructor() {
    super();
    this.entityName = ProposalVote.name;
    this.tableName = 'proposal_vote';
    this.colId = 'proposal_vote_id';
  }

  /**
   * Create proposal vote
   * @param {string} proposalId
   * @param {string} userHash
   * @param {string} manifestoOptionId
   * @param {boolean} inFavor
   * @param {string} nullVoteComment
   * @returns {Promise<ProposalVote>}
   */
  async createProposalVote(proposalId, userHash, manifestoOptionId, inFavor, nullVoteComment) {
    const vote = new ProposalVote();
    vote.proposalId = proposalId;
    vote.userHash = userHash;
    vote.manifestoOptionId = manifestoOptionId;
    vote.inFavor = inFavor;
    vote.nullVoteComment = nullVoteComment;

    return this.create(vote);
  }

  /**
   * Find Proposal Vote by user hash
   * @param {string} userHash
   * @returns {Promise<ProposalVote>}
   */
  async findByUserHash(userHash) {
    const query = SqlQuery.select
      .from(this.tableName)
      .where({
        user_hash: userHash,
      })
      .limit(1)
      .build();

    const result = await excuteQuery(query);
    return result[0];
  }


  /**
   * Update proposal vote
   * @param {number} proposalVoteId
   * @param {string} manifestoOptionId
   * @param {boolean} inFavor
   * @param {string} nullVoteComment
   * @returns {Promise<void>}
   */
   async updateProposalVote(proposalVoteId, manifestoOptionId, inFavor, nullVoteComment) {
    const query = SqlQuery.update
      .into(this.tableName)
      .set({
        manifesto_option_id: manifestoOptionId,
        in_favor: inFavor,
        null_vote_comment: nullVoteComment,
      })
      .where({ [this.colId]: proposalVoteId })
      .build();
    await excuteQuery(query);
  }
}

module.exports = new ProposalVoteRepository();
