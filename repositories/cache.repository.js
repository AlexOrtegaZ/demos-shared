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
        created_at: lastUpdatedDate ? SqlQuery.sql.gt(lastUpdatedDate) : undefined,
      })
      .order('created_at', 'A')
      .build();

    const result = await excuteQuery(query);
    return result;
  }

  createCache(entityName, eventName, userId, data) {
    const cache = new Cache();
    cache.entityName = entityName;
    cache.eventName = eventName;
    cache.userId = userId;
    cache.data = JSON.stringify(data);
    return this.create(cache);
  }
}

module.exports = new CacheRepository();
