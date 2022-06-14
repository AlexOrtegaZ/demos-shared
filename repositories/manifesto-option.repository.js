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
const ManifestoOption = require('../models/manifesto-option.model');
const SqlQuery = require('../utils/sqlQuery');
const { excuteQuery } = require('./db.utils');

class ManifestoOptionRepository extends DbHelper {
  constructor() {
    super();
    this.entityName = ManifestoOption.name;
    this.tableName = 'manifesto_option';
    this.colId = 'manifesto_option_id';
  }

  /**
   * Create manifesto options
   * @param {ManifestoOption[]} options
   * @param {number} manifestoId
   * @param {number} userId
   * @returns {Promise<ManifestoOption[]>}
   */
  async createOptions(options, manifestoId, userId) {
    return Promise.all(
      options.map((option) => {
        return this.createOption(option, manifestoId, userId);
      })
    );
  }

  /**
   * Create manifesto option
   * @param {ManifestoOption} option
   * @param {number} manifestoId
   * @param {number} userId
   * @returns {Promise<ManifestoOption>}
   */
  async createOption(option, manifestoId, userId) {
    const newOption = new ManifestoOption();
    newOption.manifestoId = manifestoId;
    newOption.title = option.title;
    newOption.createdBy = userId;
    newOption.updatedBy = userId;

    return this.create(newOption);
  }

  /**
   * Update manifesto option
   * @param {ManifestoOption} option
   * @param {number} userId
   * @returns {Promise<ManifestoOption>}
   */
  async updateOption(option, userId) {
    const query = SqlQuery.update
      .into(this.tableName)
      .set({
        title: option.title,
        updated_by: userId,
      })
      .where({ [this.colId]: option.manifestoOptionId })
      .build();
    await excuteQuery(query);
    return this.findById(option.manifestoOptionId);
  }

  /**
   * Remove manifesto option
   * @param {number} manifestoOptionId
   * @returns {Promise<ManifestoOption>}
   */
  async removeOption(manifestoOptionId) {
    const query = SqlQuery.remove
      .from(this.tableName)
      .where({ [this.colId]: manifestoOptionId })
      .build();
    return await excuteQuery(query);
  }

  /**
   * Find All manifesto option by manifesto Id
   * @param {number} manifestoId
   * @returns {Promise<ManifestoOption[]>}
   */
  async findAllByManifestoId(manifestoId) {
    const query = SqlQuery.select.from(this.tableName).where({ manifesto_id: manifestoId }).build();
    return await excuteQuery(query);
  }

  /**
   * Update or create manifesto options
   * @param {ManifestoOption[]} options
   * @param {number} manifestoId
   * @param {number} userId
   * @returns {Promise<ManifestoOption[]>}
   */
  async updateOrCreateOptions(options, manifestoId, userId) {
    return Promise.all(
      options.map((option) => {
        return !!option.manifestoOptionId
          ? this.updateOption(option, userId)
          : this.createOption(option, manifestoId, userId);
      })
    );
  }

  /**
   * Remove manifesto options that are not on the currentOptions
   * @param {ManifestoOption[]} currentOptions
   * @param {number} manifestoId
   * @returns {Promise<ManifestoOption[]>}
   */
  async removeAllMissingOptions(currentOptions, manifestoId) {
    const manifestoOptions = await this.findAllByManifestoId(manifestoId);
    for (const option of manifestoOptions) {
      if (currentOptions.every(o => o.manifestoOptionId !== option.manifestoOptionId)) {
        await this.removeOption(option.manifestoOptionId);
      }
    }
  }

  /**
   * Find all manifestos by manifestoIds
   * @param {string[]} manifestoIds
   * @returns {Promise<ManifestoOption[]>}
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

module.exports = new ManifestoOptionRepository();
