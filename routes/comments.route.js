const commentsRouter = require("express").Router();
const { patchCommentVotes } = require("../contollers/comments.controller");

commentsRouter.route("/:comment_id").patch(patchCommentVotes);

module.exports = commentsRouter;
