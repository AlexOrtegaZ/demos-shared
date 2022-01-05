const DbHelper = require('./db.helper');
const ProposalParticipation = require('../models/proposal-participation.model');

class ProposalParticipationRepository extends DbHelper {
  constructor() {
    super();
    this.entityName = ProposalParticipation.name;
    this.tableName = 'proposal_participation';
    this.colId = 'proposal_participation_id';
  }
}

module.exports = new ProposalParticipationRepository();
