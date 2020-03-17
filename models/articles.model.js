const client = require("../db/index");

selectArticle = article_id => {
  return client("articles")
    .select(
      "articles.author",
      "articles.title",
      "articles.article_id",
      "articles.body",
      "topic",
      "articles.created_at",
      "articles.votes"
    )
    .count("comments.comment_id AS comment_count")
    .join("comments", "comments.article_id", "articles.article_id")
    .groupBy("articles.article_id")
    .where("articles.article_id", article_id)
    .then(res => {
      if (res.length === 0) {
        return Promise.reject({ msg: "Article not found", status: 404 });
      } else {
        return res[0];
      }
    });
};

updateArticleVotes = (article_id, newVotes) => {
  return client("articles")
    .increment("votes", newVotes)
    .where("articles.article_id", article_id)
    .returning("*")
    .then(res => res[0]);
};

module.exports = { selectArticle, updateArticleVotes };
