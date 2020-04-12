const {
  updateCommentVotes,
  delComment,
  selectComments,
  insertComment,
} = require("../models/comments.model");

exports.patchCommentVotes = (req, res, next) => {
  const keys = Object.keys(req.body);
  if (keys.length !== 1 || keys[0] !== "inc_votes") {
    return next({ status: 400, msg: "Bad request" });
  }
  const { comment_id } = req.params;
  const newVotes = req.body.inc_votes;
  updateCommentVotes(newVotes, comment_id)
    .then((comment) => {
      res.status(200).send({ comment });
    })
    .catch(next);
};

exports.deleteComment = (req, res, next) => {
  delComment(req.params.comment_id)
    .then(() => {
      res.status(204).send();
    })
    .catch(next);
};

exports.postComment = (req, res, next) => {
  if (Object.keys(req.body).length !== 2) {
    return next({ status: 400, msg: "Bad request" });
  }

  const { username, body } = req.body;
  const { article_id } = req.params;

  insertComment(username, body, article_id)
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch(next);
};

exports.getComments = (req, res, next) => {
  const { sort_by, order_by } = req.query;
  const article_id = req.params.article_id;

  if (order_by) {
    if (order_by !== "asc" && order_by !== "desc") {
      return next({ status: 400, msg: "order_by takes values asc or desc" });
    }
  }
  selectComments(article_id, sort_by, order_by)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch(next);
};
