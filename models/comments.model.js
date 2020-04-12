const client = require("../db/index");

exports.updateCommentVotes = (newVotes, comment_id) => {
  return client("comments")
    .increment("votes", newVotes)
    .where("comment_id", comment_id)
    .returning("*")
    .then((comment) => {
      if (comment.length === 0) {
        return Promise.reject({ msg: "Comment not found", status: 404 });
      }
      return comment[0];
    });
};

exports.delComment = (comment_id) => {
  return client("comments")
    .where({ comment_id })
    .del()
    .then((result) => {
      if (!result) {
        return Promise.reject({ msg: "Comment not found", status: 404 });
      }
    });
};

exports.insertComment = (username, body, article_id) => {
  return client("comments")
    .insert({
      author: username,
      article_id,
      body,
    })
    .returning("*")
    .then((res) => res[0]);
};

exports.selectComments = (article_id, sort_by, order_by) => {
  return Promise.all([
    client("comments")
      .select("*")
      .where("article_id", article_id)
      .orderBy(sort_by || "created_at", order_by || "desc"),
    client("articles").select("*").where("article_id", article_id),
  ]).then(([comments, article]) => {
    if (article.length === 0) {
      return Promise.reject({
        status: 404,
        msg: "No article exists with this id.",
      });
    }
    comments.forEach((comment) => delete comment.article_id);
    return comments;
  });
};
