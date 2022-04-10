const DbHelper = require("./db.helper");

class ManifestoCommentRepository extends DbHelper {
    constructor() {
        super();
        this.entityName = Member.name;
        this.tableName = 'manifesto_comment';
        this.colId = 'manifesto_comment_id';
    }
}

module.exports = new ManifestoCommentRepository();