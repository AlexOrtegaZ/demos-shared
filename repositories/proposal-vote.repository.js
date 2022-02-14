const DbHelper = require('./db.helper');
const ProposalVote = require('../models/proposal-vote.model');

class ProposalVoteRepository extends DbHelper {
  constructor() {
    super();
    this.entityName = ProposalVote.name;
    this.tableName = 'proposal_vote';
    this.colId = 'proposal_vote_id';
  }
}

module.exports = new ProposalVoteRepository();
