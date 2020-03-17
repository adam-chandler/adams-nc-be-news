exports.send405Error = (req, res, next) => {
  res.status(405).send({ msg: "method not allowed" });
};

exports.handleCustomErrors = (err, req, res, next) => {
  if (err.status) res.status(err.status).send({ msg: err.msg });
  else next(err);
};

exports.handlePSQLErrors = (err, req, res, next) => {
  const psqlBadRequestCodes = ["22P02"];
  if (psqlBadRequestCodes.includes(err.code)) {
    return res.status(400).send({ msg: "Bad request" });
  } else {
    next(err);
  }
};

exports.handleUnknownRoutes = (req, res, next) => {
  return res.status(404).send({ msg: "Route not found" });
};
