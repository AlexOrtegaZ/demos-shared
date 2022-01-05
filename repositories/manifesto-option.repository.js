const DbHelper = require('./db.helper');
const ManifestoOption = require('../models/manifesto-option.model');

class ManifestoOptionRepository extends DbHelper {
  constructor() {
    super();
    this.entityName = ManifestoOption.name;
    this.tableName = 'manifesto_option';
    this.colId = 'manifesto_option_id';
  }
}

module.exports = new ManifestoOptionRepository();
