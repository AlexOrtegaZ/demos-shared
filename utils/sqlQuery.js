const sql = require('sql-query');

class SqlQuery {
  constructor() {
    this.sql = sql;
    this.query = sql.Query();
  }

  get select() {
    return this.query.select();
  }

  get create() {
    return this.query.create();
  }

  get insert() {
    return this.query.insert();
  }

  get remove() {
    return this.query.remove();
  }

  get update() {
    return this.query.update();
  }
}

module.exports = new SqlQuery();
