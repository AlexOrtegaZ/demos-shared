const DbHelper = require('./db.helper');
const Proposal = require('../models/proposal.model');

class ProposalRepository extends DbHelper {
  constructor() {
    super();
    this.entityName = Proposal.name;
    this.tableName = 'proposal';
    this.colId = 'proposal_id';
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
}

module.exports = new ProposalRepository();
