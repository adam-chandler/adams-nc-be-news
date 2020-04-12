const client = require("../db/index");

exports.selectArticle = (article_id) => {
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
    .leftJoin("comments", "comments.article_id", "articles.article_id")
    .groupBy("articles.article_id")
    .where("articles.article_id", article_id)
    .then((res) => {
      if (res.length === 0) {
        return Promise.reject({ msg: "Article not found", status: 404 });
      }
      return res[0];
    });
};

exports.updateArticleVotes = (article_id, newVotes) => {
  return client("articles")
    .increment("votes", newVotes)
    .where("articles.article_id", article_id)
    .returning("*")
    .then((res) => res[0]);
};

exports.selectAllArticles = (sort_by, order, author, topic) => {
  return Promise.all([
    client("articles")
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
      .orderBy(sort_by || "created_at", order || "desc")
      .leftJoin("comments", "comments.article_id", "articles.article_id")
      .groupBy("articles.article_id")
      .modify((query) => {
        if (author) {
          query.where("articles.author", author);
        }
      })
      .modify((query) => {
        if (topic) {
          query.where("articles.topic", topic);
        }
      }),
    client("users")
      .select("*")
      .where("username", author || "*"),
    client("topics")
      .select("*")
      .where("slug", topic || "*"),
  ]).then(([articles, user, outputTopic]) => {
    if (author && user.length === 0) {
      return Promise.reject({
        status: 404,
        msg: "Author not found",
      });
    }
    if (topic && outputTopic.length === 0) {
      return Promise.reject({
        status: 404,
        msg: "Topic not found",
      });
    }
    return articles;
  });
};
