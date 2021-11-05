const DbHelper = require('./db.helper');
const RoleUserSpace = require('../models/role-user-space.model');
const SqlQuery = require('../utils/sqlQuery');
const { excuteQuery } = require('./db.utils');

class RoleUserSpaceRepository extends DbHelper {
  constructor() {
    super();
    this.entityName = RoleUserSpace.name;
    this.tableName = 'role_user_space';
    this.colId = 'role_user_space_id';
  }

  async findByUserIdAndSpaceId(userId, spaceId) {
    const query = SqlQuery.select
      .from(this.tableName)
      .where({
        user_id: userId,
        space_id: spaceId,
        deleted: false,
      })
      .limit(1)
      .build();

    const result = await excuteQuery(query);
    return result[0];
  }

  async findBySpaceId(spaceId) {
    const query = SqlQuery.select
      .from(this.tableName)
      .where({
        space_id: spaceId,
        deleted: false,
      })
      .build();

    const result = await excuteQuery(query);
    return result;
  }

  async findAllBySpaceIds(spaceIds) {
    const query = SqlQuery.select
      .from(this.tableName)
      .where({
        space_id: spaceIds,
        deleted: false,
      })
      .build();

    const result = await excuteQuery(query);
    return result;
  }
}

module.exports = new RoleUserSpaceRepository();
