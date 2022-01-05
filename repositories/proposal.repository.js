const DbHelper = require('./db.helper');
const Proposal = require('../models/proposal.model');

class ProposalRepository extends DbHelper {
  constructor() {
    super();
    this.entityName = Proposal.name;
    this.tableName = 'proposal';
    this.colId = 'proposal_id';
  }
}

module.exports = new ProposalRepository();
