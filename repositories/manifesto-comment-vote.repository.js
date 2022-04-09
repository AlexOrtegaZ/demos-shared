const DbHelper = require("./db.helper");

class ManifestoCommentVoteRepository extends DbHelper {
    constructor() {
        super();
        this.entityName = Member.name;
        this.tableName = 'manifesto_comment_vote';
        this.colId = 'manifesto_comment_vote_id';
    }
}

module.exports = new ManifestoCommentVoteRepository();