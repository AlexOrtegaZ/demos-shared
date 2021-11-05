const { Client } = require('pg');

function createPgClient() {
  return new Client({ ssl: { rejectUnauthorized: false } });
}

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

function mapObjectToCamelCased(object) {
  const newObject = {};
  Object.keys(object).forEach((key) => {
    const property = convertPropNameToCamelCase(key);
    const value = object[key];
    newObject[property] = value;
  });

  return newObject;
}

async function excuteQueryWithValuesDeprecated(query, values) {
  const client = createPgClient();
  await client.connect();
  const res = await client.query(query, values);
  await client.end();
  return res.rows.map((rowObject) => mapObjectToCamelCased(rowObject));
}

async function excuteQuery(query) {
  const client = createPgClient();
  await client.connect();
  const res = await client.query(query.replaceAll('`', ''));
  await client.end();
  return res.rows.map((rowObject) => mapObjectToCamelCased(rowObject));
}

module.exports = {
  convertPropNameToColumnNotation,
  getColumnsAndValues,
  convertPropNameToCamelCase,
  mapObjectToCamelCased,
  createPgClient,
  excuteQueryWithValuesDeprecated,
  excuteQuery,
};
