const DbHelper = require('./db.helper');
const RoleUserSpace = require('../models/role-user-space.model');

class RoleUserSpaceRepository extends DbHelper {
  constructor() {
    super();
    this.entityName = RoleUserSpace.name;
    this.tableName = 'role_user_space';
    this.colId = 'role_user_space_id';
  }

  findByUserIdAndSpaceId(userId, spaceId) {
    const roleUserSpace = new RoleUserSpace();

    roleUserSpace.userId = userId;
    roleUserSpace.spaceId = spaceId;

    return this.findOne(roleUserSpace);
  }

  findBySpaceId(spaceId) {
    const roleUserSpace = new RoleUserSpace();

    roleUserSpace.spaceId = spaceId;
    roleUserSpace.deleted = false;


    return this.findAll(roleUserSpace);
  }
}

module.exports = new RoleUserSpaceRepository();
