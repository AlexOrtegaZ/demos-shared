const DbHelper = require('./db.helper');
const ManifestoOption = require('../models/manifesto-option.model');

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
    return Promise.all(options.map(option => {
      const newOption = new ManifestoOption();
      newOption.manifestoId = manifestoId;
      newOption.title = option.title;
      newOption.createdBy = userId;
      newOption.updatedBy = userId;

      return this.create(newOption);
    }));
  }
}

module.exports = new ManifestoOptionRepository();
