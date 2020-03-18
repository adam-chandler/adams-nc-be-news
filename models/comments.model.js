const client = require("../db/index");

exports.updateCommentVotes = (newVotes, comment_id) => {
  return client("comments")
    .increment("votes", newVotes)
    .where("comment_id", comment_id)
    .returning("*")
    .then(res => {
      if (res.length === 0) {
        return Promise.reject({ msg: "Comment not found", status: 404 });
      }
      return res[0];
    });
};

exports.delComment = comment_id => {
  return client("comments")
    .where({ comment_id })
    .del()
    .then(result => {
      if (!result) {
        return Promise.reject({ code: 400 });
      }
    });
};
