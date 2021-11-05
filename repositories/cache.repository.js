const DbHelper = require('./db.helper');
const Cache = require('../models/cache.model');
const SqlQuery = require('../utils/sqlQuery');
const { excuteQuery } = require('./db.utils');

class CacheRepository extends DbHelper {
  constructor() {
    super();
    this.entityName = Cache.name;
    this.tableName = 'cache';
    this.colId = 'cache_id';
  }

  async findAllByUserIdAfterDate(userId, lastUpdatedDate) {
    const query = SqlQuery.select
      .from(this.tableName)
      .where({
        user_id: userId,
        created_at: SqlQuery.sql.gt(lastUpdatedDate),
      })
      .order('created_at', 'A')
      .build();

    const result = await excuteQuery(query);
    return result;
  }
}

module.exports = new CacheRepository();
