/*
  DEMOS
  Copyright (C) 2022 Julian Alejandro Ortega Zepeda, Erik Ivanov Domínguez Rivera, Luis Ángel Meza Acosta
  This file is part of DEMOS.

  DEMOS is free software: you can redistribute it and/or modify
  it under the terms of the GNU General Public License as published by
  the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.

  DEMOS is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU General Public License for more details.

  You should have received a copy of the GNU General Public License
  along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

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
