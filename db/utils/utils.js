exports.formatDates = (list) => {
  return list.map((article) => {
    let newArticle = { ...article };
    newArticle.created_at = new Date(newArticle.created_at);
    return newArticle;
  });
};

exports.makeRefObj = (array) => {
  const lookUp = {};
  array.forEach((article) => (lookUp[article.title] = article.article_id));
  return lookUp;
};

exports.formatComments = (comments, articleRef) => {
  return comments.map((comment) => {
    let newComment = { ...comment };
    newComment.author = newComment.created_by;
    delete newComment.created_by;
    newComment.article_id = articleRef[newComment.belongs_to];
    delete newComment.belongs_to;
    newComment.created_at = new Date(newComment.created_at);
    return newComment;
  });
};
