const { Client } = require('pg');

function convertPropNameToColumnNotation(fieldName) {
  return fieldName
    .replace(/\.?([A-Z])/g, function (x, y) {
      return `_${y.toLowerCase()}`;
    })
    .replace(/^_/, '');
}

function isPropertyEmpty(value) {
  return value === '' || value === null || value === undefined;
}

function getColumnsAndValues(object) {
  const columns = [];
  const values = [];
  Object.keys(object).forEach((key) => {
    if (!isPropertyEmpty(object[key])) {
      const columnName = convertPropNameToColumnNotation(key);
      const value = object[key];
      columns.push(columnName);
      values.push(value);
    }
  });

  return [columns, values];
}

function convertPropNameToCamelCase(name) {
  return name.replace(/_([a-z])/g, function (g) {
    return g[1].toUpperCase();
  });
}

class DbHelper {
  constructor() {
    this.entityName = '';
    this.tableName = '';
    this.colId = '';
  }

  async findOne(object, notColumns = []) {
    this._validateObject(object);
    const [columns, values] = getColumnsAndValues(object);
    if (columns.length > 0) {
      const client = this.getPgClient();
      await client.connect();
      const whereQuery = columns
        .map((column, index) => `${column} ${notColumns.some((x) => x === column) ? '!' : ''}= $${index + 1}`)
        .join(' AND ');
      const query = `SELECT * FROM ${this.tableName} WHERE ${whereQuery} LIMIT 1`;
      const res = await client.query(query, values);
      await client.end();
      const rowObject = res.rows[0];
      return rowObject ? this.mapObjectToCamelCased(rowObject) : null;
    }
    throw Error('No values to save');
  }

  async findAll(object, additionalWhereQuery = '') {
    this._validateObject(object);
    const [columns, values] = getColumnsAndValues(object);
    if (columns.length > 0) {
      const client = this.getPgClient();
      await client.connect();
      const query = `SELECT * FROM ${this.tableName} WHERE ${columns
        .map((column, index) => `${column} = $${index + 1}`)
        .join(' AND ')} ${additionalWhereQuery}`;
      const res = await client.query(query, values);
      await client.end();
      return res.rows.map((rowObject) => this.mapObjectToCamelCased(rowObject));
    }
    throw Error('No values to save');
  }

  async create(object) {
    this._validateObject(object);
    const [columns, values] = getColumnsAndValues(object);
    if (columns.length > 0) {
      const client = this.getPgClient();
      await client.connect();
      const query = `INSERT INTO ${this.tableName}(${columns.join(',')}) VALUES(${columns
        .map((c, index) => `$${index + 1}`)
        .join(',')}) RETURNING *`;
      const res = await client.query(query, values);
      await client.end();
      return this.mapObjectToCamelCased(res.rows[0]);
    }
    throw Error('No values to create');
  }

  async save(id, object) {
    if (typeof id === 'object' && id !== null) {
      throw Error(`Id and object required to save ${this.entityName}`);
    }
    this._validateObject(object);
    const [columns, values] = getColumnsAndValues(object);
    if (columns.length > 0) {
      const client = this.getPgClient();
      await client.connect();
      const query = `UPDATE ${this.tableName} 
        SET ${columns.map((column, index) => `${column} = $${index + 1}`).join(' ')}
        WHERE ${this.colId} = '${id}' RETURNING *`;
      const res = await client.query(query, values);
      await client.end();
      return this.mapObjectToCamelCased(res.rows[0]);
    }
    throw Error('No values to save');
  }

  // eslint-disable-next-line class-methods-use-this
  getPgClient() {
    return new Client({ ssl: { rejectUnauthorized: false } });
  }

  // eslint-disable-next-line class-methods-use-this
  mapObjectToCamelCased(object) {
    const newObject = {};
    Object.keys(object).forEach((key) => {
      const property = convertPropNameToCamelCase(key);
      const value = object[key];
      newObject[property] = value;
    });

    return newObject;
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
