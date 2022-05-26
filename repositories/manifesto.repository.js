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
const Manifesto = require('../models/manifesto.model');
const SqlQuery = require('../utils/sqlQuery');
const { excuteQuery } = require('./db.utils');

class ManifestoRepository extends DbHelper {
  constructor() {
    super();
    this.entityName = Manifesto.name;
    this.tableName = 'manifesto';
    this.colId = 'manifesto_id';
  }

  /**
   * Create manifesto
   * @param {Manifesto} manifesto
   * @param {number} spaceId
   * @param {number} userId
   * @returns {Promise<Manifesto>}
   */
  async createManifesto(manifesto, spaceId, userId) {
    const newManifiesto = new Manifesto();
    newManifiesto.title = manifesto.title;
    newManifiesto.content = manifesto.content;
    newManifiesto.optionType = manifesto.optionType;
    newManifiesto.spaceId = spaceId;
    newManifiesto.createdBy = userId;
    newManifiesto.updatedBy = userId;

    return this.create(newManifiesto);
  }

  /**
   * Update manifesto
   * @param {number} manifestoId
   * @param {Manifesto} manifesto
   * @param {number} userId
   * @returns {Promise<Manifesto>}
   */
  async updateManifesto(manifestoId, manifesto, userId) {
    const query = SqlQuery.update
      .into(this.tableName)
      .set({
        title: manifesto.title,
        content: manifesto.content,
        option_type: manifesto.optionType,
        updated_by: userId,
      })
      .where({ manifesto_id: manifestoId })
      .build();
    await excuteQuery(query);
    return this.findById(manifestoId);
  }

  /**
   * Find all manifestos by manifestoIds
   * @param {string[]} manifestoIds
   * @returns {Promise<Manifesto[]>}
   */
  async findAllByManifestoIds(manifestoIds) {
    const query = SqlQuery.select
      .from(this.tableName)
      .where({
        manifesto_id: manifestoIds,
      })
      .build();

    const result = await excuteQuery(query);
    return result;
  }
}

module.exports = new ManifestoRepository();
