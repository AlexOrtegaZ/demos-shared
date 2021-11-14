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

  createCache(entityName, eventName, userId, data) {
    const cache = new Cache();
    cache.entityName = entityName;
    cache.eventName = eventName;
    cache.userId = userId;
    cache.data = JSON.stringify(data);
    return CacheRepository.create(cache);
  }
}

module.exports = new CacheRepository();
