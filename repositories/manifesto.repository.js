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
        updated_by: userId 
      })
      .where({ manifesto_id: manifestoId })
      .build();
    await excuteQuery(query);
    return this.findById(manifestoId);
  }
}

module.exports = new ManifestoRepository();
