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
const Proposal = require('../models/proposal.model');
const SqlQuery = require('../utils/sqlQuery');
const { excuteQuery } = require('./db.utils');
const { toIsoString } = require('../utils/date.utils');

class ProposalRepository extends DbHelper {
  constructor() {
    super();
    this.entityName = Proposal.name;
    this.tableName = 'proposal';
    this.colId = 'proposal_id';
  }

  /**
   * Find proposal by spaceId and proposalId
   * @param {number} spaceId
   * @param {number} proposalId
   * @returns {Promise<Proposal>}
   */
  async findBySpaceIdAndProposalId(spaceId, proposalId) {
    const query = SqlQuery.select
      .from(this.tableName)
      .where({
        [this.colId]: proposalId,
        space_id: spaceId,
      })
      .limit(1)
      .build();

    const result = await excuteQuery(query);
    return result[0];
  }
  /**
   * Create proposal
   * @param {number} manifestoId
   * @param {number} status
   * @param {number} spaceId
   * @param {number} userId
   * @returns {Promise<Proposal>}
   */
  async createProposal(manifestoId, status, spaceId, userId) {
    const newProposal = new Proposal();
    newProposal.manifestoId = manifestoId;
    newProposal.status = status;
    newProposal.spaceId = spaceId;
    newProposal.createdBy = userId;
    newProposal.updatedBy = userId;
    newProposal.expiredAt = this._getExpirationDateOnIsoString();

    return this.create(newProposal);
  }

  /**
   * Update proposal
   * @param {number} proposalId
   * @param {number} status
   * @param {number} userId
   * @returns {Promise<Proposal>}
   */
  async updateProposal(proposalId, status, userId) {
    const expiredAt = this._getExpirationDateOnIsoString();
    const query = SqlQuery.update
      .into(this.tableName)
      .set({
        status,
        updated_by: userId,
        expired_at: expiredAt,
      })
      .where({ [this.colId]: proposalId })
      .build();
    await excuteQuery(query);
    return this.findById(proposalId);
  }

  _getExpirationDateOnIsoString() {
    const dateMilliseconds = new Date().getTime();
    const millisecondsInAnHour = 1000 * 60 * 60;
    const expirationDateOnMilliseconds = dateMilliseconds + (millisecondsInAnHour * 3);
    
    return toIsoString(new Date(expirationDateOnMilliseconds));
  }
}

module.exports = new ProposalRepository();
