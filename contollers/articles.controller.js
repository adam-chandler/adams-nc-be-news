const {
  selectArticle,
  updateArticleVotes
} = require("../models/articles.model");

exports.getArticle = (req, res, next) => {
  selectArticle(req.params.article_id)
    .then(article => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.patchArticleVotes = (req, res, next) => {
  if (Object.keys(req.body).length !== 1) {
    next({ status: 400, msg: "Bad request" });
  }

  const article_id = req.params.article_id;
  const newVotes = req.body.inc_votes;

  updateArticleVotes(article_id, newVotes)
    .then(() => selectArticle(article_id))
    .then(article => res.status(200).send({ article }))
    .catch(next);
};
