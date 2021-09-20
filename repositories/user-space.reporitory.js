const DbHelper = require('./db.helper');
const UserSpace = require('../models/user-space.model');
const { invitationStatusEnum } = require('../enums');

class UserSpaceRepository extends DbHelper {
  constructor() {
    super();
    this.entityName = UserSpace.name;
    this.tableName = 'user_space';
    this.colId = 'user_space_id';
  }

  findByUserIdAndSpaceId(userId, spaceId) {
    const userSpace = new UserSpace();

    userSpace.userId = userId;
    userSpace.spaceId = spaceId;
    userSpace.deleted = false;
    userSpace.invitationStatus = invitationStatusEnum.CANCELED;
    const notColumns = ['invitation_status'];
    return this.findOne(userSpace, notColumns);
  }
}

module.exports = new UserSpaceRepository();
