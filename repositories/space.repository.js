const DbHelper = require('./db.helper');
const Space = require('../models/space.model');
const UserSpaceRepository = require('./user-space.reporitory');
const SqlQuery = require('../utils/sqlQuery');
const { excuteQuery, convertPropNameToColumnNotation } = require('./db.utils');

class SpaceRepository extends DbHelper {
  constructor() {
    super();
    this.entityName = Space.name;
    this.tableName = 'spaces';
    this.colId = 'space_id';
  }

  async findAllByUserId(userId) {
    const spaceColumnNames = Object.keys(new Space()).map(key => convertPropNameToColumnNotation(key));

    const query = SqlQuery.select.from(this.tableName)
    .select(spaceColumnNames)
    .from(UserSpaceRepository.tableName, this.colId, this.tableName, this.colId)
    .where({ user_id: userId })
    .order('t1.created_at', 'A')
    .build();
    return excuteQuery(query);
  }
}

module.exports = new SpaceRepository();
