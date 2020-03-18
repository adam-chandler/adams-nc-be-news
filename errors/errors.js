exports.send405Error = (req, res, next) => {
  res.status(405).send({ msg: "method not allowed" });
};

exports.handleCustomErrors = (err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
};

exports.handlePSQLErrors = (err, req, res, next) => {
  const badRequestCodes = ["22P02", "23502", "42703"];
  const notFoundCodes = ["23503"];
  if (badRequestCodes.includes(err.code)) {
    return res.status(400).send({ msg: "Bad request" });
  } else if (notFoundCodes.includes(err.code)) {
    return res.status(404).send({ msg: "Not found" });
  } else {
    next(err);
  }
};

exports.serverError = (err, req, res, next) => {
  res.status(500).send({ msg: "Internal  Error" });
};

exports.handleUnknownRoutes = (req, res, next) => {
  return res.status(404).send({ msg: "Route not found" });
};
