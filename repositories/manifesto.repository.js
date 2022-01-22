const DbHelper = require('./db.helper');
const Manifesto = require('../models/manifesto.model');

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
}

module.exports = new ManifestoRepository();
