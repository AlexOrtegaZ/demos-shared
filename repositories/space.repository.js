const DbHelper = require('./db.helper');
const Space = require('../models/space.model');

class SpaceRepository extends DbHelper {
  constructor() {
    super();
    this.entityName = Space.name;
    this.tableName = 'spaces';
    this.colId = 'space_id';
  }

  findOneById(spaceId) {
    const space = new Space();
    space.spaceId = spaceId;
    return this.findOne(space);
  }
}

module.exports = new SpaceRepository();
