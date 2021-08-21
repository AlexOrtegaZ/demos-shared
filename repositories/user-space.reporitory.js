const DbHelper = require('./db.helper');
const UserSpace = require('../models/user-space.model');

class UserSpaceRepository extends DbHelper {
  constructor() {
    super();
    this.entityName = UserSpace.name;
    this.tableName = 'user_space';
    this.colId = 'user_space_id';
  }
}

module.exports = new UserSpaceRepository();
