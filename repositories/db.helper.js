const {
  getColumnsAndValues,
  excuteQuery,
  excuteQueryWithValuesDeprecated,
} = require('./db.utils');
const SqlQuery = require('../utils/sqlQuery');

class DbHelper {
  constructor() {
    this.entityName = '';
    this.tableName = '';
    this.colId = '';
  }

  async findById(id) {
    const query = SqlQuery.select.from(this.tableName)
    .where({ [this.colId]: id })
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
        SET ${columns.map((column, index) => `${column} = $${index + 1}`).join(' ')}
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
