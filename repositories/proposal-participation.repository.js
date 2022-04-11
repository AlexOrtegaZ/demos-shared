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
const ProposalParticipation = require('../models/proposal-participation.model');
const SqlQuery = require('../utils/sqlQuery');
const { excuteQuery } = require('./db.utils');

class ProposalParticipationRepository extends DbHelper {
  constructor() {
    super();
    this.entityName = ProposalParticipation.name;
    this.tableName = 'proposal_participation';
    this.colId = 'proposal_participation_id';
  }

  /**
   * Create proposal participation
   * @param {string} proposalId
   * @param {string} userId
   * @param {string} memberId
   * @param {string} spaceId
   * @returns {Promise<ProposalParticipation>}
   */
  async createProposalParticipation(proposalId, userId, memberId, spaceId) {
    const participation = new ProposalParticipation();
    participation.proposalId = proposalId;
    participation.userId = userId;
    participation.memberId = memberId;
    participation.spaceId = spaceId;

    return this.create(participation);
  }


  /**
   * Update proposal participation
   * @param {number} proposalParticipationId
   * @param {number} participated
   * @returns {Promise<Proposal>}
   */
   async updateProposalParticipation(proposalParticipationId, participated) {
    const query = SqlQuery.update
      .into(this.tableName)
      .set({
        participated,
      })
      .where({ [this.colId]: proposalParticipationId })
      .build();
    await excuteQuery(query);
    return this.findById(proposalParticipationId);
  }

  /**
   * Find Proposal Participation by proposalId and userId
   * @param {string} proposalId
   * @param {string} userId
   * @returns {Promise<ProposalParticipation>}
   */
  async findByProposalIdAndUserId(proposalId, userId) {
    const query = SqlQuery.select
      .from(this.tableName)
      .where({
        proposal_id: proposalId,
        user_id: userId,
      })
      .limit(1)
      .build();

    const result = await excuteQuery(query);
    return result[0];
  }

  /**
   * Find Proposal Participation by proposalId
   * @param {string} proposalId
   * @returns {Promise<ProposalParticipation[]>}
   */
  async findByProposalId(proposalId) {
    const query = SqlQuery.select
      .from(this.tableName)
      .where({
        proposal_id: proposalId,
      })
      .build();

    const result = await excuteQuery(query);
    return result;
  }
}

module.exports = new ProposalParticipationRepository();
