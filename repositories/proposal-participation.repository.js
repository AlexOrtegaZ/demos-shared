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
   * @returns {Promise<ProposalParticipation>}
   */
  async createProposalParticipation(proposalId, userId, memberId) {
    const participation = new ProposalParticipation();
    participation.proposalId = proposalId;
    participation.userId = userId;
    participation.memberId = memberId;

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
