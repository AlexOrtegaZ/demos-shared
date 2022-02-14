const DbHelper = require('./db.helper');
const Proposal = require('../models/proposal.model');
const SqlQuery = require('../utils/sqlQuery');
const { excuteQuery } = require('./db.utils');

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
    const query = SqlQuery.update
      .into(this.tableName)
      .set({
        status,
        updated_by: userId,
      })
      .where({ [this.colId]: proposalId })
      .build();
    await excuteQuery(query);
    return this.findById(proposalId);
  }
}

module.exports = new ProposalRepository();
