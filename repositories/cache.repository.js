const DbHelper = require('./db.helper');
const Cache = require('../models/cache.model');

class CacheRepository extends DbHelper {
  constructor() {
    super();
    this.entityName = Cache.name;
    this.tableName = 'cache';
    this.colId = 'cache_id';
  }

  findAllByUserIdAfterDate(userId, lastUpdatedDate) {
    const cache = new Cache();
    cache.userId = userId;
    const dateQuery = lastUpdatedDate ? `AND created_at > '${lastUpdatedDate}'` : ''
    const additionalWhereQuery = `${dateQuery} ORDER BY created_at ASC`;

    return this.findAll(cache, additionalWhereQuery);
  }
}

module.exports = new CacheRepository();
