const DbHelper = require('./db.helper');
const UserSpace = require('../models/user-space.model');
const { invitationStatusEnum } = require('../enums');
const SqlQuery = require('../utils/sqlQuery');
const { excuteQuery } = require('./db.utils');

class UserSpaceRepository extends DbHelper {
  constructor() {
    super();
    this.entityName = UserSpace.name;
    this.tableName = 'user_space';
    this.colId = 'user_space_id';
  }

  findByUserIdAndSpaceId(userId, spaceId) {
    const invitationStatusToIgnore = [invitationStatusEnum.CANCELED, invitationStatusEnum.REJECTED];

    const query = SqlQuery.select.from(this.tableName)
    .where({ 
      user_id: userId, 
      space_id: spaceId,
      deleted: false,
      invitation_status: SqlQuery.sql.not_in(invitationStatusToIgnore)
    })
    .build();

    const result = await excuteQuery(query)
    return result[0];
  }

  findBySpaceId(spaceId) {
    const query = SqlQuery.select.from(this.tableName)
    .where({
      space_id: spaceId,
      deleted: false,
      invitation_status: invitationStatusEnum.ACCEPTED,
    })
    .build();

    const result = await excuteQuery(query)
    return result[0];
  }
}

module.exports = new UserSpaceRepository();
