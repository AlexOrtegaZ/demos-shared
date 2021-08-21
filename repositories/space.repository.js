const DbHelper = require('./db.helper');
const Space = require('../models/space.model');

class SpaceRepository extends DbHelper {
  constructor() {
    super();
    this.entityName = Space.name;
    this.tableName = 'spaces';
    this.colId = 'space_id';
  }
}

module.exports = new SpaceRepository();
