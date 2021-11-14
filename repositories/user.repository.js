const DbHelper = require('./db.helper');
const User = require('../models/user.model');
const SqlQuery = require('../utils/sqlQuery');
const { excuteQuery } = require('./db.utils');

class UserRepository extends DbHelper {
  constructor() {
    super();
    this.entityName = User.name;
    this.tableName = 'users';
    this.colId = 'user_id';
  }

  async findOneByPhoneNumber(phoneNumber) {
    const query = SqlQuery.select
      .from(this.tableName)
      .where({ phone_number: SqlQuery.sql.like(`%${this._getPhoneWithoutExtension(phoneNumber)}`) })
      .limit(1)
      .build();

    const result = await excuteQuery(query);
    return result[0];
  }

  async findOneByCognitoId(cognitoId) {
    const query = SqlQuery.select.from(this.tableName).where({ cognito_id: cognitoId }).limit(1).build();
    const result = await excuteQuery(query);
    return result[0];
  }

  async findAllByIds(userIds) {
    const query = SqlQuery.select.from(this.tableName).where({ user_id: userIds }).build();

    const result = await excuteQuery(query);
    return result;
  }

  _getPhoneWithoutExtension(phoneNumber) {
    return phoneNumber.substr(phoneNumber.length - 10);
  }

  async updateName(userId, name) {
    const query = SqlQuery.update.into(this.tableName).set({ name }).where({ user_id: userId }).build();
    return excuteQuery(query);
  }

  async updatePictureKey(userId, pictureKey) {
    const query = SqlQuery.update
      .into(this.tableName)
      .set({ profile_picture_key: pictureKey })
      .where({ user_id: userId })
      .build();
    return excuteQuery(query);
  }
}

module.exports = new UserRepository();
