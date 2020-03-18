const { updateCommentVotes, delComment } = require("../models/comments.model");

exports.patchCommentVotes = (req, res, next) => {
  const keys = Object.keys(req.body);
  if (keys.length !== 1 || keys[0] !== "inc_votes") {
    next({ status: 400, msg: "Bad request" });
  }
  const { comment_id } = req.params;
  const newVotes = req.body.inc_votes;
  updateCommentVotes(newVotes, comment_id)
    .then(comment => {
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
