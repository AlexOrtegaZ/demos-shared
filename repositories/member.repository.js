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
    this.hasDeletedColumn = true;
  }

  async findAnyMemberById(memberId) {
      const query = SqlQuery.select
        .from(this.tableName)
        .where({ [this.colId]: memberId })
        .limit(1)
        .build();
  
      const result = await excuteQuery(query);
      return result[0];
  }

  async findByUserIdAndSpaceId(userId, spaceId) {
    const invitationStatusToIgnore = [invitationStatusEnum.CANCELED, invitationStatusEnum.REJECTED, invitationStatusEnum.EXPIRED];

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
      .order('created_at', 'A')
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
    if (invitationStatus === invitationStatusEnum.SENDED) {
      const today = new Date();
      const expiredDate = new Date();
      expiredDate.setDate(today.getDate() + 7);
      member.expiredAt = expiredDate.toISOString();
    }
    return this.create(member);
  }

  async update(memberId, name, role, updatedBy) {
    const query = SqlQuery.update
      .into(this.tableName)
      .set({ name, role, updated_by: updatedBy })
      .where({ member_id: memberId })
      .build();
    return excuteQuery(query);
  }

  async updateInvitationStatus(memberId, invitationStatus, updatedBy) {
    const query = SqlQuery.update
      .into(this.tableName)
      .set({ invitation_status: invitationStatus, updated_by: updatedBy })
      .where({ member_id: memberId })
      .build();
    return excuteQuery(query);
  }

  async delete(memberId, updatedBy) {
    const query = SqlQuery.update
      .into(this.tableName)
      .set({ deleted: true, updated_by: updatedBy })
      .where({ member_id: memberId })
      .build();
    return excuteQuery(query);
  }
}

module.exports = new MemberRepository();
