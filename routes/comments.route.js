const commentsRouter = require("express").Router();
const {
  patchCommentVotes,
  deleteComment
} = require("../contollers/comments.controller");
const { send405Error } = require("../errors/errors");

commentsRouter
  .route("/:comment_id")
  .patch(patchCommentVotes)
  .delete(deleteComment)
  .all(send405Error);

module.exports = commentsRouter;
