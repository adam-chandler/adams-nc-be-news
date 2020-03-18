const client = require("../db/index");

exports.updateCommentVotes = (newVotes, comment_id) => {
  return client("comments")
    .increment("votes", newVotes)
    .where("comment_id", comment_id)
    .returning("*")
    .then(res => res[0]);
};
