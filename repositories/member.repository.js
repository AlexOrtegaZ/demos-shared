const DbHelper = require('./db.helper');
const Member = require('../models/member.model');
const { invitationStatusEnum } = require('../enums');
const SqlQuery = require('../utils/sqlQuery');
const { excuteQuery } = require('./db.utils');

class MemberRepository extends DbHelper {
  constructor() {
    super();
    this.entityName = Member.name;
    this.tableName = 'members';
    this.colId = 'member_id';
  }

  async findByUserIdAndSpaceId(userId, spaceId) {
    const invitationStatusToIgnore = [invitationStatusEnum.CANCELED, invitationStatusEnum.REJECTED];

    const query = SqlQuery.select
      .from(this.tableName)
      .where({
        user_id: userId,
        space_id: spaceId,
        deleted: false,
        invitation_status: SqlQuery.sql.not_in(invitationStatusToIgnore),
      })
      .build();

    const result = await excuteQuery(query);
    return result[0];
  }

  async findUsersSpaceIdAndInvitationStatusAcceptedOrReceived(spaceId) {
    const query = SqlQuery.select
      .from(this.tableName)
      .where({
        space_id: spaceId,
        deleted: false,
        invitation_status: [invitationStatusEnum.ACCEPTED, invitationStatusEnum.RECEIVED],
      })
      .build();

    const result = await excuteQuery(query);
    return result;
  }

  async findBySpaceIdAndInvitationStatusAccepted(spaceId) {
    const query = SqlQuery.select
      .from(this.tableName)
      .where({
        space_id: spaceId,
        deleted: false,
        invitation_status: invitationStatusEnum.ACCEPTED,
      })
      .build();

    const result = await excuteQuery(query);
    return result;
  }

  async findAllBySpaceIds(spaceIds) {
    const invitationStatusToIgnore = [invitationStatusEnum.CANCELED, invitationStatusEnum.REJECTED];

    const query = SqlQuery.select
      .from(this.tableName)
      .where({
        space_id: spaceIds,
        deleted: false,
        invitation_status: SqlQuery.sql.not_in(invitationStatusToIgnore),
      })
      .build();

    const result = await excuteQuery(query);
    return result;
  }

  createMember(spaceId, userId, invitationStatus, role, createdBy) {
    const member = new Member();
    member.spaceId = spaceId;
    member.userId = userId;
    member.invitationStatus = invitationStatus;
    member.role = role;
    member.createdBy = createdBy;
    member.updatedBy = createdBy;
    return this.create(member);
  };
}

module.exports = new MemberRepository();