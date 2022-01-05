const DbHelper = require('./db.helper');
const Manifesto = require('../models/manifesto.model');

class ManifestoRepository extends DbHelper {
  constructor() {
    super();
    this.entityName = Manifesto.name;
    this.tableName = 'manifesto';
    this.colId = 'manifesto_id';
  }
}

module.exports = new ManifestoRepository();
