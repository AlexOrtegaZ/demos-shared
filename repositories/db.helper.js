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

const { getColumnsAndValues, excuteQuery, excuteQueryWithValuesDeprecated } = require('./db.utils');
const SqlQuery = require('../utils/sqlQuery');

class DbHelper {
  constructor() {
    this.entityName = '';
    this.tableName = '';
    this.colId = '';
    this.hasDeletedColumn = false;
  }

  async findById(id) {
    const whereQueryObject = { [this.colId]: id };
    if (this.hasDeletedColumn) {
      whereQueryObject.deleted = false;
    }
    const query = SqlQuery.select
      .from(this.tableName)
      .where(whereQueryObject)
      .limit(1)
      .build();

    const result = await excuteQuery(query);
    return result[0];
  }

  // TODO: Update this methods (for rule they can not spect a dynamic object, theyHave to by static)
  async create(object) {
    this._validateObject(object);
    const [columns, values] = getColumnsAndValues(object);
    if (columns.length > 0) {
      const query = `INSERT INTO ${this.tableName}(${columns.join(',')}) VALUES(${columns
        .map((c, index) => `$${index + 1}`)
        .join(',')}) RETURNING *`;
      const result = await excuteQueryWithValuesDeprecated(query, values);
      return result[0];
    }
    throw Error('No values to create');
  }

  // TODO: Update this methods (for rule they can not spect a dynamic object, theyHave to by static)
  async save(id, object) {
    if (typeof id === 'object' && id !== null) {
      throw Error(`Id and object required to save ${this.entityName}`);
    }
    this._validateObject(object);
    const [columns, values] = getColumnsAndValues(object);
    if (columns.length > 0) {
      const query = `UPDATE ${this.tableName} 
        SET ${columns.map((column, index) => `${column} = $${index + 1}`).join(', ')}
        WHERE ${this.colId} = '${id}' RETURNING *`;
      const result = await excuteQueryWithValuesDeprecated(query, values);
      return result[0];
    }
    throw Error('No values to save');
  }

  _validateObject(object) {
    if (!this._isAValidObject(object)) {
      throw Error(`Invalid object type, expecting a ${this.entityName}`);
    }
  }

  _isAValidObject(object) {
    return object && object.constructor && object.constructor.name === this.entityName;
  }
}

module.exports = DbHelper;
