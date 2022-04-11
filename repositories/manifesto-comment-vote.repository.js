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

const DbHelper = require("./db.helper");
const ManifestoCommentVote = require("../models/manifesto-comment-vote.model");

class ManifestoCommentVoteRepository extends DbHelper {
  constructor() {
    super();
    this.entityName = ManifestoCommentVote.name;
    this.tableName = "manifesto_comment_vote";
    this.colId = "manifesto_comment_vote_id";
  }
}

module.exports = new ManifestoCommentVoteRepository();
