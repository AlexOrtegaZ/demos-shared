const DbHelper = require('./db.helper');
const User = require('../models/user.model');

class UserRepository extends DbHelper {
  constructor() {
    super();
    this.entityName = User.name;
    this.tableName = 'users';
    this.colId = 'user_id';
  }

  async findOneByPhoneNumber(phoneNumber) {
    const client = this.getPgClient();
    await client.connect();
    const query = `SELECT * FROM ${this.tableName} WHERE phone_number LIKE $1 LIMIT 1`;
    const res = await client.query(query, [`%${phoneNumber}`]);
    await client.end();
    const rowObject = res.rows[0];
    return rowObject ? this.mapObjectToCamelCased(rowObject) : null;
  }

  findOneByCognitoId(cognitoId) {
    const user = new User();
    user.cognitoId = cognitoId;

    return this.findOne(user);
  }
}

module.exports = new UserRepository();
