const DbHelper = require('./db.helper');
const User = require('../models/user.model');

class UserRepository extends DbHelper {
  constructor() {
    super();
    this.entityName = User.name;
    this.tableName = 'users';
    this.colId = 'user_id';
  }

  findOneByPhoneNumber(phoneNumber) {
    const user = new User();
    user.phoneNumber = phoneNumber;

    return this.findOne(user);
  }

  findOneByCognitoId(cognitoId) {
    const user = new User();
    user.cognitoId = cognitoId;

    return this.findOne(user);
  }
}

module.exports = new UserRepository();
