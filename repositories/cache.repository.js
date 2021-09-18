const DbHelper = require('./db.helper');
const Cache = require('../models/cache.model');

class CacheRepository extends DbHelper {
  constructor() {
    super();
    this.entityName = Cache.name;
    this.tableName = 'cache';
    this.colId = 'cache_id';
  }

  findAllByUserId(userId) {
    const cache = new Cache();
    cache.userId = userId;

    return this.findAll(cache);
  }
}

module.exports = new CacheRepository();
