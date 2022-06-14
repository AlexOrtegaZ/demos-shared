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

//https://www.npmjs.com/package/sql-query
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
